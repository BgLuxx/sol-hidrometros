# SOL Soluções — Controle de Hidrômetros

App para a equipe lançar as leituras mensais dos hidrômetros dos condomínios (com foto), direto do celular — **funciona sem internet** — e gerar o relatório em Excel no mesmo formato que você já usa.

- Protegido por senha única da equipe (SolSolucoes)
- Funciona no celular (câmera + "adicionar à tela de início") e no computador
- **Offline first**: quem estiver sem sinal consegue tirar a foto e lançar a leitura normalmente — fica guardado no aparelho e sobe sozinho quando o sinal voltar
- Filtro por dia ou por quadra
- Botão de relatório: mês atual ou comparação entre dois meses, baixando um `.xlsx` igual ao seu modelo (com os totais, situação dos hidrômetros e tabela de vencimento)
- Já vem com o Figueira Garden cadastrado (367 unidades / 42 quadras, extraído da sua planilha)

## Como está organizado

- `src/` — o app (React)
- `supabase/` — banco de dados, fotos e login (**leia `supabase/SETUP.md` primeiro**, é o único passo manual)
- Hospedagem: GitHub + Vercel (gratuito)

## 1. Configurar o banco (Supabase)

Siga **`supabase/SETUP.md`** — leva uns 10 minutos, só precisa fazer uma vez. No final você vai ter:
- A URL e a chave do projeto Supabase
- O login único da equipe já criado com a senha que você escolher

## 2. Rodar no seu computador (para testar)

```bash
npm install
cp .env.example .env
# edite o .env e cole a URL/chave do Supabase (passo 1)
npm run dev
```

Abra o link que aparecer no terminal (geralmente `http://localhost:5173`).

## 3. Subir para o GitHub

```bash
git init
git add .
git commit -m "App de controle de hidrômetros - SOL Soluções"
```

Crie um repositório vazio em https://github.com/new (pode ser privado) e depois:

```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

## 4. Colocar no ar (Vercel — gratuito)

1. Crie uma conta em https://vercel.com (dá para entrar com o GitHub).
2. **Add New → Project** → selecione o repositório que você acabou de subir.
3. Em **Environment Variables**, adicione as 3 variáveis do seu `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_LOGIN_EMAIL`
4. **Deploy**. Em ~1 minuto você recebe o link público do site (ex: `sol-hidrometros.vercel.app`).

Esse é o link que você compartilha com as outras 4 pessoas. Todo mundo entra com a mesma senha.

### Adicionar à tela de início do celular
Abra o link no navegador do celular → menu (⋮ no Android, compartilhar no iPhone) → **"Adicionar à tela inicial"**. O app abre em tela cheia, como um aplicativo normal, e continua funcionando sem internet.

## Como funciona o modo offline

- A lista de quadras/lotes de cada condomínio fica salva no aparelho na primeira vez que abrir com sinal.
- Sem sinal: a pessoa tira a foto e lança a leitura normalmente — fica guardado no navegador do aparelho, com uma etiqueta "PENDENTE" na lista.
- Quando o sinal voltar (ou a cada 30 segundos, se já estiver com sinal), o app sobe sozinho tudo que ficou pendente — foto e leitura.
- Enquanto houver itens pendentes, aparece um aviso amarelo no topo do app.

## Próximos condomínios

Para cadastrar um novo condomínio, me envie a planta/lista de quadras e lotes (igual você fez com o Figueira Garden) que eu preparo o arquivo de seed pronto para rodar no Supabase — o app já reconhece qualquer condomínio que estiver no banco, sem precisar mexer no código.
