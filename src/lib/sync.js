import { supabase } from './supabaseClient'
import {
  salvarCondominiosCache, lerCondominiosCache,
  salvarUnidadesCache, lerUnidadesCache,
  salvarLeiturasCache, lerLeiturasCache,
  adicionarPendente, listarPendentesPorMes, removerPendente, atualizarPendente,
  contarPendentes,
} from './localdb'
import { CONDOMINIOS_SEED } from '../data/condominios'

const BUCKET = 'hidrometros'

export function estaOnline() {
  return typeof navigator === 'undefined' ? true : navigator.onLine
}

// ---------------- Condomínios ----------------
export async function carregarCondominios() {
  if (estaOnline() && supabase) {
    try {
      const { data, error } = await supabase.from('condominios').select('id, slug, nome').order('nome')
      if (error) throw error
      if (data?.length) {
        await salvarCondominiosCache(data)
        return data
      }
    } catch (e) {
      console.warn('Falha ao buscar condomínios online, usando cache local.', e)
    }
  }
  const cache = await lerCondominiosCache()
  if (cache.length) return cache
  // último recurso: cadastro estático embutido no app
  return Object.values(CONDOMINIOS_SEED).map((c) => ({ id: c.slug, slug: c.slug, nome: c.nome }))
}

// ---------------- Unidades (quadras/lotes) ----------------
export async function carregarUnidades(condominio) {
  if (estaOnline() && supabase) {
    try {
      const { data, error } = await supabase
        .from('unidades')
        .select('*')
        .eq('condominio_id', condominio.id)
        .order('ordem')
      if (error) throw error
      if (data?.length) {
        await salvarUnidadesCache(condominio.slug, data)
        return data
      }
    } catch (e) {
      console.warn('Falha ao buscar unidades online, usando cache local.', e)
    }
  }
  const cache = await lerUnidadesCache(condominio.slug)
  if (cache.length) return cache
  return CONDOMINIOS_SEED[condominio.slug]?.unidades || []
}

// ---------------- Leituras (lançamentos de um mês) ----------------
export async function carregarLeituras(condominio, mesReferencia) {
  let base = []
  if (estaOnline() && supabase) {
    try {
      const { data, error } = await supabase
        .from('leituras')
        .select('*, unidades!inner(id, etiqueta, quadra, lote, fase, condominio_id)')
        .eq('unidades.condominio_id', condominio.id)
        .eq('mes_referencia', mesReferencia)
      if (error) throw error
      base = (data || []).map(mapLeituraRemota)
      await salvarLeiturasCache(condominio.slug, mesReferencia, base)
    } catch (e) {
      console.warn('Falha ao buscar leituras online, usando cache local.', e)
      base = await lerLeiturasCache(condominio.slug, mesReferencia)
    }
  } else {
    base = await lerLeiturasCache(condominio.slug, mesReferencia)
  }

  const pendentes = await listarPendentesPorMes(condominio.slug, mesReferencia)
  const idsOcultar = new Set(
    pendentes.filter((p) => p.tipo === 'update' || p.tipo === 'delete').map((p) => p.remoteLeituraId),
  )
  const semSobrepostas = base.filter((l) => !idsOcultar.has(l.id))

  const pendentesComoLeitura = pendentes.filter((p) => p.tipo !== 'delete').map(pendenteParaLeitura)
  const todas = [...semSobrepostas, ...pendentesComoLeitura]
  todas.sort((a, b) => (a.etiqueta > b.etiqueta ? 1 : -1))
  return todas
}

function mapLeituraRemota(row) {
  return {
    id: row.id,
    unidadeId: row.unidade_id,
    etiqueta: row.unidades?.etiqueta,
    quadra: row.unidades?.quadra,
    lote: row.unidades?.lote,
    fase: row.unidades?.fase,
    mesReferencia: row.mes_referencia,
    leitura: row.leitura,
    fotoUrl: row.foto_url,
    fotoPath: row.foto_path,
    fotoBlobLocal: null,
    dataLeitura: row.data_leitura,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
    pendente: false,
    localId: null,
  }
}

function pendenteParaLeitura(p) {
  return {
    id: `pendente-${p.localId}`,
    unidadeId: p.unidadeId,
    etiqueta: p.etiqueta,
    quadra: p.quadra,
    lote: p.lote,
    fase: p.fase,
    mesReferencia: p.mesReferencia,
    leitura: p.leitura,
    fotoUrl: null,
    fotoBlobLocal: p.fotoBlob || null,
    dataLeitura: p.dataLeitura,
    criadoEm: p.criadoLocalEm ? new Date(p.criadoLocalEm).toISOString() : new Date().toISOString(),
    atualizadoEm: p.criadoLocalEm ? new Date(p.criadoLocalEm).toISOString() : new Date().toISOString(),
    pendente: true,
    localId: p.localId,
  }
}

// ---------------- Criar / editar lançamento ----------------
// unidade: { id, etiqueta, quadra, lote, fase }
export async function salvarLancamento({
  condominio, unidade, mesReferencia, leitura, fotoBlob, dataLeitura, leituraExistenteId, localIdExistente,
}) {
  // Já existe como pendente local (ainda não sincronizado) -> só atualiza a fila
  if (localIdExistente) {
    await atualizarPendente(localIdExistente, {
      leitura, dataLeitura, ...(fotoBlob ? { fotoBlob } : {}),
    })
    tentarSincronizar()
    return { pendente: true }
  }

  if (estaOnline() && supabase) {
    try {
      let fotoPath = null
      let fotoUrl = null
      if (fotoBlob) {
        const caminho = `${condominio.slug}/${mesReferencia}/${unidade.etiqueta}-${Date.now()}.jpg`
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(caminho, fotoBlob, {
          contentType: 'image/jpeg', upsert: true,
        })
        if (upErr) throw upErr
        fotoPath = caminho
        fotoUrl = supabase.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl
      }

      const payload = {
        unidade_id: unidade.id,
        mes_referencia: mesReferencia,
        leitura,
        data_leitura: dataLeitura,
        ...(fotoPath ? { foto_path: fotoPath, foto_url: fotoUrl } : {}),
      }

      let resultado
      if (leituraExistenteId) {
        resultado = await supabase.from('leituras').update(payload).eq('id', leituraExistenteId).select().single()
      } else {
        resultado = await supabase.from('leituras').upsert(payload, { onConflict: 'unidade_id,mes_referencia' }).select().single()
      }
      if (resultado.error) throw resultado.error
      return { pendente: false, leitura: resultado.data }
    } catch (e) {
      console.warn('Falha ao salvar online, colocando na fila offline.', e)
      // cai para o fluxo offline abaixo
    }
  }

  // Offline (ou falhou ao enviar): guarda na fila local
  const localId = await adicionarPendente({
    tipo: leituraExistenteId ? 'update' : 'create',
    remoteLeituraId: leituraExistenteId || null,
    condominioSlug: condominio.slug,
    unidadeId: unidade.id,
    etiqueta: unidade.etiqueta,
    quadra: unidade.quadra,
    lote: unidade.lote,
    fase: unidade.fase,
    mesReferencia,
    leitura,
    dataLeitura,
    fotoBlob: fotoBlob || null,
  })
  return { pendente: true, localId }
}

// ---------------- Excluir lançamento ----------------
export async function excluirLancamento(condominio, lancamento) {
  // Ainda não sincronizado (só existe no aparelho): remove direto da fila.
  if (lancamento.pendente) {
    await removerPendente(lancamento.localId)
    return
  }

  if (estaOnline() && supabase) {
    const { error } = await supabase.from('leituras').delete().eq('id', lancamento.id)
    if (error) throw error
    if (lancamento.fotoPath) {
      try { await supabase.storage.from(BUCKET).remove([lancamento.fotoPath]) } catch { /* não bloqueia a exclusão */ }
    }
    return
  }

  // Offline e já estava sincronizado: guarda a exclusão na fila pra rodar quando voltar o sinal.
  await adicionarPendente({
    tipo: 'delete',
    remoteLeituraId: lancamento.id,
    condominioSlug: condominio.slug,
    unidadeId: lancamento.unidadeId,
    etiqueta: lancamento.etiqueta,
    quadra: lancamento.quadra,
    lote: lancamento.lote,
    fase: lancamento.fase,
    mesReferencia: lancamento.mesReferencia,
    leitura: lancamento.leitura,
    dataLeitura: lancamento.dataLeitura,
    fotoBlob: null,
  })
}

// ---------------- Sincronização da fila ----------------
let sincronizando = false
const ouvintes = new Set()

export function aoMudarStatusSync(fn) {
  ouvintes.add(fn)
  return () => ouvintes.delete(fn)
}
async function avisarOuvintes() {
  const pendentes = await contarPendentes()
  for (const fn of ouvintes) fn(pendentes)
}

export async function tentarSincronizar() {
  if (sincronizando || !estaOnline() || !supabase) {
    await avisarOuvintes()
    return
  }
  sincronizando = true
  try {
    const { getDB } = await import('./localdb')
    const db = await getDB()
    const pendentes = await db.getAll('pendentes')
    for (const p of pendentes) {
      try {
        if (p.tipo === 'delete') {
          if (p.remoteLeituraId) {
            const { error } = await supabase.from('leituras').delete().eq('id', p.remoteLeituraId)
            if (error) throw error
          }
          await removerPendente(p.localId)
          continue
        }
        let fotoPath = null
        let fotoUrl = null
        if (p.fotoBlob) {
          const caminho = `${p.condominioSlug}/${p.mesReferencia}/${p.etiqueta}-${p.localId}-${Date.now()}.jpg`
          const { error: upErr } = await supabase.storage.from(BUCKET).upload(caminho, p.fotoBlob, {
            contentType: 'image/jpeg', upsert: true,
          })
          if (upErr) throw upErr
          fotoPath = caminho
          fotoUrl = supabase.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl
        }
        const payload = {
          unidade_id: p.unidadeId,
          mes_referencia: p.mesReferencia,
          leitura: p.leitura,
          data_leitura: p.dataLeitura,
          ...(fotoPath ? { foto_path: fotoPath, foto_url: fotoUrl } : {}),
        }
        let resultado
        if (p.tipo === 'update' && p.remoteLeituraId) {
          resultado = await supabase.from('leituras').update(payload).eq('id', p.remoteLeituraId).select().single()
        } else {
          resultado = await supabase.from('leituras').upsert(payload, { onConflict: 'unidade_id,mes_referencia' }).select().single()
        }
        if (resultado.error) throw resultado.error
        await removerPendente(p.localId)
      } catch (e) {
        console.warn('Item continua pendente (falhou ao sincronizar):', p.etiqueta, e)
        await atualizarPendente(p.localId, { tentativas: (p.tentativas || 0) + 1 })
      }
    }
  } finally {
    sincronizando = false
    await avisarOuvintes()
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => tentarSincronizar())
  setInterval(() => { if (estaOnline()) tentarSincronizar() }, 30000)
}
