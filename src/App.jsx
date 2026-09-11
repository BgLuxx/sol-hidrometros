import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Condominios from './pages/Condominios'
import CondominioDetalhe from './pages/CondominioDetalhe'

function Protegida({ children }) {
  const { logado, carregando } = useAuth()
  if (carregando) return <TelaCarregando />
  if (!logado) return <Navigate to="/login" replace />
  return children
}

function TelaCarregando() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src="/logo.png" alt="SOL Soluções" style={{ width: 120, opacity: 0.7 }} />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protegida><Condominios /></Protegida>} />
      <Route path="/condominio/:slug" element={<Protegida><CondominioDetalhe /></Protegida>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
