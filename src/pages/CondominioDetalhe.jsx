import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import MonthPicker from '../components/MonthPicker'
import FiltroBar from '../components/FiltroBar'
import LancamentoItem from '../components/LancamentoItem'
import LancamentoForm from '../components/LancamentoForm'
import RelatorioMenu from '../components/RelatorioMenu'
import { carregarCondominios, carregarUnidades, carregarLeituras } from '../lib/sync'
import { mesAtualISO } from '../lib/format'

export default function CondominioDetalhe() {
  const { slug } = useParams()
  const [condominio, setCondominio] = useState(null)
  const [unidades, setUnidades] = useState([])
  const [mes, setMes] = useState(mesAtualISO())
  const [leituras, setLeituras] = useState(null)
  const [filtro, setFiltro] = useState(null)
  const [formAberto, setFormAberto] = useState(false)
  const [lancamentoEditando, setLancamentoEditando] = useState(null)
  const [relatorioAberto, setRelatorioAberto] = useState(false)
  const [recarregar, setRecarregar] = useState(0)

  useEffect(() => {
    carregarCondominios().then((lista) => {
      const c = lista.find((x) => x.slug === slug) || { slug, nome: slug, id: slug }
      setCondominio(c)
    })
  }, [slug])

  useEffect(() => {
    if (!condominio) return
    carregarUnidades(condominio).then(setUnidades)
  }, [condominio])

  useEffect(() => {
    if (!condominio) return
    setLeituras(null)
    carregarLeituras(condominio, mes).then(setLeituras)
  }, [condominio, mes, recarregar])

  const quadras = useMemo(() => [...new Set(unidades.map((u) => u.quadra))].sort(), [unidades])

  const leiturasFiltradas = useMemo(() => {
    if (!leituras) return []
    if (!filtro?.valor) return leituras
    if (filtro.tipo === 'quadra') return leituras.filter((l) => l.quadra === filtro.valor)
    if (filtro.tipo === 'dia') return leituras.filter((l) => l.dataLeitura === filtro.valor)
    return leituras
  }, [leituras, filtro])

  function aoSalvarLancamento() {
    setFormAberto(false)
    setLancamentoEditando(null)
    setRecarregar((n) => n + 1)
  }

  if (!condominio) return null

  return (
    <div>
      <Header titulo={condominio.nome} voltar />
      <div className="container">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <MonthPicker mes={mes} onChange={setMes} />
          <span style={{ fontSize: 12, color: 'var(--texto-suave)', textTransform: 'none' }}>
            {leituras ? `${leituras.length} de ${unidades.length} unidades lançadas` : '...'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <button onClick={() => { setLancamentoEditando(null); setFormAberto(true) }} className="btn btn-azul">
            + LANÇAR HIDRÔMETRO
          </button>
          <button onClick={() => setRelatorioAberto(true)} className="btn btn-laranja">
            📄 RELATÓRIO
          </button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <FiltroBar quadras={quadras} filtro={filtro} onChange={setFiltro} />
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {leituras === null && <p style={{ textTransform: 'none', color: 'var(--texto-suave)' }}>Carregando lançamentos...</p>}
          {leituras?.length === 0 && (
            <p style={{ textTransform: 'none', color: 'var(--texto-suave)' }}>Nenhum lançamento neste mês ainda.</p>
          )}
          {leiturasFiltradas.map((l) => (
            <LancamentoItem key={l.id} lancamento={l} onEditar={(x) => { setLancamentoEditando(x); setFormAberto(true) }} />
          ))}
        </div>
      </div>

      {formAberto && (
        <LancamentoForm
          condominio={condominio}
          unidades={unidades}
          mesReferencia={mes}
          lancamentoExistente={lancamentoEditando}
          onFechar={() => { setFormAberto(false); setLancamentoEditando(null) }}
          onSalvo={aoSalvarLancamento}
        />
      )}

      {relatorioAberto && (
        <RelatorioMenu
          condominio={condominio}
          unidades={unidades}
          mesSelecionado={mes}
          onFechar={() => setRelatorioAberto(false)}
        />
      )}
    </div>
  )
}
