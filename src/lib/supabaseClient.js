import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// A biblioteca de login só preserva a sessão em alguns códigos 5xx. O 540, que o
// Supabase devolve quando o projeto está pausado, era tratado como "sessão
// inválida" e deslogava o aparelho. Qualquer falha do servidor vira 503 aqui,
// para ser tratada como falha temporária.
async function fetchResiliente(...args) {
  const resposta = await fetch(...args)
  if (resposta.status < 500 || resposta.status === 503) return resposta
  return new Response(resposta.body, { status: 503, statusText: 'Servidor indisponivel', headers: resposta.headers })
}

export const supabaseConfigured = Boolean(url && anonKey && !url.includes('SEU-PROJETO'))

export const supabase = supabaseConfigured
  ? createClient(url, anonKey, {
      global: { fetch: fetchResiliente },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null

export const LOGIN_EMAIL = import.meta.env.VITE_APP_LOGIN_EMAIL || 'equipe@solsolucoes.app'
