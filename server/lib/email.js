import nodemailer from "nodemailer";
import { config } from "./config.js";

// Sem SMTP configurado no .env, o servidor roda em "modo log":
// as mensagens aparecem no console em vez de serem enviadas por e-mail,
// permitindo testar todo o fluxo localmente sem credenciais.
function criarTransporte() {
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
}

export async function enviarEmail({ nome, email, mensagem }) {
  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
    console.log("=== MENSAGEM RECEBIDA (modo log) ===");
    console.log({ nome, email, mensagem });
    return;
  }

  await criarTransporte().sendMail({
    from: `"Site Portfólio" <${config.smtp.user}>`,
    to: config.emailDestino,
    replyTo: email,
    subject: `Novo contato de ${nome}`,
    text: `Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`,
  });
}
