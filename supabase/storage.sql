-- ============================================================
-- Storage: bucket para as fotos dos hidrômetros
-- Rodar depois de criar o bucket "hidrometros" pelo painel
-- (Storage > New bucket > nome: hidrometros > Public bucket: SIM)
-- ============================================================

-- Qualquer pessoa autenticada (a equipe, com o login único) pode enviar/atualizar/apagar fotos.
drop policy if exists "autenticados enviam fotos" on storage.objects;
create policy "autenticados enviam fotos" on storage.objects
  for insert with check (bucket_id = 'hidrometros' and auth.role() = 'authenticated');

drop policy if exists "autenticados atualizam fotos" on storage.objects;
create policy "autenticados atualizam fotos" on storage.objects
  for update using (bucket_id = 'hidrometros' and auth.role() = 'authenticated');

drop policy if exists "autenticados apagam fotos" on storage.objects;
create policy "autenticados apagam fotos" on storage.objects
  for delete using (bucket_id = 'hidrometros' and auth.role() = 'authenticated');

-- Leitura pública das fotos (bucket já é público, mas garante a policy de select também)
drop policy if exists "leitura publica fotos" on storage.objects;
create policy "leitura publica fotos" on storage.objects
  for select using (bucket_id = 'hidrometros');
