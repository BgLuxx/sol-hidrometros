-- ============================================================
-- Seed: Recanto dos Palmares (slug palmares)
-- 46 unidades. Sem grade de quadra/lote (planilha nao tem essa estrutura) - cadastrado literalmente como veio na planilha, tudo avulso, a pedido do Andre.
-- Rodar depois do schema.sql (e da migration_leitura_avulsa.sql), uma única vez.
-- ============================================================

insert into condominios (slug, nome)
values ('palmares', 'Recanto dos Palmares')
on conflict (slug) do nothing;

insert into unidades (condominio_id, etiqueta, quadra, lote, fase, ano_fabricacao, status_hidrometro, ano_substituicao, leitura_hidrometro_antigo, observacao, ordem, avulsa)
select c.id, v.etiqueta, v.quadra, v.lote, v.fase, v.ano_fabricacao, v.status_hidrometro, v.ano_substituicao, v.leitura_hidrometro_antigo, v.observacao, v.ordem, v.avulsa
from condominios c
cross join (values
  ('Sede', 'AVULSO', 'Sede', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 1, true),
  ('2', 'AVULSO', '2', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 2, true),
  ('3', 'AVULSO', '3', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 3, true),
  ('12', 'AVULSO', '12', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 4, true),
  ('15 A', 'AVULSO', '15 A', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 5, true),
  ('17', 'AVULSO', '17', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 6, true),
  ('20A', 'AVULSO', '20A', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 7, true),
  ('20B', 'AVULSO', '20B', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 8, true),
  ('23', 'AVULSO', '23', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 9, true),
  ('28', 'AVULSO', '28', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 10, true),
  ('29', 'AVULSO', '29', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 11, true),
  ('30', 'AVULSO', '30', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 12, true),
  ('31', 'AVULSO', '31', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 13, true),
  ('32', 'AVULSO', '32', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 14, true),
  ('33', 'AVULSO', '33', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 15, true),
  ('35', 'AVULSO', '35', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 16, true),
  ('40', 'AVULSO', '40', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 17, true),
  ('42 (540)', 'AVULSO', '42 (540)', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 18, true),
  ('43', 'AVULSO', '43', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 19, true),
  ('46', 'AVULSO', '46', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 20, true),
  ('47', 'AVULSO', '47', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 21, true),
  ('49', 'AVULSO', '49', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 22, true),
  ('51', 'AVULSO', '51', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 23, true),
  ('52', 'AVULSO', '52', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 24, true),
  ('53', 'AVULSO', '53', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 25, true),
  ('55', 'AVULSO', '55', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 26, true),
  ('60', 'AVULSO', '60', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 27, true),
  ('61', 'AVULSO', '61', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 28, true),
  ('62A', 'AVULSO', '62A', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 29, true),
  ('62B', 'AVULSO', '62B', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 30, true),
  ('63', 'AVULSO', '63', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 31, true),
  ('66', 'AVULSO', '66', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 32, true),
  ('68', 'AVULSO', '68', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 33, true),
  ('69', 'AVULSO', '69', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 34, true),
  ('70', 'AVULSO', '70', 'CASA', null::int, null::text, null::int, null::numeric, null::text, 35, true),
  ('Rotatória Ariano S 01', 'AVULSO', 'Rotatória Ariano S 01', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 36, true),
  ('Rotatória Ariano S 02', 'AVULSO', 'Rotatória Ariano S 02', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 37, true),
  ('rotatória S 03', 'AVULSO', 'rotatória S 03', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 38, true),
  ('Rotatória Pablo S 04', 'AVULSO', 'Rotatória Pablo S 04', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 39, true),
  ('Poço 01', 'AVULSO', 'Poço 01', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 40, true),
  ('Poço 02', 'AVULSO', 'Poço 02', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 41, true),
  ('ENTRADA CAIXA RECALQUE', 'AVULSO', 'ENTRADA CAIXA RECALQUE', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 42, true),
  ('SAIDA CX RECALQUE', 'AVULSO', 'SAIDA CX RECALQUE', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 43, true),
  ('ENTRADA CAIXA DE DISTRIBUIÇÃO', 'AVULSO', 'ENTRADA CAIXA DE DISTRIBUIÇÃO', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 44, true),
  ('SAIDA CX DISTRIBUIÇÃO', 'AVULSO', 'SAIDA CX DISTRIBUIÇÃO', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 45, true),
  ('SAIDA CX REDE ZONA ALTA', 'AVULSO', 'SAIDA CX REDE ZONA ALTA', 'OUTRO', null::int, null::text, null::int, null::numeric, null::text, 46, true)
) as v(etiqueta, quadra, lote, fase, ano_fabricacao, status_hidrometro, ano_substituicao, leitura_hidrometro_antigo, observacao, ordem, avulsa)
where c.slug = 'palmares'
on conflict (condominio_id, etiqueta) do nothing;
