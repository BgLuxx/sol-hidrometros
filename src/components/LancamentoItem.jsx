import { useEffect, useState } from 'react'
import { formatarDataHora } from '../lib/format'

export default function LancamentoItem({ lancamento, onEditar }) {
  const [urlFoto, setUrlFoto] = useState(lancamento.fotoUrl)
  const [ampliada, setAmpliada] = useState(false)

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
      <div
        onClick={() => urlFoto && setAmpliada(true)}
        style={{
          width: 56, height: 56, borderRadius: 10, background: '#eef1f4', flexShrink: 0,
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: urlFoto ? 'pointer' : 'default',
        }}
      >
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

      {ampliada && urlFoto && (
        <div
          onClick={() => setAmpliada(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <button
            onClick={() => setAmpliada(false)}
            style={{
              position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)',
              color: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40,
              fontSize: 20, lineHeight: '40px', textAlign: 'center', padding: 0,
            }}
            aria-label="Fechar"
          >
            ✕
          </button>
          <img
            src={urlFoto}
            alt={lancamento.etiqueta}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8, touchAction: 'pinch-zoom' }}
          />
          <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: 13, textTransform: 'none' }}>
            {lancamento.etiqueta} · toque fora da foto pra fechar
          </div>
        </div>
      )}
    </div>
  )
}
