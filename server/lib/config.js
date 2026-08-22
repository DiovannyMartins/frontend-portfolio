// Configuração centralizada, lida a partir de um objeto de ambiente.
// Recebe `process.env` (Node) ou `context.env` (Cloudflare Workers),
// para que o mesmo código rode nos dois runtimes.
export function carregarConfig(env = {}) {
  const isProduction =
    env.NODE_ENV === "production" || env.CONTEXT === "production" || env.CF_PAGES === "1";

  const resend = {
    apiKey: env.RESEND_API_KEY,
    from: env.RESEND_FROM,
  };
  const emailDestino = env.EMAIL_DESTINO || resend.from;
  const turnstile = {
    // Secret key do Cloudflare Turnstile. Sem ela, o captcha não é
    // validado (útil em dev, mas em produção o envio fica protegido).
    secretKey: env.TURNSTILE_SECRET_KEY,
  };

  return {
    isProduction,
    trustProxy: env.TRUST_PROXY === "true",
    productionReady:
      !isProduction || Boolean(resend.apiKey && resend.from && emailDestino && turnstile.secretKey),
    allowedOrigins: (env.FRONTEND_ORIGIN || "http://localhost:5173")
      .split(",")
      .map((origem) => origem.trim())
      .filter(Boolean),
    resend,
    emailDestino,
    turnstile,
  };
}
