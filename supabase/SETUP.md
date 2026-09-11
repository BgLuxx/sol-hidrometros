# Configurar o Supabase (banco de dados + fotos + login)

Isso leva uns 10 minutos e só precisa ser feito **uma vez**.

## 1. Criar o projeto

1. Crie uma conta grátis em https://supabase.com (pode entrar com o GitHub).
2. **New project** → dê um nome (ex: `sol-solucoes`) → escolha uma senha do banco (guarde ela, mas ela **não** é a senha do app) → região `South America (São Paulo)` → **Create new project**.
3. Espere ~2 minutos o projeto ficar pronto.

## 2. Rodar o schema (criar as tabelas)

1. No menu lateral, abra **SQL Editor** → **New query**.
2. Abra o arquivo `supabase/schema.sql` deste projeto, copie tudo, cole no editor e clique **Run**.
3. Repita o mesmo processo para `supabase/seed_figueira_garden.sql` (isso já cadastra as 367 unidades do Figueira Garden — quadras e lotes).

## 3. Criar o bucket de fotos

1. No menu lateral, abra **Storage** → **New bucket**.
2. Nome exato: `hidrometros` → marque **Public bucket** → **Create bucket**.
3. Volte no **SQL Editor**, abra uma nova query, cole o conteúdo de `supabase/storage.sql` e clique **Run**.

## 4. Criar o login único da equipe

O app usa **um único login** compartilhado pelas 5 pessoas (você só digita a senha na tela, o e-mail fica escondido).

1. No menu lateral, abra **Authentication** → **Users** → **Add user** → **Create new user**.
2. E-mail: `equipe@solsolucoes.app` (o mesmo que está em `.env.example` na variável `VITE_APP_LOGIN_EMAIL` — se você mudar aqui, mude lá também).
3. Senha: escolha a senha que a equipe vai digitar no app (ex: `SolSolucoes`).
4. Marque **Auto Confirm User** → **Create user**.

## 5. Pegar as chaves do projeto

1. Vá em **Project Settings** (ícone de engrenagem) → **API**.
2. Copie:
   - **Project URL** → vai em `VITE_SUPABASE_URL`
   - **anon public key** → vai em `VITE_SUPABASE_ANON_KEY`
3. Cole essas duas no arquivo `.env` do projeto (veja o `README.md` principal).

Pronto — o banco está pronto para o app usar.

## Adicionando um novo condomínio depois

Quando quiser cadastrar outro condomínio, me mande a planta/lista de quadras e lotes dele (do jeito que fez com o Figueira Garden) que eu gero um novo arquivo de seed igual a este, prontinho para rodar no SQL Editor.
