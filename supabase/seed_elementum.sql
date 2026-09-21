-- ============================================================
-- Seed: Elementum (slug elementum)
-- 75 unidades. Quadra+lote separados (formato "Q##-L##", igual Figueira Garden); avulso: areas comuns/clube/administracao/lixeira/portaria/pocos.
-- Rodar depois do schema.sql (e da migration_leitura_avulsa.sql), uma única vez.
-- ============================================================

insert into condominios (slug, nome)
values ('elementum', 'Elementum')
on conflict (slug) do nothing;

insert into unidades (condominio_id, etiqueta, quadra, lote, fase, ano_fabricacao, status_hidrometro, ano_substituicao, leitura_hidrometro_antigo, observacao, ordem, avulsa)
select c.id, v.etiqueta, v.quadra, v.lote, v.fase, v.ano_fabricacao, v.status_hidrometro, v.ano_substituicao, v.leitura_hidrometro_antigo, v.observacao, v.ordem, v.avulsa
from condominios c
cross join (values
  ('AREA DE LAZER 01', 'AVULSO', 'AREA DE LAZER 01', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 1, true),
  ('ADMINISTRAÇÃO', 'AVULSO', 'ADMINISTRAÇÃO', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 2, true),
  ('CLUBE', 'AVULSO', 'CLUBE', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 3, true),
  ('LIXEIRA', 'AVULSO', 'LIXEIRA', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 4, true),
  ('PORTARIA', 'AVULSO', 'PORTARIA', 'PORTARIA', null::int, null::text, null::int, null::numeric, null::text, 5, true),
  ('AREA COMUM 02', 'AVULSO', 'AREA COMUM 02', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 6, true),
  ('AREA COMUM 03', 'AVULSO', 'AREA COMUM 03', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 7, true),
  ('AREA COMUM 04', 'AVULSO', 'AREA COMUM 04', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 8, true),
  ('AREA COMUM 05', 'AVULSO', 'AREA COMUM 05', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 9, true),
  ('AREA COMUM 06', 'AVULSO', 'AREA COMUM 06', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 10, true),
  ('AREA COMUM 07', 'AVULSO', 'AREA COMUM 07', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 11, true),
  ('AREA COMUM 08', 'AVULSO', 'AREA COMUM 08', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 12, true),
  ('AREA COMUM 09', 'AVULSO', 'AREA COMUM 09', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 13, true),
  ('AREA COMUM 10', 'AVULSO', 'AREA COMUM 10', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 14, true),
  ('AREA COMUM 11', 'AVULSO', 'AREA COMUM 11', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 15, true),
  ('Q02-L03', 'Q02', 'L03', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 16, false),
  ('Q04-L09', 'Q04', 'L09', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 17, false),
  ('Q06-L01', 'Q06', 'L01', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 18, false),
  ('Q06-L02', 'Q06', 'L02', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 19, false),
  ('Q06-L03', 'Q06', 'L03', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 20, false),
  ('Q10-L03', 'Q10', 'L03', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 21, false),
  ('Q10-L04', 'Q10', 'L04', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 22, false),
  ('Q10-L08', 'Q10', 'L08', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 23, false),
  ('Q10-L09', 'Q10', 'L09', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 24, false),
  ('Q10-L12', 'Q10', 'L12', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 25, false),
  ('Q10-L17', 'Q10', 'L17', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 26, false),
  ('Q10-L19', 'Q10', 'L19', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 27, false),
  ('Q10-L21', 'Q10', 'L21', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 28, false),
  ('Q11-L07', 'Q11', 'L07', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 29, false),
  ('Q12-L01', 'Q12', 'L01', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 30, false),
  ('Q12-L02', 'Q12', 'L02', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 31, false),
  ('Q14-L01', 'Q14', 'L01', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 32, false),
  ('Q14-L11', 'Q14', 'L11', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 33, false),
  ('Q16-L01', 'Q16', 'L01', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 34, false),
  ('Q16-L04', 'Q16', 'L04', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 35, false),
  ('Q16-L05', 'Q16', 'L05', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 36, false),
  ('Q16-L08', 'Q16', 'L08', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 37, false),
  ('Q17-L04', 'Q17', 'L04', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 38, false),
  ('Q18-L05', 'Q18', 'L05', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 39, false),
  ('Q19-L07', 'Q19', 'L07', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 40, false),
  ('Q19-L12', 'Q19', 'L12', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 41, false),
  ('Q20-L11', 'Q20', 'L11', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 42, false),
  ('Q21-L01', 'Q21', 'L01', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 43, false),
  ('Q21-L03', 'Q21', 'L03', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 44, false),
  ('Q21-L05', 'Q21', 'L05', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 45, false),
  ('Q22-L11', 'Q22', 'L11', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 46, false),
  ('Q22-L13', 'Q22', 'L13', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 47, false),
  ('Q22-L24', 'Q22', 'L24', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 48, false),
  ('Q23-L02', 'Q23', 'L02', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 49, false),
  ('Q23-L15', 'Q23', 'L15', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 50, false),
  ('Q23-L20', 'Q23', 'L20', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 51, false),
  ('Q24-L01', 'Q24', 'L01', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 52, false),
  ('Q24-L04', 'Q24', 'L04', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 53, false),
  ('Q24-L22', 'Q24', 'L22', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 54, false),
  ('Q24-L25', 'Q24', 'L25', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 55, false),
  ('Q24-L40', 'Q24', 'L40', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 56, false),
  ('Q25-L07', 'Q25', 'L07', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 57, false),
  ('Q25-L11', 'Q25', 'L11', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 58, false),
  ('Q25-L14', 'Q25', 'L14', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 59, false),
  ('Q25-L19', 'Q25', 'L19', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 60, false),
  ('Q25-L22', 'Q25', 'L22', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 61, false),
  ('Q25-L33', 'Q25', 'L33', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 62, false),
  ('Q26-L01', 'Q26', 'L01', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 63, false),
  ('Q26-L02', 'Q26', 'L02', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 64, false),
  ('Q27-L06', 'Q27', 'L06', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 65, false),
  ('Q28-L02', 'Q28', 'L02', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 66, false),
  ('Q28-L10', 'Q28', 'L10', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 67, false),
  ('Q28-L12', 'Q28', 'L12', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 68, false),
  ('Q28-L21', 'Q28', 'L21', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 69, false),
  ('Q28-L29', 'Q28', 'L29', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 70, false),
  ('Q31-L04', 'Q31', 'L04', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 71, false),
  ('POÇO 01', 'AVULSO', 'POÇO 01', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 72, true),
  ('POÇO 02', 'AVULSO', 'POÇO 02', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 73, true),
  ('POÇO 03', 'AVULSO', 'POÇO 03', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 74, true),
  ('POÇO 04', 'AVULSO', 'POÇO 04', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 75, true)
) as v(etiqueta, quadra, lote, fase, ano_fabricacao, status_hidrometro, ano_substituicao, leitura_hidrometro_antigo, observacao, ordem, avulsa)
where c.slug = 'elementum'
on conflict (condominio_id, etiqueta) do nothing;
