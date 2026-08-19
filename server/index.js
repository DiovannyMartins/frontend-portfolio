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
  const resendFaltando = !config.resend.apiKey || !config.resend.from;

  if (resendFaltando) {
    console.error(
      "ERRO: em produção o envio de e-mail exige Resend configurado " +
        "(RESEND_API_KEY, RESEND_FROM). O modo log é exclusivo para " +
        "desenvolvimento local.",
    );
    process.exit(1);
  }
}

const app = criarApp(process.env);

serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3001 }, (info) => {
  console.log(`API rodando em http://localhost:${info.port}`);
});