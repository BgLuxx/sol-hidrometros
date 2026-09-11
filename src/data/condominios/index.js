import figueiraGardenUnidades from './figueira-garden.json'

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
}
