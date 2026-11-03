// Pede ao navegador para não apagar sozinho os dados do app (fila de leituras,
// fotos e cadastro) quando o celular estiver com pouco espaço.
export async function pedirArmazenamentoPersistente() {
  try {
    if (!navigator.storage?.persist) return false
    if (await navigator.storage.persisted()) return true
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

export async function statusArmazenamento() {
  const status = { persistente: false, usadoMB: null, disponivelMB: null }
  try {
    if (navigator.storage?.persisted) status.persistente = await navigator.storage.persisted()
    if (navigator.storage?.estimate) {
      const { usage = 0, quota = 0 } = await navigator.storage.estimate()
      status.usadoMB = Math.round(usage / 1048576)
      status.disponivelMB = Math.round((quota - usage) / 1048576)
    }
  } catch { /* navegador sem suporte */ }
  return status
}
