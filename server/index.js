import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import app from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Carrega o .env que fica junto do servidor. O dotenv por padrão procura
// ".env" no diretório de trabalho (raiz do projeto), onde o arquivo não está.
dotenv.config({ path: path.resolve(__dirname, ".env") });

const ehProducao = process.env.NODE_ENV === "production";

if (ehProducao) {
  const smtpFaltando =
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS;

  if (smtpFaltando) {
    console.error(
      "ERRO: em produção o envio de e-mail exige SMTP configurado " +
        "(SMTP_HOST, SMTP_USER, SMTP_PASS). O modo log é exclusivo para " +
        "desenvolvimento local.",
    );
    process.exit(1);
  }
}

const PORTA = Number(process.env.PORT) || 3001;

app.listen(PORTA, () => {
  console.log(`API rodando em http://localhost:${PORTA}`);
});