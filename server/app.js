import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import rateLimit from "express-rate-limit";
import rotaContato from "./routes/contato.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const origensPermitidas = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origem) => origem.trim())
  .filter(Boolean);

// CORS: libera requisições sem Origin (curl, health check), da MESMA origem
// (em produção o Express serve o build na mesma porta e os assets com
// `crossorigin` enviam um Origin igual ao Host) e as origens configuradas em
// FRONTEND_ORIGIN.
app.use((req, res, next) => {
  const origem = req.headers.origin;
  if (!origem) return next();

  const mesmaOrigem =
    origem === `http://${req.headers.host}` || origem === `https://${req.headers.host}`;

  if (mesmaOrigem || origensPermitidas.includes(origem)) {
    res.setHeader("Access-Control-Allow-Origin", origem);
    res.setHeader("Vary", "Origin");

    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.sendStatus(204);
    }

    return next();
  }

  return res.status(403).json({ success: false, error: "Origem não permitida." });
});

app.use(express.json({ limit: "16kb" }));

// Limita envios por IP (ex.: 10 a cada 15 min) para reduzir spam no formulário.
const limitadorContato = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Muitas tentativas de envio. Aguarde alguns minutos." },
});

app.use("/api/contato", limitadorContato, rotaContato);

// Health check usado por plataformas de hospedagem (Render, Railway, etc.)
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Em produção, o Express também serve o build estático gerado pelo Vite
// (npm run build), para que site e API fiquem em um único processo.
if (process.env.NODE_ENV === "production") {
  const distDir = path.resolve(__dirname, "../dist");
  app.use(express.static(distDir));

  // SPA fallback: qualquer rota que não seja da API entrega o index.html.
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
}

// Respostas JSON consistentes para payloads malformados.
app.use((erro, req, res, next) => {
  if (erro?.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, error: "JSON inválido." });
  }

  if (erro?.type === "entity.too.large") {
    return res.status(413).json({ success: false, error: "Mensagem muito grande." });
  }

  return next(erro);
});

export default app;
