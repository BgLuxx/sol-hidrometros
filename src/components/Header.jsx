import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOnline } from '../context/OnlineContext'

export default function Header({ titulo, voltar }) {
  const navigate = useNavigate()
  const { sair } = useAuth()
  const { online, pendentes } = useOnline()

  return (
    <>
      <div className="topbar">
        {voltar && (
          <button onClick={() => navigate(-1)} className="btn-fantasma" style={{ padding: '6px 10px', border: 'none', color: '#fff', fontSize: 20 }}>
            ←
          </button>
        )}
        <img src="/logo.png" alt="SOL Soluções" />
        <h1>{titulo}</h1>
        <button onClick={sair} title="Sair" style={{ background: 'transparent', color: '#fff', fontSize: 12, padding: 6 }}>
          SAIR
        </button>
      </div>
      {!online && (
        <div className="status-off">
          SEM SINAL {pendentes > 0 ? `— ${pendentes} ITEM(S) SALVOS NO APARELHO` : ''} — NÃO FECHE O APP NEM APAGUE OS DADOS DO NAVEGADOR ANTES DE SINCRONIZAR
        </div>
      )}
      {online && pendentes > 0 && <div className="status-sync">SINCRONIZANDO {pendentes} ITEM(S) PENDENTE(S)...</div>}
    </>
  )
}
