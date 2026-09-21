-- ============================================================
-- Seed: Associação Alto do Sion (slug sion)
-- 38 unidades. Letra+numero (quadra+lote); avulso: GUARITA/AREA LAZER/PONTO 01-04/POCO.
-- Rodar depois do schema.sql (e da migration_leitura_avulsa.sql), uma única vez.
-- ============================================================

insert into condominios (slug, nome)
values ('sion', 'Associação Alto do Sion')
on conflict (slug) do nothing;

insert into unidades (condominio_id, etiqueta, quadra, lote, fase, ano_fabricacao, status_hidrometro, ano_substituicao, leitura_hidrometro_antigo, observacao, ordem, avulsa)
select c.id, v.etiqueta, v.quadra, v.lote, v.fase, v.ano_fabricacao, v.status_hidrometro, v.ano_substituicao, v.leitura_hidrometro_antigo, v.observacao, v.ordem, v.avulsa
from condominios c
cross join (values
  ('GUARITA', 'AVULSO', 'GUARITA', 'PORTARIA', null::int, null::text, null::int, null::numeric, null::text, 1, true),
  ('AREA LAZER', 'AVULSO', 'AREA LAZER', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 2, true),
  ('PONTO 01', 'AVULSO', 'PONTO 01', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 3, true),
  ('PONTO 02', 'AVULSO', 'PONTO 02', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 4, true),
  ('PONTO 03', 'AVULSO', 'PONTO 03', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 5, true),
  ('PONTO 04', 'AVULSO', 'PONTO 04', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 6, true),
  ('D03', 'D', '03', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 7, false),
  ('D04', 'D', '04', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 8, false),
  ('D05', 'D', '05', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 9, false),
  ('E01', 'E', '01', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 10, false),
  ('E02', 'E', '02', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 11, false),
  ('E03', 'E', '03', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 12, false),
  ('E04', 'E', '04', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 13, false),
  ('E05', 'E', '05', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 14, false),
  ('F03', 'F', '03', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 15, false),
  ('G04', 'G', '04', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 16, false),
  ('G06', 'G', '06', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 17, false),
  ('H03', 'H', '03', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 18, false),
  ('H06', 'H', '06', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 19, false),
  ('H07', 'H', '07', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 20, false),
  ('H10', 'H', '10', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 21, false),
  ('H11', 'H', '11', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 22, false),
  ('I02', 'I', '02', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 23, false),
  ('I03', 'I', '03', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 24, false),
  ('I04', 'I', '04', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 25, false),
  ('I05', 'I', '05', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 26, false),
  ('I08', 'I', '08', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 27, false),
  ('I09', 'I', '09', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 28, false),
  ('J05', 'J', '05', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 29, false),
  ('J06', 'J', '06', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 30, false),
  ('J07', 'J', '07', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 31, false),
  ('J10', 'J', '10', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 32, false),
  ('K10', 'K', '10', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 33, false),
  ('K11', 'K', '11', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 34, false),
  ('K12', 'K', '12', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 35, false),
  ('L01', 'L', '01', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 36, false),
  ('L05', 'L', '05', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 37, false),
  ('POÇO', 'AVULSO', 'POÇO', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 38, true)
) as v(etiqueta, quadra, lote, fase, ano_fabricacao, status_hidrometro, ano_substituicao, leitura_hidrometro_antigo, observacao, ordem, avulsa)
where c.slug = 'sion'
on conflict (condominio_id, etiqueta) do nothing;
