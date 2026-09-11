import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const { entrar, erroConfig } = useAuth()
  const navigate = useNavigate()

  async function aoEnviar(e) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    const { erro } = await entrar(senha)
    setEnviando(false)
    if (erro) setErro(erro)
    else navigate('/')
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, var(--azul), var(--azul-escuro))', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 380, padding: '32px 28px', textAlign: 'center' }}>
        <img src="/logo.png" alt="SOL Soluções" style={{ width: 140, marginBottom: 18 }} />
        <h2 style={{ fontSize: 18, color: 'var(--texto)', marginBottom: 4 }}>Controle de Hidrômetros</h2>
        <p style={{ color: 'var(--texto-suave)', fontSize: 13, marginBottom: 24, textTransform: 'none' }}>
          Digite a senha da equipe para entrar
        </p>
        <form onSubmit={aoEnviar}>
          <input
            type="password"
            placeholder="SENHA"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoFocus
            style={{ textAlign: 'center', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 14 }}
          />
          {erro && <p style={{ color: 'var(--vermelho)', fontSize: 13, marginBottom: 14, textTransform: 'none' }}>{erro}</p>}
          {erroConfig && (
            <p style={{ color: 'var(--vermelho)', fontSize: 12, marginBottom: 14, textTransform: 'none' }}>
              O app ainda não foi conectado ao Supabase. Veja <code>supabase/SETUP.md</code> e configure o arquivo <code>.env</code>.
            </p>
          )}
          <button type="submit" className="btn btn-azul btn-bloco" disabled={enviando || !senha}>
            {enviando ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  )
}
