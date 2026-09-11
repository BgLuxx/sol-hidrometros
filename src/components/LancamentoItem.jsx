import { useEffect, useState } from 'react'
import { formatarDataHora } from '../lib/format'

export default function LancamentoItem({ lancamento, onEditar }) {
  const [urlFoto, setUrlFoto] = useState(lancamento.fotoUrl)

  useEffect(() => {
    if (lancamento.fotoUrl) { setUrlFoto(lancamento.fotoUrl); return }
    if (lancamento.fotoBlobLocal) {
      const url = URL.createObjectURL(lancamento.fotoBlobLocal)
      setUrlFoto(url)
      return () => URL.revokeObjectURL(url)
    }
    setUrlFoto(null)
  }, [lancamento.fotoUrl, lancamento.fotoBlobLocal])

  return (
    <div className="card" style={{ display: 'flex', gap: 12, padding: 12, alignItems: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 10, background: '#eef1f4', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {urlFoto ? (
          <img src={urlFoto} alt={lancamento.etiqueta} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 20 }}>📷</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <strong style={{ fontSize: 15 }}>{lancamento.etiqueta}</strong>
          <span className="pill pill-cinza">{lancamento.fase}</span>
          {lancamento.pendente && <span className="pill pill-amarelo">PENDENTE</span>}
        </div>
        <div style={{ fontSize: 13, color: 'var(--texto-suave)', textTransform: 'none', marginTop: 2 }}>
          Leitura: <strong style={{ color: 'var(--texto)' }}>{lancamento.leitura} m³</strong>
        </div>
        <div style={{ fontSize: 11, color: 'var(--texto-suave)', textTransform: 'none' }}>
          {formatarDataHora(lancamento.criadoEm)}
        </div>
      </div>
      <button onClick={() => onEditar(lancamento)} className="btn-fantasma" style={{ padding: '8px 12px', borderRadius: 10, fontSize: 12, textTransform: 'uppercase' }}>
        Editar
      </button>
    </div>
  )
}
