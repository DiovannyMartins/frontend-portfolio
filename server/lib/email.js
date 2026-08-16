import nodemailer from "nodemailer";

// Sem SMTP configurado no .env, o servidor roda em "modo log":
// as mensagens aparecem no console em vez de serem enviadas por e-mail,
// permitindo testar todo o fluxo localmente sem credenciais.
function criarTransporte() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function enviarEmail({ nome, email, mensagem }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("=== MENSAGEM RECEBIDA (modo log) ===");
    console.log({ nome, email, mensagem });
    return;
  }

  const destino = process.env.EMAIL_DESTINO || process.env.SMTP_USER;

  await criarTransporte().sendMail({
    from: `"Site Portfólio" <${process.env.SMTP_USER}>`,
    to: destino,
    replyTo: email,
    subject: `Novo contato de ${nome}`,
    text: `Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`,
  });
}