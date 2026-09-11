import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { carregarCondominios } from '../lib/sync'

export default function Condominios() {
  const [lista, setLista] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    carregarCondominios().then(setLista)
  }, [])

  return (
    <div>
      <Header titulo="CONDOMÍNIOS" />
      <div className="container">
        {lista === null && <p style={{ textTransform: 'none', color: 'var(--texto-suave)' }}>Carregando...</p>}
        {lista?.length === 0 && (
          <p style={{ textTransform: 'none', color: 'var(--texto-suave)' }}>
            Nenhum condomínio cadastrado ainda. Rode o seed do Supabase (supabase/SETUP.md).
          </p>
        )}
        <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
          {lista?.map((c) => (
            <button
              key={c.slug}
              onClick={() => navigate(`/condominio/${c.slug}`)}
              className="card"
              style={{ padding: '18px 20px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textTransform: 'none' }}
            >
              <span style={{ fontWeight: 800, fontSize: 16, textTransform: 'uppercase', color: 'var(--texto)' }}>{c.nome}</span>
              <span style={{ color: 'var(--azul)', fontSize: 20 }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
