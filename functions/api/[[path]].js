import criarApp from "../../server/app.js";

// Pages Functions: qualquer rota sob /api/* cai aqui e é resolvida pelo app
// Hono (mesmo código que roda localmente via @hono/node-server).
let app;

export const onRequest = (context) => {
  app ??= criarApp(context.env);
  return app.fetch(context.request, context.env, context.executionCtx);
};