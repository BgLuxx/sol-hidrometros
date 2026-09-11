import { useState } from 'react'
import { carregarLeituras } from '../lib/sync'
import { gerarRelatorio } from '../lib/report'
import { listaUltimosMeses, mesAnteriorISO, nomeMes } from '../lib/format'

function porUnidade(leituras) {
  const mapa = {}
  for (const l of leituras) mapa[l.unidadeId] = l.leitura
  return mapa
}

export default function RelatorioMenu({ condominio, unidades, mesSelecionado, onFechar }) {
  const [modo, setModo] = useState('mes') // 'mes' | 'comparar'
  const [mesCompararA, setMesCompararA] = useState(mesAnteriorISO(mesSelecionado))
  const [mesCompararB, setMesCompararB] = useState(mesSelecionado)
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState(null)
  const meses = listaUltimosMeses(18)

  async function baixar(mesAnterior, mesAtual) {
    setGerando(true)
    setErro(null)
    try {
      const [leiturasAnterior, leiturasAtual] = await Promise.all([
        carregarLeituras(condominio, mesAnterior),
        carregarLeituras(condominio, mesAtual),
      ])
      await gerarRelatorio({
        condominio, unidades, mesAnterior, mesAtual,
        leiturasAnteriorPorUnidade: porUnidade(leiturasAnterior),
        leiturasAtualPorUnidade: porUnidade(leiturasAtual),
      })
      onFechar()
    } catch (e) {
      console.error(e)
      setErro('Não foi possível gerar o relatório agora.')
    } finally {
      setGerando(false)
    }
  }

  return (
    <div style={sobreposicao}>
      <div style={painel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16 }}>Gerar Relatório</h3>
          <button onClick={onFechar} style={{ background: 'transparent', fontSize: 22, color: 'var(--texto-suave)' }}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <button onClick={() => setModo('mes')} className={`btn ${modo === 'mes' ? 'btn-azul' : 'btn-fantasma'}`} style={{ flex: 1, fontSize: 12, padding: 12 }}>
            Relatório do mês
          </button>
          <button onClick={() => setModo('comparar')} className={`btn ${modo === 'comparar' ? 'btn-azul' : 'btn-fantasma'}`} style={{ flex: 1, fontSize: 12, padding: 12 }}>
            Comparar meses
          </button>
        </div>

        {modo === 'mes' && (
          <div style={{ display: 'grid', gap: 14 }}>
            <p style={{ textTransform: 'none', fontSize: 13, color: 'var(--texto-suave)' }}>
              Baixa a leitura de <strong>{nomeMes(mesSelecionado)}</strong> comparada com <strong>{nomeMes(mesAnteriorISO(mesSelecionado))}</strong> (mês anterior), no mesmo formato da planilha manual.
            </p>
            <button onClick={() => baixar(mesAnteriorISO(mesSelecionado), mesSelecionado)} disabled={gerando} className="btn btn-verde btn-bloco">
              {gerando ? 'GERANDO...' : 'BAIXAR RELATÓRIO'}
            </button>
          </div>
        )}

        {modo === 'comparar' && (
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={rotulo}>Mês anterior (base)</label>
              <select value={mesCompararA} onChange={(e) => setMesCompararA(e.target.value)}>
                {meses.map((m) => <option key={m} value={m}>{nomeMes(m)}</option>)}
              </select>
            </div>
            <div>
              <label style={rotulo}>Mês atual (comparar com)</label>
              <select value={mesCompararB} onChange={(e) => setMesCompararB(e.target.value)}>
                {meses.map((m) => <option key={m} value={m}>{nomeMes(m)}</option>)}
              </select>
            </div>
            <button onClick={() => baixar(mesCompararA, mesCompararB)} disabled={gerando} className="btn btn-verde btn-bloco">
              {gerando ? 'GERANDO...' : 'BAIXAR COMPARATIVO'}
            </button>
          </div>
        )}

        {erro && <p style={{ color: 'var(--vermelho)', fontSize: 13, marginTop: 12, textTransform: 'none' }}>{erro}</p>}
      </div>
    </div>
  )
}

const sobreposicao = {
  position: 'fixed', inset: 0, background: 'rgba(10,20,30,0.55)', zIndex: 50,
  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
}
const painel = {
  background: '#fff', width: '100%', maxWidth: 480, borderRadius: '20px 20px 0 0',
  padding: '20px 20px calc(20px + env(safe-area-inset-bottom))',
}
const rotulo = { display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--texto-suave)', marginBottom: 6 }
