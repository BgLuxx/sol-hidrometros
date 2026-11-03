import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOnline } from '../context/OnlineContext'

export default function Header({ titulo, voltar }) {
  const navigate = useNavigate()
  const { sair, precisaEntrarDeNovo } = useAuth()
  const { online, pendentes } = useOnline()

  async function aoSair() {
    // Sem sinal não dá para entrar de novo, e com itens na fila o envio pararia.
    if (!online || pendentes > 0) {
      window.alert(pendentes > 0
        ? `Há ${pendentes} item(ns) para enviar. Conecte à internet e aguarde o envio antes de sair.`
        : 'Sem internet não é possível entrar de novo. Saia somente quando tiver sinal.')
      return
    }
    await sair()
    navigate('/login')
  }

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
        <button onClick={aoSair} title="Sair" style={{ background: 'transparent', color: '#fff', fontSize: 12, padding: 6 }}>
          SAIR
        </button>
      </div>
      {!online && (
        <div className="status-off">
          SEM SINAL {pendentes > 0 ? `— ${pendentes} ITEM(S) SALVOS NO APARELHO` : ''} — PODE FECHAR O APP, MAS NÃO APAGUE OS DADOS DO NAVEGADOR ANTES DE SINCRONIZAR
        </div>
      )}
      {online && precisaEntrarDeNovo && (
        <button onClick={() => navigate('/login')} className="status-off" style={{ width: '100%' }}>
          TOQUE AQUI PARA ENTRAR DE NOVO E ENVIAR OS LANÇAMENTOS — NADA FOI PERDIDO
        </button>
      )}
      {online && !precisaEntrarDeNovo && pendentes > 0 && <div className="status-sync">SINCRONIZANDO {pendentes} ITEM(S) PENDENTE(S)...</div>}
    </>
  )
}
