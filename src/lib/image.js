// Comprime a foto tirada no celular antes de guardar/enviar.
// Isso é importante porque o app guarda fotos no IndexedDB enquanto está
// offline (para depois sincronizar), e sinal fraco no campo é justamente
// o cenário que estamos resolvendo — fotos menores sobem mais rápido.
export async function comprimirImagem(fileOrBlob, { maxDimensao = 1600, qualidade = 0.75 } = {}) {
  const bitmap = await criarBitmap(fileOrBlob)
  const escala = Math.min(1, maxDimensao / Math.max(bitmap.width, bitmap.height))
  const largura = Math.round(bitmap.width * escala)
  const altura = Math.round(bitmap.height * escala)

  const canvas = document.createElement('canvas')
  canvas.width = largura
  canvas.height = altura
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, 0, 0, largura, altura)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', qualidade))
  return blob || fileOrBlob
}

async function criarBitmap(fileOrBlob) {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(fileOrBlob)
    } catch {
      // alguns formatos (heic em navegadores antigos) podem falhar; cai no fallback abaixo
    }
  }
  const url = URL.createObjectURL(fileOrBlob)
  try {
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = url
    })
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}
