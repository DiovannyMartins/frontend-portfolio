import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { MemoryStore, rateLimiter } from "hono-rate-limiter";
import rotaContato from "./routes/contato.js";
import { carregarConfig } from "./lib/config.js";

// O mesmo app roda em dois runtimes:
// - Node (local/dev via @hono/node-server)
// - Cloudflare Workers/Pages Functions (via app.fetch)
// Por isso config recebe o objeto de ambiente (process.env ou context.env).
export default function criarApp(env = process.env) {
  const config = carregarConfig(env);
  const app = new Hono();

  // Cabeçalhos de segurança. A CSP é ajustada para não quebrar o Google Fonts.
  app.use(
    secureHeaders({
      contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        connectSrc: ["'self'", "https://challenges.cloudflare.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        frameSrc: ["https://challenges.cloudflare.com"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'", "https://challenges.cloudflare.com"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        upgradeInsecureRequests: [],
      },
    }),
  );

  // CORS: libera requisições sem Origin (curl, health check), da MESMA origem
  // e das origens configuradas em FRONTEND_ORIGIN.
  app.use(async (c, next) => {
    const origem = c.req.header("origin");
    if (!origem) return next();

    const host = c.req.header("host");
    const mesmaOrigem = origem === `http://${host}` || origem === `https://${host}`;

    if (mesmaOrigem || config.allowedOrigins.includes(origem)) {
      c.header("Access-Control-Allow-Origin", origem);
      c.header("Vary", "Origin");

      if (c.req.method === "OPTIONS") {
        c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        c.header("Access-Control-Allow-Headers", "Content-Type");
        return c.body(null, 204);
      }

      return next();
    }

    return c.json({ success: false, error: "Origem não permitida." }, 403);
  });

  // Limita envios por IP (ex.: 10 a cada 15 min) para reduzir spam no formulário.
  // No Workers o MemoryStore é por isolate (best-effort); o Cloudflare Rate
  // Limiting nativo pode substituí-lo via binding se necessário.
  app.use(
    "/api/contato",
    rateLimiter({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (c) =>
        c.req.header("cf-connecting-ip") ||
        (config.trustProxy ? c.req.header("x-forwarded-for")?.split(",")[0]?.trim() : null) ||
        "local",
      message: { success: false, error: "Muitas tentativas de envio. Aguarde alguns minutos." },
      store: new MemoryStore(),
    }),
  );

  app.route("/api/contato", rotaContato(config));

  // Health check usado por plataformas de hospedagem.
  app.get("/api/health", (c) => {
    if (!config.productionReady) return c.json({ ok: false }, 503);
    return c.json({ ok: true });
  });

  return app;
}
