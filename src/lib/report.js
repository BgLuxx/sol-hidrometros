import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { nomeMes } from './format'

const AZUL = 'FF0E6BA8'
const LARANJA = 'FFF15A24'
const CINZA_CLARO = 'FFF2F2F2'
const BRANCO = 'FFFFFFFF'

function medidorLabel(u) {
  if (u.status_hidrometro === 'SUBSTITUIDO') return `SUBSTITUÍDO ${u.ano_substituicao || ''}`.trim()
  if (u.status_hidrometro === 'SEM_ACESSO') return 'SEM ACESSO'
  if (u.ano_fabricacao) return String(u.ano_fabricacao)
  return u.observacao || ''
}

function etiquetaLabel(etiqueta) {
  return etiqueta.replace('-', ' ')
}

/**
 * Gera o relatório em .xlsx no mesmo formato da planilha manual do André:
 * ID / FASE / HIDRÔMETROS (ANO) / leitura anterior / leitura atual / CONSUMO / (vazio) / LEITURA HIDRÔMETRO ANTIGO
 * + rodapé com totais, contagem por fase, situação dos hidrômetros e tabela de vencimento por ano de fabricação.
 */
export async function gerarRelatorio({ condominio, unidades, mesAnterior, mesAtual, leiturasAnteriorPorUnidade, leiturasAtualPorUnidade }) {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'SOL Soluções em Água e Esgoto'
  wb.created = new Date()
  const ws = wb.addWorksheet(nomeMes(mesAtual).slice(0, 31), { views: [{ state: 'frozen', ySplit: 2 }] })

  ws.columns = [
    { width: 16 }, { width: 12 }, { width: 22 }, { width: 16 }, { width: 16 }, { width: 14 }, { width: 4 }, { width: 24 },
  ]

  // Título
  ws.mergeCells('A1:H1')
  const titulo = ws.getCell('A1')
  titulo.value = `PLANILHA DE LEITURA DE CONSUMO DE ÁGUA ${condominio.nome.toUpperCase()} - (HIDRÔMETROS)`
  titulo.font = { bold: true, size: 13, color: { argb: BRANCO }, name: 'Arial' }
  titulo.alignment = { horizontal: 'center', vertical: 'middle' }
  titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AZUL } }
  ws.getRow(1).height = 26

  // Cabeçalho
  const cabecalho = [
    'ID', 'FASE', 'HIDRÔMETROS (ANO)', nomeMes(mesAnterior), nomeMes(mesAtual), 'CONSUMO (M³)', '', 'LEITURA HIDRÔMETRO ANTIGO (M³)',
  ]
  const linhaCab = ws.getRow(2)
  linhaCab.values = cabecalho
  linhaCab.eachCell((cell) => {
    cell.font = { bold: true, size: 10, name: 'Arial' }
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CINZA_CLARO } }
    cell.border = borda()
  })
  linhaCab.height = 28

  let linha = 3
  let somaConsumo = 0
  const contagemFase = {}
  let faltaTrocar = 0
  let semAcesso = 0
  let substituidos = 0
  let naValidade = 0
  let totalComAno = 0
  const anoAtual = new Date().getFullYear()
  const contagemPorAnoFabricacao = {}

  const unidadesOrdenadas = [...unidades].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))

  for (const u of unidadesOrdenadas) {
    const anterior = leiturasAnteriorPorUnidade[u.id]
    const atual = leiturasAtualPorUnidade[u.id]
    const consumo = anterior != null && atual != null ? Number(atual) - Number(anterior) : null
    if (consumo != null) somaConsumo += consumo

    contagemFase[u.fase] = (contagemFase[u.fase] || 0) + 1
    if (u.status_hidrometro === 'SEM_ACESSO') semAcesso += 1
    else if (u.status_hidrometro === 'SUBSTITUIDO') substituidos += 1
    else if (u.ano_fabricacao) {
      totalComAno += 1
      const vencido = u.ano_fabricacao + 5 <= anoAtual
      if (vencido) faltaTrocar += 1
      else naValidade += 1
      contagemPorAnoFabricacao[u.ano_fabricacao] = (contagemPorAnoFabricacao[u.ano_fabricacao] || 0) + 1
    }

    const row = ws.getRow(linha)
    row.values = [
      etiquetaLabel(u.etiqueta), u.fase, medidorLabel(u),
      anterior ?? '', atual ?? '', consumo ?? '', '', u.leitura_hidrometro_antigo ?? '',
    ]
    row.eachCell({ includeEmpty: true }, (cell) => { cell.border = borda(); cell.font = { size: 10, name: 'Arial' } })
    row.getCell(1).font = { bold: true, size: 10, name: 'Arial' }
    if (u.status_hidrometro === 'SEM_ACESSO') {
      row.eachCell({ includeEmpty: true }, (c) => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE0E0' } } })
    } else if (u.status_hidrometro === 'SUBSTITUIDO') {
      row.eachCell({ includeEmpty: true }, (c) => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3CD' } } })
    }
    linha += 1
  }

  linha += 1
  linhaTotal(ws, linha, `${unidadesOrdenadas.length} UNIDADES`, somaConsumo); linha += 1
  for (const [fase, qtd] of Object.entries(contagemFase)) { linhaSimples(ws, linha, fase, qtd); linha += 1 }

  linha += 1
  linhaSimples(ws, linha, 'UND FALTA TROCAR', faltaTrocar); linha += 1
  linhaSimples(ws, linha, 'UND SEM ACESSO', semAcesso); linha += 1
  linhaSimples(ws, linha, 'UND SUBSTITUÍDOS', substituidos); linha += 1
  linhaSimples(ws, linha, 'UND NA VALIDADE', naValidade, totalComAno); linha += 1

  linha += 1
  const cabAno = ws.getRow(linha)
  cabAno.values = ['ANO DE FABRICAÇÃO', '', 'QUANT.', 'VENCE EM']
  cabAno.eachCell((c) => { c.font = { bold: true, size: 10, name: 'Arial' } })
  linha += 1
  for (const ano of Object.keys(contagemPorAnoFabricacao).sort()) {
    const row = ws.getRow(linha)
    row.values = [Number(ano), '', contagemPorAnoFabricacao[ano], Number(ano) + 5]
    row.eachCell((c) => { c.font = { size: 10, name: 'Arial' } })
    linha += 1
  }

  const buffer = await wb.xlsx.writeBuffer()
  const nomeArquivo = `${condominio.slug}-${mesAtual}.xlsx`
  const mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  saveAs(new Blob([buffer], { type: mime }), nomeArquivo)
}

function borda() {
  const fina = { style: 'thin', color: { argb: 'FFCCCCCC' } }
  return { top: fina, left: fina, bottom: fina, right: fina }
}

function linhaTotal(ws, numero, label, soma) {
  const row = ws.getRow(numero)
  row.values = [label, '', '', '', '', soma]
  row.eachCell((c) => {
    c.font = { bold: true, size: 11, color: { argb: BRANCO }, name: 'Arial' }
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LARANJA } }
  })
}

function linhaSimples(ws, numero, label, valor, valor2) {
  const row = ws.getRow(numero)
  row.values = valor2 != null ? [label, '', valor, valor2] : [label, '', valor]
  row.getCell(1).font = { bold: true, size: 10, name: 'Arial' }
}
