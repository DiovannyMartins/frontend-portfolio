import criarApp from "../../server/app.js";

// Pages Functions: qualquer rota sob /api/* cai aqui e é resolvida pelo app
// Hono (mesmo código que roda localmente via @hono/node-server).
let app;

export const onRequest = (context) => {
  // Pages Functions é sempre o caminho de produção; não permita que a
  // ausência acidental de NODE_ENV habilite o modo de desenvolvimento.
  app ??= criarApp({ ...context.env, NODE_ENV: "production", TRUST_PROXY: "true" });
  return app.fetch(context.request, context.env, context.executionCtx);
};
