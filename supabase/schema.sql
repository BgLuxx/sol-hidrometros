-- ============================================================
-- SOL SOLUÇÕES - Hidrômetros
-- Schema do banco (rodar uma vez no SQL Editor do Supabase)
-- ============================================================

create table if not exists condominios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nome text not null,
  criado_em timestamptz not null default now()
);

create table if not exists unidades (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references condominios(id) on delete cascade,
  etiqueta text not null,              -- ex: "Q01-L01" ou "PORTARIA-01"
  quadra text not null,
  lote text not null,
  fase text not null,                  -- CASA | OBRA | PORTARIA
  ano_fabricacao int,                  -- ano do hidrômetro, quando conhecido
  status_hidrometro text,              -- SUBSTITUIDO | SEM_ACESSO | null
  ano_substituicao int,                -- ano em que foi substituído, se houver
  leitura_hidrometro_antigo numeric,   -- última leitura do hidrômetro antigo (quando substituído)
  observacao text,
  ordem int not null default 0,
  avulsa boolean not null default false, -- true = cadastrada pela equipe em campo (fora da planilha original), ex: portaria extra
  criado_em timestamptz not null default now(),
  unique (condominio_id, etiqueta)
);

create table if not exists leituras (
  id uuid primary key default gen_random_uuid(),
  unidade_id uuid not null references unidades(id) on delete cascade,
  mes_referencia text not null,        -- formato 'YYYY-MM', ex: '2026-08'
  leitura numeric not null,
  foto_path text,                      -- caminho no storage bucket "hidrometros"
  foto_url text,                       -- url pública da foto
  data_leitura date not null default current_date,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  criado_por text,
  unique (unidade_id, mes_referencia)
);

create index if not exists idx_unidades_condominio on unidades(condominio_id);
create index if not exists idx_leituras_unidade on leituras(unidade_id);
create index if not exists idx_leituras_mes on leituras(mes_referencia);

-- Mantém atualizado_em em dia
create or replace function set_atualizado_em()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_leituras_atualizado_em on leituras;
create trigger trg_leituras_atualizado_em
  before update on leituras
  for each row execute function set_atualizado_em();

-- ============================================================
-- Segurança (RLS)
-- A equipe inteira usa UM único login (ver supabase/SETUP.md).
-- Qualquer usuário autenticado pode ler/escrever; anônimos não veem nada.
-- ============================================================

alter table condominios enable row level security;
alter table unidades enable row level security;
alter table leituras enable row level security;

drop policy if exists "autenticados leem condominios" on condominios;
create policy "autenticados leem condominios" on condominios
  for select using (auth.role() = 'authenticated');

drop policy if exists "autenticados leem unidades" on unidades;
create policy "autenticados leem unidades" on unidades
  for select using (auth.role() = 'authenticated');

-- Permite à equipe cadastrar quadra/lote novo ou uma leitura avulsa (ex: portaria)
-- direto pelo app, sem precisar do André rodar SQL manualmente.
drop policy if exists "autenticados inserem unidades" on unidades;
create policy "autenticados inserem unidades" on unidades
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "autenticados leem leituras" on leituras;
create policy "autenticados leem leituras" on leituras
  for select using (auth.role() = 'authenticated');

drop policy if exists "autenticados inserem leituras" on leituras;
create policy "autenticados inserem leituras" on leituras
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "autenticados atualizam leituras" on leituras;
create policy "autenticados atualizam leituras" on leituras
  for update using (auth.role() = 'authenticated');

drop policy if exists "autenticados apagam leituras" on leituras;
create policy "autenticados apagam leituras" on leituras
  for delete using (auth.role() = 'authenticated');
