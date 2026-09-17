-- ============================================================
-- SOL SOLUÇÕES - Hidrômetros
-- Migração: suporte a "+ QUADRA/LOTE" e "+ LEITURA AVULSA" pelo app
-- Rodar UMA VEZ no SQL Editor do Supabase (projeto já existente).
-- Seguro rodar mais de uma vez (não duplica nada).
-- ============================================================

alter table unidades add column if not exists avulsa boolean not null default false;

drop policy if exists "autenticados inserem unidades" on unidades;
create policy "autenticados inserem unidades" on unidades
  for insert with check (auth.role() = 'authenticated');
