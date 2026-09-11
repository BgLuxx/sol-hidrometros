import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured, LOGIN_EMAIL } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(undefined) // undefined = carregando, null = deslogado
  const [erroConfig, setErroConfig] = useState(!supabaseConfigured)

  useEffect(() => {
    if (!supabaseConfigured) { setSessao(null); return }
    supabase.auth.getSession().then(({ data }) => setSessao(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, novaSessao) => setSessao(novaSessao))
    return () => sub.subscription.unsubscribe()
  }, [])

  async function entrar(senha) {
    if (!supabaseConfigured) {
      setErroConfig(true)
      return { erro: 'O app ainda não foi conectado ao Supabase (veja supabase/SETUP.md).' }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: LOGIN_EMAIL, password: senha })
    if (error) return { erro: 'Senha incorreta.' }
    setSessao(data.session)
    return { erro: null }
  }

  async function sair() {
    if (supabaseConfigured) await supabase.auth.signOut()
    setSessao(null)
  }

  return (
    <AuthContext.Provider value={{ sessao, carregando: sessao === undefined, logado: Boolean(sessao), entrar, sair, erroConfig }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
