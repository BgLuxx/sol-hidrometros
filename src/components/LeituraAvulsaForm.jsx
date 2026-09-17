import { useRef, useState } from 'react'
import { comprimirImagem } from '../lib/image'
import { criarLeituraAvulsa } from '../lib/sync'
import { hojeISO } from '../lib/format'

const TIPOS = ['PORTARIA', 'CASA', 'OBRA', 'OUTRO']

// Botão "+ LEITURA AVULSA" — pra algo que NÃO está na grade de quadra/lote
// do condomínio (ex: a portaria). Cadastra e já lança a leitura de uma vez.
// Da próxima vez (mês seguinte), usa o "Lançar Hidrômetro" normal — não
// precisa cadastrar de novo.
export default function LeituraAvulsaForm({ condominio, unidades, mesReferencia, onFechar, onSalvo }) {
  const inputFotoRef = useRef(null)
  const [identificacao, setIdentificacao] = useState('')
  const [fase, setFase] = useState('PORTARIA')
  const [anoFabricacao, setAnoFabricacao] = useState('')
  const [leitura, setLeitura] = useState('')
  const [dataLeitura, setDataLeitura] = useState(hojeISO())
  const [fotoBlob, setFotoBlob] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [processandoFoto, setProcessandoFoto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  const etiqueta = identificacao.trim().toUpperCase()
  const podeSalvar = etiqueta && anoFabricacao !== '' && leitura !== '' && !salvando

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
    setErro(null)
    const jaExiste = unidades.some((u) => u.etiqueta.toUpperCase() === etiqueta)
    if (jaExiste) {
      setErro(`"${etiqueta}" já está cadastrada. Use "Lançar Hidrômetro" pra lançar a leitura deste mês.`)
      return
    }
    setSalvando(true)
    try {
      await criarLeituraAvulsa({
        condominio,
        mesReferencia,
        etiqueta,
        fase,
        anoFabricacao: Number(anoFabricacao),
        leitura: Number(leitura),
        fotoBlob,
        dataLeitura,
      })
      onSalvo()
    } catch (e) {
      console.error(e)
      if (e?.message === 'já_existe') {
        setErro(`"${etiqueta}" já está cadastrada. Use "Lançar Hidrômetro" pra lançar a leitura deste mês.`)
      } else {
        setErro('Não foi possível salvar. Tente novamente.')
      }
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div style={sobreposicao}>
      <div style={painel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontSize: 16 }}>Leitura Avulsa</h3>
          <button onClick={onFechar} style={{ background: 'transparent', fontSize: 22, color: 'var(--texto-suave)', padding: 4 }}>✕</button>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          <p style={{ textTransform: 'none', fontSize: 13, color: 'var(--texto-suave)' }}>
            Use aqui pra algo que não tem quadra/lote, tipo a portaria. Cadastra e já lança a leitura de uma vez. No mês que vem, é só usar "Lançar Hidrômetro" normal.
          </p>

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

          <div>
            <label style={rotulo}>Identificação</label>
            <input type="text" placeholder="EX: PORTARIA 03" value={identificacao} onChange={(e) => setIdentificacao(e.target.value)} />
          </div>

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

          {erro && <p style={{ color: 'var(--vermelho)', fontSize: 13, textTransform: 'none' }}>{erro}</p>}

          <button onClick={aoSalvar} disabled={!podeSalvar} className="btn btn-verde btn-bloco">
            {salvando ? 'SALVANDO...' : 'SALVAR'}
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
