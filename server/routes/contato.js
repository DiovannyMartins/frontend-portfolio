import { Router } from "express";
import { validarEmail } from "../../shared/validacao.js";
import { enviarEmail } from "../lib/email.js";

const router = Router();

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

router.post("/", async (req, res) => {
  // Honeypot anti-spam: bot preencheu o campo invisível, então recebe sucesso
  // simulado sem enviar e-mail (não revela a armadilha nem gasta quota).
  if (req.body?.website) {
    return res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  }

  const { valido, erros, dados } = validar(req.body);

  if (!valido) {
    return res.status(400).json({ success: false, errors: erros });
  }

  try {
    await enviarEmail(dados);
    res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (erro) {
    console.error("Falha ao enviar e-mail:", erro);
    res.status(500).json({
      success: false,
      error: "Não foi possível enviar a mensagem agora. Tente novamente em instantes.",
    });
  }
});

export default router;
