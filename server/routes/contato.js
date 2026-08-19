import { Hono } from "hono";
import { validarEmail } from "../../shared/validacao.js";
import { enviarEmail } from "../lib/email.js";
import { verificarTurnstile } from "../lib/turnstile.js";

// Validação server-side: nunca confie apenas na validação do navegador.

function validar(payload) {
  const nome = (payload?.nome ?? "").trim();
  const email = (payload?.email ?? "").trim();
  const mensagem = (payload?.mensagem ?? "").trim();
  const erros = {};

  if (nome.length < 3) erros.nome = "Informe seu nome completo.";
  if (nome.length > 100) erros.nome = "O nome deve ter no máximo 100 caracteres.";
  if (email.length > 254) {
    erros.email = "O e-mail deve ter no máximo 254 caracteres.";
  } else if (!validarEmail(email)) {
    erros.email = "Informe um e-mail válido.";
  }
  if (mensagem.length < 10) erros.mensagem = "A mensagem deve ter pelo menos 10 caracteres.";
  if (mensagem.length > 5000) erros.mensagem = "A mensagem deve ter no máximo 5.000 caracteres.";

  return {
    valido: Object.keys(erros).length === 0,
    erros,
    dados: { nome, email, mensagem },
  };
}

export default function rotaContato(config) {
  const rota = new Hono();

  rota.post("/", async (c) => {
    // Limite de tamanho do corpo antes de ler o JSON (16kb).
    const tamanho = Number(c.req.header("content-length") || 0);
    if (tamanho > 16 * 1024) {
      return c.json({ success: false, error: "Mensagem muito grande." }, 413);
    }

    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ success: false, error: "JSON inválido." }, 400);
    }

    // Honeypot anti-spam: bot preencheu o campo invisível, então recebe sucesso
    // simulado sem enviar e-mail (não revela a armadilha nem gasta quota).
    if (body?.website) {
      return c.json({ success: true, message: "Mensagem enviada com sucesso!" });
    }

    const { valido, erros, dados } = validar(body);

    if (!valido) {
      return c.json({ success: false, errors: erros }, 400);
    }

    // Cloudflare Turnstile: valida o token quando a secret key está
    // configurada (produção). Sem ela, segue sem validar — útil em dev.
    if (config.turnstile.secretKey) {
      const token = (body?.turnstile ?? "").trim();
      const captchaValido = await verificarTurnstile(token, config.turnstile.secretKey);

      if (!captchaValido) {
        return c.json(
          { success: false, error: "Falha na verificação de segurança. Tente novamente." },
          400,
        );
      }
    }

    try {
      await enviarEmail(dados, config);
      return c.json({ success: true, message: "Mensagem enviada com sucesso!" });
    } catch (erro) {
      console.error("Falha ao enviar e-mail:", erro);
      return c.json(
        {
          success: false,
          error: "Não foi possível enviar a mensagem agora. Tente novamente em instantes.",
        },
        500,
      );
    }
  });

  return rota;
}