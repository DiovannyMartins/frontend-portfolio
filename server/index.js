import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { serve } from "@hono/node-server";
import criarApp from "./app.js";
import { carregarConfig } from "./lib/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

const config = carregarConfig(process.env);

if (config.isProduction) {
  const configuracaoFaltando =
    !config.resend.apiKey ||
    !config.resend.from ||
    !config.emailDestino ||
    !config.turnstile.secretKey;

  if (configuracaoFaltando) {
    console.error(
      "ERRO: em produção o contato exige Resend e Turnstile configurados " +
        "(RESEND_API_KEY, RESEND_FROM, EMAIL_DESTINO e TURNSTILE_SECRET_KEY).",
    );
    process.exit(1);
  }
}

const app = criarApp(process.env);

serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3001 }, (info) => {
  console.log(`API rodando em http://localhost:${info.port}`);
});
