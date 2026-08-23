import { Hono } from "hono";
import { validarEmail } from "../../shared/validacao.js";
import { enviarEmail } from "../lib/email.js";
import { verificarTurnstile } from "../lib/turnstile.js";

// Validação server-side: nunca confie apenas na validação do navegador.

function validar(payload) {
  const nome = typeof payload?.nome === "string" ? payload.nome.trim() : "";
  const email = typeof payload?.email === "string" ? payload.email.trim() : "";
  const mensagem = typeof payload?.mensagem === "string" ? payload.mensagem.trim() : "";
  const erros = {};

  if (typeof payload?.nome !== "string" || nome.length < 3) {
    erros.nome = "Informe seu nome completo.";
  }
  if (nome.length > 100) erros.nome = "O nome deve ter no máximo 100 caracteres.";
  const possuiControle = (valor) =>
    [...valor].some((caractere) => {
      const codigo = caractere.codePointAt(0);
      return codigo < 32 || codigo === 127;
    });
  if (possuiControle(nome)) {
    erros.nome = "O nome contém caracteres inválidos.";
  }
  if (typeof payload?.email !== "string" || email.length > 254) {
    erros.email = "O e-mail deve ter no máximo 254 caracteres.";
  } else if (!validarEmail(email)) {
    erros.email = "Informe um e-mail válido.";
  }
  if (possuiControle(email)) erros.email = "O e-mail contém caracteres inválidos.";
  if (typeof payload?.mensagem !== "string" || mensagem.length < 10) {
    erros.mensagem = "A mensagem deve ter pelo menos 10 caracteres.";
  }
  if (mensagem.length > 5000) erros.mensagem = "A mensagem deve ter no máximo 5.000 caracteres.";
  if (possuiControle(mensagem)) {
    erros.mensagem = "A mensagem contém caracteres inválidos.";
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros,
    dados: { nome, email, mensagem },
  };
}

async function lerJsonLimitado(request, limite) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("JSON_INVALIDO");

  const partes = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limite) {
      await reader.cancel();
      throw new Error("CORPO_MUITO_GRANDE");
    }
    partes.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const parte of partes) {
    bytes.set(parte, offset);
    offset += parte.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(bytes));
}

export default function rotaContato(config) {
  const rota = new Hono();

  rota.post("/", async (c) => {
    const limiteCorpo = 16 * 1024;
    const contentType = c.req.header("content-type") || "";
    if (!contentType.toLowerCase().startsWith("application/json")) {
      return c.json({ success: false, error: "Content-Type deve ser application/json." }, 415);
    }

    const tamanho = Number(c.req.header("content-length") || 0);
    if (tamanho > limiteCorpo) {
      return c.json({ success: false, error: "Mensagem muito grande." }, 413);
    }

    let body;
    try {
      body = await lerJsonLimitado(c.req.raw, limiteCorpo);
    } catch (erro) {
      if (erro.message === "CORPO_MUITO_GRANDE") {
        return c.json({ success: false, error: "Mensagem muito grande." }, 413);
      }
      return c.json({ success: false, error: "JSON inválido." }, 400);
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return c.json({ success: false, error: "JSON inválido." }, 400);
    }

    if (!config.productionReady) {
      return c.json({ success: false, error: "Serviço de contato indisponível." }, 503);
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
      const token = typeof body?.turnstile === "string" ? body.turnstile.trim() : "";
      const captchaValido = await verificarTurnstile(token, config.turnstile.secretKey, {
        expectedHostnames: config.turnstile.expectedHostnames,
        expectedAction: config.turnstile.expectedAction,
      });

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
