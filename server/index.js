import criarApp from "./app.js";
import { config } from "./lib/config.js";

if (config.isProduction) {
  const smtpFaltando = !config.smtp.host || !config.smtp.user || !config.smtp.pass;

  if (smtpFaltando) {
    console.error(
      "ERRO: em produção o envio de e-mail exige SMTP configurado " +
        "(SMTP_HOST, SMTP_USER, SMTP_PASS). O modo log é exclusivo para " +
        "desenvolvimento local.",
    );
    process.exit(1);
  }
}

const app = criarApp();

app.listen(config.port, () => {
  console.log(`API rodando em http://localhost:${config.port}`);
});
