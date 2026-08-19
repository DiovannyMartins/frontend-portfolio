// Envio de e-mail via Resend (API REST). Funciona no Node e no Workers,
// pois usa apenas `fetch` — sem dependência de sockets/SMTP.
export async function enviarEmail({ nome, email, mensagem }, config) {
  // Sem RESEND_API_KEY/RESEND_FROM no ambiente, roda em "modo log":
  // a mensagem aparece no console em vez de ser enviada por e-mail.
  if (!config.resend.apiKey || !config.resend.from) {
    console.log("=== MENSAGEM RECEBIDA (modo log) ===");
    console.log({ nome, email, mensagem });
    return;
  }

  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resend.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.resend.from,
      to: [config.emailDestino],
      reply_to: email,
      subject: `Novo contato de ${nome}`,
      text: `Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`,
    }),
  });

  if (!resposta.ok) {
    const corpo = await resposta.text();
    throw new Error(`Resend respondeu ${resposta.status}: ${corpo}`);
  }
}