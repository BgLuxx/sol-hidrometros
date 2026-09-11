import { openDB } from 'idb'

// Banco local (IndexedDB) — é o que permite lançar hidrômetro SEM SINAL.
// - "unidades_cache": lista de quadras/lotes de cada condomínio (baixada 1x, usada offline depois)
// - "leituras_cache": leituras já sincronizadas, guardadas localmente para ver a lista offline
// - "pendentes": lançamentos feitos offline (ou que falharam ao enviar), na fila para sincronizar

const DB_NAME = 'sol-hidrometros'
const DB_VERSION = 1

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('condominios_cache')) {
        db.createObjectStore('condominios_cache', { keyPath: 'slug' })
      }
      if (!db.objectStoreNames.contains('unidades_cache')) {
        db.createObjectStore('unidades_cache', { keyPath: 'slug' })
      }
      if (!db.objectStoreNames.contains('leituras_cache')) {
        // chave: `${condominioSlug}|${mesReferencia}`
        db.createObjectStore('leituras_cache', { keyPath: 'chave' })
      }
      if (!db.objectStoreNames.contains('pendentes')) {
        const store = db.createObjectStore('pendentes', { keyPath: 'localId', autoIncrement: true })
        store.createIndex('por_chave', 'chave')
      }
    },
  })
}

// ---------- condomínios ----------
export async function salvarCondominiosCache(lista) {
  const db = await getDB()
  const tx = db.transaction('condominios_cache', 'readwrite')
  for (const c of lista) await tx.store.put(c)
  await tx.done
}
export async function lerCondominiosCache() {
  const db = await getDB()
  return db.getAll('condominios_cache')
}

// ---------- unidades (cadastro de quadras/lotes) ----------
export async function salvarUnidadesCache(slug, unidades) {
  const db = await getDB()
  await db.put('unidades_cache', { slug, unidades, salvoEm: Date.now() })
}
export async function lerUnidadesCache(slug) {
  const db = await getDB()
  const registro = await db.get('unidades_cache', slug)
  return registro?.unidades || []
}

// ---------- leituras sincronizadas (cache de leitura) ----------
function chaveMes(condominioSlug, mesReferencia) {
  return `${condominioSlug}|${mesReferencia}`
}
export async function salvarLeiturasCache(condominioSlug, mesReferencia, leituras) {
  const db = await getDB()
  await db.put('leituras_cache', { chave: chaveMes(condominioSlug, mesReferencia), leituras, salvoEm: Date.now() })
}
export async function lerLeiturasCache(condominioSlug, mesReferencia) {
  const db = await getDB()
  const registro = await db.get('leituras_cache', chaveMes(condominioSlug, mesReferencia))
  return registro?.leituras || []
}

// ---------- fila de pendentes (offline) ----------
export async function adicionarPendente(item) {
  const db = await getDB()
  const chave = chaveMes(item.condominioSlug, item.mesReferencia)
  const localId = await db.add('pendentes', { ...item, chave, tentativas: 0, criadoLocalEm: Date.now() })
  return localId
}
export async function listarPendentes() {
  const db = await getDB()
  return db.getAll('pendentes')
}
export async function listarPendentesPorMes(condominioSlug, mesReferencia) {
  const db = await getDB()
  return db.getAllFromIndex('pendentes', 'por_chave', chaveMes(condominioSlug, mesReferencia))
}
export async function removerPendente(localId) {
  const db = await getDB()
  await db.delete('pendentes', localId)
}
export async function atualizarPendente(localId, dados) {
  const db = await getDB()
  const atual = await db.get('pendentes', localId)
  if (!atual) return
  await db.put('pendentes', { ...atual, ...dados })
}
export async function contarPendentes() {
  const db = await getDB()
  return db.count('pendentes')
}
