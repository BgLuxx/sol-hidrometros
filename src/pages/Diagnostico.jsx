import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDB } from '../lib/localdb'
import { pedirArmazenamentoPersistente, statusArmazenamento } from '../lib/armazenamento'

// Tela para conferir o aparelho sem cabo USB: basta tirar um print e enviar.
async function coletar() {
  const r = { online: navigator.onLine, versao: __APP_VERSAO__ }
  r.instalado = window.matchMedia('(display-mode: standalone)').matches
  r.aparelho = navigator.userAgent
  const reg = await navigator.serviceWorker?.getRegistration?.()
  r.sw = reg?.active?.state || 'nenhum'
  r.swNoControle = Boolean(navigator.serviceWorker?.controller)
  try {
    const caches_ = await caches.keys()
    let arquivos = 0
    for (const nome of caches_.filter((n) => n.includes('precache'))) arquivos += (await (await caches.open(nome)).keys()).length
    r.arquivosOffline = arquivos
  } catch { r.arquivosOffline = 0 }
  await pedirArmazenamentoPersistente()
  Object.assign(r, await statusArmazenamento())
  try {
    const db = await getDB()
    const cadastros = await db.getAll('unidades_cache')
    const pendentes = await db.getAll('pendentes')
    r.condominiosProntos = cadastros.length
    r.pendentes = pendentes.length + await db.count('unidades_pendentes')
    r.erros = pendentes.filter((p) => p.ultimoErro).map((p) => `${p.etiqueta}: ${p.ultimoErro}`)
  } catch (e) { r.erroBanco = e.message }
  return r
}

const LINHAS = [
  ['versao', 'Versão do app'], ['instalado', 'Instalado como app'], ['online', 'Com rede'],
  ['sw', 'Service Worker'], ['swNoControle', 'Service Worker no controle'], ['arquivosOffline', 'Arquivos offline'],
  ['condominiosProntos', 'Condomínios prontos offline'], ['pendentes', 'Itens na fila'], ['persistente', 'Armazenamento protegido'],
  ['usadoMB', 'Usado (MB)'], ['disponivelMB', 'Disponível para o app (MB)'], ['aparelho', 'Aparelho'], ['erroBanco', 'Erro no banco local'],
]
const texto = (v) => (v === true ? 'SIM' : v === false ? 'NÃO' : String(v ?? '—'))

export default function Diagnostico() {
  const [d, setD] = useState(null)
  useEffect(() => { coletar().then(setD) }, [])
  return (
    <div className="container" style={{ textTransform: 'none' }}>
      <h2 style={{ margin: '16px 0' }}>Diagnóstico</h2>
      {!d && <p>Verificando...</p>}
      {d && LINHAS.filter(([k]) => d[k] !== undefined).map(([k, nome]) => (
        <p key={k} style={{ marginBottom: 8, fontSize: 14, overflowWrap: 'anywhere' }}><strong>{nome}:</strong> {texto(d[k])}</p>
      ))}
      {d?.erros?.map((e) => <p key={e} style={{ color: 'var(--vermelho)', fontSize: 13 }}>{e}</p>)}
      <p style={{ marginTop: 16 }}><Link to="/">Voltar</Link></p>
    </div>
  )
}
