import { useMemo, useRef, useState } from 'react'
import { comprimirImagem } from '../lib/image'
import { salvarLancamento, excluirLancamento } from '../lib/sync'
import { hojeISO } from '../lib/format'

export default function LancamentoForm({ condominio, unidades, mesReferencia, lancamentoExistente, onFechar, onSalvo }) {
  const editando = Boolean(lancamentoExistente)
  const inputFotoRef = useRef(null)

  const unidadeInicial = editando ? unidades.find((u) => u.id === lancamentoExistente.unidadeId) : null

  const [fotoBlob, setFotoBlob] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(lancamentoExistente?.fotoUrl || null)
  const [quadra, setQuadra] = useState(unidadeInicial?.quadra || '')
  const [lote, setLote] = useState(unidadeInicial?.lote || '')
  const [leitura, setLeitura] = useState(lancamentoExistente?.leitura ?? '')
  const [dataLeitura, setDataLeitura] = useState(lancamentoExistente?.dataLeitura || hojeISO())
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)
  const [processandoFoto, setProcessandoFoto] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  const quadras = useMemo(() => {
    const s = new Set(unidades.map((u) => u.quadra))
    return [...s].sort()
  }, [unidades])

  const lotes = useMemo(() => {
    return unidades.filter((u) => u.quadra === quadra).sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
  }, [unidades, quadra])

  const unidadeSelecionada = useMemo(
    () => unidades.find((u) => u.quadra === quadra && u.lote === lote),
    [unidades, quadra, lote],
  )

  async function aoEscolherFoto(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    setProcessandoFoto(true)
    try {
      const comprimida = await comprimirImagem(arquivo)
      setFotoBlob(comprimida)
      setFotoPreview(URL.createObjectURL(comprimida))
    } finally {
      setProcessandoFoto(false)
    }
  }

  async function aoSalvar() {
    if (!unidadeSelecionada || leitura === '') return
    setSalvando(true)
    setErro(null)
    try {
      await salvarLancamento({
        condominio,
        unidade: unidadeSelecionada,
        mesReferencia,
        leitura: Number(leitura),
        fotoBlob,
        dataLeitura,
        leituraExistenteId: editando && !lancamentoExistente.pendente ? lancamentoExistente.id : null,
        localIdExistente: editando && lancamentoExistente.pendente ? lancamentoExistente.localId : null,
      })
      onSalvo()
    } catch (e) {
      console.error(e)
      setErro('Não foi possível salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  async function aoExcluir() {
    setExcluindo(true)
    setErro(null)
    try {
      await excluirLancamento(condominio, lancamentoExistente)
      onSalvo()
    } catch (e) {
      console.error(e)
      setErro('Não foi possível apagar. Tente novamente.')
      setExcluindo(false)
      setConfirmandoExclusao(false)
    }
  }

  const mostrarEtiqueta = editando || fotoBlob || fotoPreview
  const mostrarLeitura = editando || (quadra && lote)
  const podeSalvar = unidadeSelecionada && leitura !== '' && !salvando

  return (
    <div style={sobreposicao}>
      <div style={painel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontSize: 16 }}>{editando ? 'Editar Lançamento' : 'Novo Lançamento'}</h3>
          <button onClick={onFechar} style={{ background: 'transparent', fontSize: 22, color: 'var(--texto-suave)', padding: 4 }}>✕</button>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          {/* Foto */}
          <div>
            <label style={rotulo}>Foto do hidrômetro</label>
            <input ref={inputFotoRef} type="file" accept="image/*" onChange={aoEscolherFoto} style={{ display: 'none' }} />
            {fotoPreview ? (
              <div style={{ position: 'relative' }}>
                <img src={fotoPreview} alt="Foto do hidrômetro" style={{ width: '100%', borderRadius: 12, maxHeight: 260, objectFit: 'cover' }} />
                <button onClick={() => inputFotoRef.current?.click()} className="btn btn-fantasma" style={{ position: 'absolute', bottom: 10, right: 10, background: '#fff', fontSize: 12, padding: '8px 12px' }}>
                  Trocar foto
                </button>
              </div>
            ) : (
              <button onClick={() => inputFotoRef.current?.click()} className="btn btn-azul btn-bloco" disabled={processandoFoto}>
                📷 {processandoFoto ? 'PROCESSANDO...' : 'TIRAR FOTO'}
              </button>
            )}
          </div>

          {/* Etiqueta */}
          {mostrarEtiqueta && (
            <div>
              <label style={rotulo}>Etiqueta (Quadra - Lote)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <select value={quadra} onChange={(e) => { setQuadra(e.target.value); setLote('') }}>
                  <option value="">QUADRA</option>
                  {quadras.map((q) => <option key={q} value={q}>{q}</option>)}
                </select>
                <select value={lote} onChange={(e) => setLote(e.target.value)} disabled={!quadra}>
                  <option value="">LOTE</option>
                  {lotes.map((u) => <option key={u.id} value={u.lote}>{u.lote}</option>)}
                </select>
              </div>
              {unidadeSelecionada && (
                <div style={{ marginTop: 8 }}>
                  <span className="pill pill-azul">{unidadeSelecionada.etiqueta}</span>{' '}
                  <span className="pill pill-cinza">{unidadeSelecionada.fase}</span>
                </div>
              )}
            </div>
          )}

          {/* Leitura */}
          {mostrarLeitura && (
            <div>
              <label style={rotulo}>Leitura (m³)</label>
              <input
                type="number" inputMode="decimal" placeholder="EX: 492"
                value={leitura} onChange={(e) => setLeitura(e.target.value)}
                style={{ fontSize: 22, fontWeight: 800, textAlign: 'center' }}
              />
              <label style={{ ...rotulo, marginTop: 12 }}>Data da leitura</label>
              <input type="date" value={dataLeitura} onChange={(e) => setDataLeitura(e.target.value)} />
            </div>
          )}

          {erro && <p style={{ color: 'var(--vermelho)', fontSize: 13, textTransform: 'none' }}>{erro}</p>}

          {mostrarLeitura && (
            <button onClick={aoSalvar} disabled={!podeSalvar} className="btn btn-verde btn-bloco">
              {salvando ? 'SALVANDO...' : 'SALVAR'}
            </button>
          )}

          {editando && !confirmandoExclusao && (
            <button onClick={() => setConfirmandoExclusao(true)} className="btn btn-fantasma btn-bloco" style={{ borderColor: 'var(--vermelho)', color: 'var(--vermelho)' }}>
              🗑 APAGAR LANÇAMENTO
            </button>
          )}

          {editando && confirmandoExclusao && (
            <div className="card" style={{ padding: 16, borderColor: 'var(--vermelho)' }}>
              <p style={{ textTransform: 'none', fontSize: 13, marginBottom: 12, color: 'var(--texto)' }}>
                Tem certeza que quer apagar o lançamento de <strong>{lancamentoExistente.etiqueta}</strong> desse mês? Essa ação não pode ser desfeita.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setConfirmandoExclusao(false)} disabled={excluindo} className="btn btn-fantasma" style={{ flex: 1 }}>
                  CANCELAR
                </button>
                <button onClick={aoExcluir} disabled={excluindo} className="btn btn-vermelho" style={{ flex: 1 }}>
                  {excluindo ? 'APAGANDO...' : 'SIM, APAGAR'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const sobreposicao = {
  position: 'fixed', inset: 0, background: 'rgba(10,20,30,0.55)', zIndex: 50,
  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
}
const painel = {
  background: '#fff', width: '100%', maxWidth: 480, maxHeight: '92dvh', overflowY: 'auto',
  borderRadius: '20px 20px 0 0', padding: '20px 20px calc(20px + env(safe-area-inset-bottom))',
}
const rotulo = { display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--texto-suave)', marginBottom: 6 }
