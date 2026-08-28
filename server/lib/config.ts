// Configuração centralizada, lida a partir de um objeto de ambiente.
// Recebe `process.env` (Node) ou `context.env` (Cloudflare Workers),
// para que o mesmo código rode nos dois runtimes.
import type { AppConfig, AppEnv } from "../../shared/types.ts";

export function carregarConfig(env: AppEnv): AppConfig {
  const isProduction =
    env.NODE_ENV === "production" || env.CONTEXT === "production" || env.CF_PAGES === "1";

  const resend = {
    apiKey: env.RESEND_API_KEY,
    from: env.RESEND_FROM,
  };
  // Em produção o EMAIL_DESTINO é obrigatório (sem fallback — a validação de
  // productionReady abaixo garante isso). Em dev, sem ele, o envio cai no
  // remetente (RESEND_FROM), já que o fluxo é de teste/log.
  let emailDestino = env.EMAIL_DESTINO;
  if (!isProduction && !emailDestino) {
    emailDestino = resend.from;
  }
  const turnstile = {
    // Secret key do Cloudflare Turnstile. Sem ela, o captcha não é
    // validado (útil em dev, mas em produção o envio fica protegido).
    secretKey: env.TURNSTILE_SECRET_KEY,
    expectedHostnames: (env.TURNSTILE_HOSTNAMES || "")
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean),
    expectedAction: env.TURNSTILE_ACTION?.trim() || "",
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
    logEmailFallback: !isProduction && env.LOG_EMAIL_FALLBACK !== "false",
  };
}
