import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// O dotenv é carregado aqui, no top-level deste módulo. Como imports são
// avaliados antes do corpo do módulo que os importa, qualquer importador
// (app.js, index.js, email.js) já recebe o process.env populado ao ler a
// config exportada abaixo — evitando ler variáveis ainda não carregadas.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const config = {
  port: Number(process.env.PORT) || 3001,
  isProduction: process.env.NODE_ENV === "production",
  trustProxy: process.env.TRUST_PROXY === "true",
  allowedOrigins: (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origem) => origem.trim())
    .filter(Boolean),
  smtp: {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    port: Number(process.env.SMTP_PORT) || 587,
  },
  emailDestino: process.env.EMAIL_DESTINO || process.env.SMTP_USER,
};
