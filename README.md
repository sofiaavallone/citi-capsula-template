# Cápsula do tempo

Um site para escrever cartas para o seu eu do futuro. Cada cápsula fica trancada até a data escolhida e chega por e-mail no dia.

Projeto do minicurso do CITi.

## Tecnologias

| Parte                     | Tecnologia                           | Porta |
| ------------------------- | ------------------------------------ | ----- |
| Front-end (`apps/client`) | Next.js 15, React 19, Tailwind CSS   | 3000  |
| Back-end (`apps/server`)  | Express 4, Prisma 7, zod, nodemailer | 3002  |
| Banco                     | PostgreSQL 16 (Docker)               | 5433  |
| Visualizar o banco        | Adminer (Docker)                     | 8080  |
| E-mails de teste          | Mailpit (Docker)                     | 8025  |

## Como rodar

Pré-requisitos: Node 20.19+, pnpm 9+, Docker Desktop aberto.

```bash
# 1. variáveis de ambiente
cp .env.example apps/server/.env
echo "NEXT_PUBLIC_API_URL=http://localhost:3002" > apps/client/.env.local

# 2. dependências
pnpm install

# 3. banco, server, Adminer e Mailpit
pnpm docker:up
pnpm docker:logs        # espere "Server ready" e saia com Ctrl+C

# 4. front-end
pnpm dev                # http://localhost:3000
```

Se a página mostrar "Tudo certo", está funcionando. Se mostrar "Modo offline", o server não está respondendo: confira `pnpm docker:logs`.

## Comandos

| Comando                               | O que faz                                                 |
| ------------------------------------- | --------------------------------------------------------- |
| `pnpm dev`                            | sobe o front em http://localhost:3000                     |
| `pnpm docker:up` / `pnpm docker:down` | liga / desliga os containers                              |
| `pnpm docker:logs`                    | mostra os logs do server                                  |
| `pnpm docker:restart`                 | reinicia o server (use depois de mudar o `schema.prisma`) |
| `pnpm docker:rebuild`                 | reconstrói a imagem do server                             |
| `pnpm db:studio`                      | abre uma tela para ver e editar os dados                  |
| `pnpm lint` / `pnpm format`           | confere e formata o código                                |

## Acessar o banco pelo Adminer

Abra http://localhost:8080 e use: sistema **PostgreSQL**, servidor `postgres`, usuário `postgres`, senha `postgres`, banco `capsula`.

## Estrutura

```
apps/
  client/          Next.js (src/app, src/components, src/lib)
  server/          Express (routes -> controllers -> services) + Prisma
packages/
  types/           tipos compartilhados (@repo/types)
  utils/           funções compartilhadas (@repo/utils)
  config/          tsconfig e eslint base
AGENTS.md          contexto do projeto para o Codex
```

## Deploy no Railway

O monorepo vira três serviços no Railway: Postgres, `server` e `client`.

- **server**: start `pnpm --filter server start` (cria as tabelas e sobe a API). Variáveis: `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `WEB_URL=https://${{client.RAILWAY_PUBLIC_DOMAIN}}`, `APP_TIMEZONE`, `RESEND_API_KEY`, `MAIL_FROM`.
- **client**: start `pnpm --filter client start`. Variável: `NEXT_PUBLIC_API_URL=https://${{server.RAILWAY_PUBLIC_DOMAIN}}` (lida no build, então faça redeploy se mudar).
- O Railway bloqueia SMTP nos planos gratuitos; em produção use o Resend.

## Problemas comuns

- **Porta ocupada no `docker:up`**: outro projeto está usando 5433, 3002, 8080 ou 8025. Pare o outro container (`docker ps`, `docker stop <id>`) e rode `docker compose up -d --force-recreate`.
- **`Can't reach database server at postgres:5432`**: o banco foi criado pela metade. Rode `docker compose up -d --force-recreate postgres server`.
- **Mudei o server e nada mudou** (comum no Windows): `pnpm docker:restart`.
