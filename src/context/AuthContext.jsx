import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured, LOGIN_EMAIL } from '../lib/supabaseClient'

const AuthContext = createContext(null)

// Depois do primeiro login, o aparelho fica liberado até alguém tocar em SAIR.
// A entrada no app NÃO depende da rede nem da validade do token: o token vence
// em 1 hora e, sem sinal, não dá para renová-lo. Sem esta marca, quem abria o
// app sem sinal depois disso caía numa tela de login impossível de usar.
const CHAVE_ACESSO = 'sol_acesso_local'

function lerAcessoLocal() {
  try {
    if (localStorage.getItem(CHAVE_ACESSO) === '1') return true
    // Aparelho que já estava logado antes desta versão: não pede login de novo.
    const jaLogado = Object.keys(localStorage).some((k) => k.startsWith('sb-') && k.endsWith('-auth-token'))
    if (jaLogado) localStorage.setItem(CHAVE_ACESSO, '1')
    return jaLogado
  } catch {
    return false
  }
}

function gravarAcessoLocal(ativo) {
  try {
    if (ativo) localStorage.setItem(CHAVE_ACESSO, '1')
    else localStorage.removeItem(CHAVE_ACESSO)
  } catch { /* sem armazenamento: o login online continua funcionando */ }
}

export function AuthProvider({ children }) {
  const [acessoLocal, setAcessoLocal] = useState(lerAcessoLocal)
  const [sessao, setSessao] = useState(undefined) // undefined = verificando, null = sem sessão válida
  const [erroConfig, setErroConfig] = useState(!supabaseConfigured)

  useEffect(() => {
    if (!supabaseConfigured) { setSessao(null); return }
    supabase.auth.getSession()
      .then(({ data }) => setSessao(data.session))
      .catch(() => setSessao(null))
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSessao(novaSessao)
      if (novaSessao) { gravarAcessoLocal(true); setAcessoLocal(true) }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function entrar(senha) {
    if (!supabaseConfigured) {
      setErroConfig(true)
      return { erro: 'O app ainda não foi conectado ao Supabase (veja supabase/SETUP.md).' }
    }
    if (!navigator.onLine) return { erro: 'Sem internet. O primeiro acesso neste aparelho precisa de sinal.' }
    const { data, error } = await supabase.auth.signInWithPassword({ email: LOGIN_EMAIL, password: senha })
    if (error) {
      if (error.status === 400 || error.status === 401) return { erro: 'Senha incorreta.' }
      return { erro: 'Não foi possível conectar. Verifique o sinal e tente de novo.' }
    }
    gravarAcessoLocal(true)
    setAcessoLocal(true)
    setSessao(data.session)
    return { erro: null }
  }

  async function sair() {
    // scope 'local': a equipe usa um login só. O padrão ('global') encerraria
    // a sessão de TODOS os celulares quando um funcionário tocasse em SAIR.
    if (supabaseConfigured) {
      try { await supabase.auth.signOut({ scope: 'local' }) } catch { /* sai localmente mesmo assim */ }
    }
    gravarAcessoLocal(false)
    setAcessoLocal(false)
    setSessao(null)
  }

  return (
    <AuthContext.Provider value={{
      sessao,
      // Nunca espera a rede para decidir: quem tem acesso local entra na hora.
      carregando: !acessoLocal && sessao === undefined,
      logado: acessoLocal || Boolean(sessao),
      // Logado no aparelho, mas com a sessão rejeitada pelo servidor: os dados
      // seguem salvos e só o envio precisa de um novo login, feito com sinal.
      precisaEntrarDeNovo: acessoLocal && sessao === null,
      entrar,
      sair,
      erroConfig,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
