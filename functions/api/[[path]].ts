import criarApp from "../../server/app.ts";
import type { AppEnv } from "../../shared/types.ts";

// Pages Functions: qualquer rota sob /api/* cai aqui e é resolvida pelo app
// Hono (mesmo código que roda localmente via @hono/node-server).

let app: ReturnType<typeof criarApp> | undefined;

export const onRequest: PagesFunction<AppEnv> = (context) => {
  // Pages Functions é sempre o caminho de produção; não permita que a
  // ausência acidental de NODE_ENV habilite o modo de desenvolvimento.
  app ??= criarApp({ ...context.env, NODE_ENV: "production", TRUST_PROXY: "true" });

  // O EventContext real das Pages Functions expõe `waitUntil` e
  // `passThroughOnException` (não `executionCtx`). Monta-se um contexto de
  // execução compatível com o terceiro argumento de `app.fetch`.
  const executionCtx = {
    waitUntil: context.waitUntil,
    passThroughOnException: context.passThroughOnException,
    props: {},
  };

  return app.fetch(context.request, context.env, executionCtx);
};
