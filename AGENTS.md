# AGENTS.md

Projeto: **Cápsula do tempo**, um site para escrever cartas ("cápsulas") para o seu eu do futuro,
que só podem ser abertas numa data escolhida. Monorepo pnpm + Turborepo, tudo em TypeScript.

## Estrutura

- `apps/client`: Next.js 15 (App Router), React 19, Tailwind v3. Roda local na porta 3000. Nome do pacote: `client`.
- `apps/server`: Express 4 + Prisma 7. Roda no Docker na porta 3002.
  - Camadas: `routes/` -> `controllers/` -> `services/`. Só os services usam o Prisma.
  - Arquivos no formato `<entidade>.<camada>.ts`. Use `users.*` como modelo para novos recursos.
  - Handlers async ficam dentro de `asyncHandler` (de `middlewares/errorHandler.ts`), porque o Express 4 não captura erros async.
  - `notFoundHandler` e `errorHandler` são sempre os últimos `app.use` do `index.ts`.
- `packages/types` (`@repo/types`): tipos compartilhados entre client e server, espelhando os models do Prisma,
  com datas como string ISO. Toda resposta da API usa `ApiResponse<T>` = `{ data, message?, error? }`.
- `packages/utils` (`@repo/utils`): funções utilitárias compartilhadas.

## Docker e banco

- `pnpm docker:up` sobe Postgres (porta 5433), server (3002), Adminer (8080) e Mailpit (SMTP 1025, caixa de entrada em http://localhost:8025).
- O server é pronto quando `pnpm docker:logs` mostra "Server ready".
- O server roda `prisma db push` toda vez que inicia. Depois de mudar o `schema.prisma`, rode `pnpm docker:restart`.
- Prisma 7: a URL do banco NÃO fica no `schema.prisma`. Ela vem de `apps/server/prisma.config.ts` (`DATABASE_URL`).
  O `PrismaClient` usa o adapter `@prisma/adapter-pg` e existe uma instância única em `apps/server/src/lib/prisma.ts`.
- E-mails em desenvolvimento vão para o Mailpit (variáveis `SMTP_*` já configuradas no `docker-compose.yml`).

## Produção (Railway)

- O server sobe com `pnpm --filter server start` (`prisma db push` + `tsx src/index.ts`); o client com `pnpm --filter client start`.
- O Railway bloqueia SMTP nos planos gratuitos: em produção o e-mail sai pela API do Resend (pacote `resend`, variável `RESEND_API_KEY`).
  Sem `RESEND_API_KEY`, o envio usa SMTP (Mailpit em desenvolvimento).

## Front-end

- Use só a instância `api` de `apps/client/src/lib/api.ts` (não importe `axios` em outro lugar).
- `apiGet<T>(path, fallback)` devolve `{ data, isMocked }`. Se o server falhar, devolve o fallback de `lib/mocks.ts`
  e a interface mostra uma faixa amarela "Modo offline".
- Componentes em `src/components`, funções auxiliares em `src/lib`, estilos globais em `src/styles`.

## Comandos

- `pnpm install`, `pnpm dev` (front), `pnpm docker:up`, `pnpm docker:logs`, `pnpm docker:restart`
- Checar tipos do front: `cd apps/client && npx tsc --noEmit`
- Não há testes automatizados configurados.

## Regras de código

- Sem `any` (use `unknown` e faça a checagem) e sem non-null `!`.
- Imports locais com o alias `@/`. Código compartilhado vem de `@repo/types` / `@repo/utils`.
- Textos da interface e comentários em português do Brasil.
- Faça mudanças pequenas e, no final, explique o que mudou e como testar.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
