import figueiraGardenUnidades from './figueira-garden.json'
import terras1Unidades from './terras-1.json'
import terras2Unidades from './terras-2.json'

// Cadastro estático dos condomínios: usado para popular o Supabase (seed)
// e como referência offline (nomes, slugs) mesmo sem sinal.
// A lista de condomínios "ativos" no app vem do banco (tabela `condominios`),
// isso aqui é só metadado de apoio.
export const CONDOMINIOS_SEED = {
  'figueira-garden': {
    slug: 'figueira-garden',
    nome: 'Figueira Garden',
    unidades: figueiraGardenUnidades,
  },
  'terras-1': {
    slug: 'terras-1',
    nome: 'Residencial Terras 1',
    unidades: terras1Unidades,
  },
  'terras-2': {
    slug: 'terras-2',
    nome: 'Terras de Atibaia II',
    unidades: terras2Unidades,
  },
}
