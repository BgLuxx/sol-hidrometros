const NOMES_MES = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
]

export function mesAtualISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function mesAnteriorISO(mesISO) {
  const [ano, mes] = mesISO.split('-').map(Number)
  const d = new Date(ano, mes - 2, 1) // mes-1 (0-index) - 1 = mes anterior
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function nomeMes(mesISO) {
  const [ano, mes] = mesISO.split('-').map(Number)
  return `${NOMES_MES[mes - 1]} ${ano}`
}

export function listaUltimosMeses(qtd = 15) {
  const meses = []
  const hoje = new Date()
  for (let i = 0; i < qtd; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    meses.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return meses
}

export function formatarDataHora(isoOuData) {
  if (!isoOuData) return ''
  const d = new Date(isoOuData)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export function formatarData(isoOuData) {
  if (!isoOuData) return ''
  const d = new Date(isoOuData)
  return d.toLocaleDateString('pt-BR')
}

export function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
