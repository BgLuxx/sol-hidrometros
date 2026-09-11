import { listaUltimosMeses, nomeMes } from '../lib/format'

export default function MonthPicker({ mes, onChange }) {
  const meses = listaUltimosMeses(18)
  return (
    <select value={mes} onChange={(e) => onChange(e.target.value)} style={{ fontWeight: 800 }}>
      {meses.map((m) => (
        <option key={m} value={m}>{nomeMes(m)}</option>
      ))}
    </select>
  )
}
