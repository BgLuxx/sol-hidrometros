import { useState } from 'react'

export default function FiltroBar({ quadras, filtro, onChange }) {
  const [tipo, setTipo] = useState(filtro?.tipo || '')

  function mudarTipo(novoTipo) {
    setTipo(novoTipo)
    if (!novoTipo) onChange(null)
    else onChange({ tipo: novoTipo, valor: '' })
  }

  return (
    <div className="card" style={{ padding: 12, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--texto-suave)' }}>FILTRAR:</span>
      <select value={tipo} onChange={(e) => mudarTipo(e.target.value)} style={{ width: 'auto', padding: '8px 10px', fontSize: 13 }}>
        <option value="">SEM FILTRO</option>
        <option value="quadra">POR QUADRA</option>
        <option value="dia">POR DIA</option>
      </select>

      {tipo === 'quadra' && (
        <select value={filtro?.valor || ''} onChange={(e) => onChange({ tipo, valor: e.target.value })} style={{ width: 'auto', padding: '8px 10px', fontSize: 13 }}>
          <option value="">TODAS</option>
          {quadras.map((q) => <option key={q} value={q}>{q}</option>)}
        </select>
      )}

      {tipo === 'dia' && (
        <input
          type="date" value={filtro?.valor || ''} onChange={(e) => onChange({ tipo, valor: e.target.value })}
          style={{ width: 'auto', padding: '8px 10px', fontSize: 13 }}
        />
      )}
    </div>
  )
}
