import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { OnlineProvider } from './context/OnlineContext'
import { pedirArmazenamentoPersistente } from './lib/armazenamento'
import './index.css'

pedirArmazenamentoPersistente()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OnlineProvider>
          <App />
        </OnlineProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
