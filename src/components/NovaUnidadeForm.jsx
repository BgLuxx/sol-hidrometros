import { useState } from 'react'
import { criarUnidade } from '../lib/sync'

const TIPOS = ['CASA', 'OBRA', 'PORTARIA', 'OUTRO']

// Botão "+ QUADRA/LOTE" — cadastra uma unidade nova dentro da grade normal
// do condomínio (ex: uma casa que apareceu numa quadra já existente).
// Não lança leitura aqui, só cadastra — a leitura é feita depois pelo
// "+ LANÇAR HIDRÔMETRO" normal, igual as demais unidades.
export default function NovaUnidadeForm({ condominio, unidades, onFechar, onSalvo }) {
  const [quadra, setQuadra] = useState('')
  const [lote, setLote] = useState('')
  const [fase, setFase] = useState('CASA')
  const [anoFabricacao, setAnoFabricacao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  const etiqueta = `${quadra.trim().toUpperCase()}-${lote.trim().toUpperCase()}`
  const podeSalvar = quadra.trim() && lote.trim() && anoFabricacao !== '' && !salvando

  async function aoSalvar() {
    setErro(null)
    const jaExiste = unidades.some((u) => u.etiqueta.toUpperCase() === etiqueta)
    if (jaExiste) {
      setErro(`Já existe uma unidade "${etiqueta}" cadastrada. Use "Lançar Hidrômetro" pra lançar a leitura dela.`)
      return
    }
    setSalvando(true)
    try {
      await criarUnidade({
        condominio,
        etiqueta,
        quadra: quadra.trim().toUpperCase(),
        lote: lote.trim().toUpperCase(),
        fase,
        anoFabricacao: Number(anoFabricacao),
        avulsa: false,
      })
      onSalvo()
    } catch (e) {
      console.error(e)
      if (e?.message === 'já_existe') {
        setErro(`Já existe uma unidade "${etiqueta}" cadastrada.`)
      } else {
        setErro('Não foi possível cadastrar. Tente novamente.')
      }
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div style={sobreposicao}>
      <div style={painel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontSize: 16 }}>Nova Quadra/Lote</h3>
          <button onClick={onFechar} style={{ background: 'transparent', fontSize: 22, color: 'var(--texto-suave)', padding: 4 }}>✕</button>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          <p style={{ textTransform: 'none', fontSize: 13, color: 'var(--texto-suave)' }}>
            Use aqui quando aparecer uma unidade nova que ainda não está na lista do condomínio (ex: uma casa nova numa quadra existente). Depois de cadastrar, ela aparece normalmente em "Lançar Hidrômetro".
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={rotulo}>Quadra</label>
              <input type="text" placeholder="EX: Q05" value={quadra} onChange={(e) => setQuadra(e.target.value)} />
            </div>
            <div>
              <label style={rotulo}>Lote</label>
              <input type="text" placeholder="EX: L12" value={lote} onChange={(e) => setLote(e.target.value)} />
            </div>
          </div>

          {quadra.trim() && lote.trim() && (
            <div><span className="pill pill-azul">{etiqueta}</span></div>
          )}

          <div>
            <label style={rotulo}>Tipo</label>
            <select value={fase} onChange={(e) => setFase(e.target.value)}>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label style={rotulo}>Ano de fabricação do hidrômetro</label>
            <input
              type="number" inputMode="numeric" placeholder="EX: 2024"
              value={anoFabricacao} onChange={(e) => setAnoFabricacao(e.target.value)}
            />
          </div>

          {erro && <p style={{ color: 'var(--vermelho)', fontSize: 13, textTransform: 'none' }}>{erro}</p>}

          <button onClick={aoSalvar} disabled={!podeSalvar} className="btn btn-verde btn-bloco">
            {salvando ? 'SALVANDO...' : 'CADASTRAR'}
          </button>
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
