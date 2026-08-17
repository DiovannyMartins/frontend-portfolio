import { validarEmail } from "../../shared/validacao.js";

export function initFormulario() {
  const form = document.getElementById("formContato");
  if (!form) return;

  const campoNome = document.getElementById("nome");
  const campoEmail = document.getElementById("email");
  const campoMensagem = document.getElementById("mensagem");
  const campoWebsite = document.getElementById("website");
  const feedbackForm = document.getElementById("feedbackForm");

  // Única fonte de regras de validação: os listeners de "input" (validação em
  // tempo real) e o submit (validação completa) usam a mesma função avaliarCampo.
  const CAMPOS = [
    {
      campo: campoNome,
      erro: document.getElementById("erroNome"),
      validador: (valor) => valor.length >= 3,
      msgErro: "Digite seu nome completo.",
    },
    {
      campo: campoEmail,
      erro: document.getElementById("erroEmail"),
      validador: (valor) => validarEmail(valor),
      msgErro: "Digite um e-mail válido.",
    },
    {
      campo: campoMensagem,
      erro: document.getElementById("erroMensagem"),
      validador: (valor) => valor.length >= 10,
      msgErro: "Escreva uma mensagem com pelo menos 10 caracteres.",
    },
  ];

  const FEEDBACK_DURACAO_MS = 5000;
  let feedbackTimer;

  function marcarErro(campo, elementoErro, mensagem) {
    campo.classList.add("input--invalid");
    campo.classList.remove("input--valid");
    campo.setAttribute("aria-invalid", "true");
    elementoErro.textContent = mensagem;
  }

  function limparErro(campo, elementoErro) {
    campo.classList.remove("input--invalid");
    campo.removeAttribute("aria-invalid");
    elementoErro.textContent = "";
  }

  function marcarValido(campo) {
    campo.classList.add("input--valid");
    campo.classList.remove("input--invalid");
    campo.setAttribute("aria-invalid", "false");
  }

  // Estratégia de UX: campo vazio = neutro (sem borda colorida), campo
  // preenchido e inválido = vermelho, campo preenchido e válido = verde.
  // Assim o usuário não vê erros antes mesmo de interagir com o campo.
  // No submit, `forcarErro` marca os campos obrigatórios vazios como erro.
  function avaliarCampo({ campo, erro, validador, msgErro }, { forcarErro = false } = {}) {
    const valor = campo.value.trim();

    if (valor.length === 0) {
      if (forcarErro) {
        marcarErro(campo, erro, msgErro);
      } else {
        limparErro(campo, erro);
        campo.classList.remove("input--valid");
      }
      return false;
    }

    if (validador(valor)) {
      marcarValido(campo);
      limparErro(campo, erro);
      return true;
    }

    marcarErro(campo, erro, msgErro);
    return false;
  }

  CAMPOS.forEach(({ campo, erro, validador, msgErro }) => {
    campo.addEventListener("input", () => {
      avaliarCampo({ campo, erro, validador, msgErro });
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearTimeout(feedbackTimer);
    feedbackForm.textContent = "";
    feedbackForm.classList.remove("contact__feedback--error");

    const formValido = CAMPOS.every((item) => avaliarCampo(item, { forcarErro: true }));

    if (!formValido) {
      form.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    const botaoEnviar = form.querySelector(".contact__submit");
    const textoOriginal = botaoEnviar.textContent;
    botaoEnviar.disabled = true;
    form.setAttribute("aria-busy", "true");
    botaoEnviar.textContent = "Enviando...";

    const controller = new AbortController();
    const TIMEOUT_ENVIO_MS = 10000;
    const timerEnvio = setTimeout(() => controller.abort(), TIMEOUT_ENVIO_MS);

    try {
      // Checa se a API está ativa antes de enviar. Em hospedagem estática
      // (Live Server, GitHub Pages) não há backend: avisa e evita o POST 405.
      const health = await fetch("/api/health", { signal: controller.signal });
      if (!health.ok) {
        feedbackForm.classList.add("contact__feedback--error");
        feedbackForm.textContent =
          'O envio online não está ativo nesta hospedagem. Teste com "npm run dev:all" ou copie meu e-mail abaixo.';
        return;
      }

      const resposta = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: campoNome.value.trim(),
          email: campoEmail.value.trim(),
          mensagem: campoMensagem.value.trim(),
          website: campoWebsite?.value ?? "",
        }),
        signal: controller.signal,
      });

      const ehJson = resposta.headers.get("content-type")?.includes("application/json");
      const dados = ehJson
        ? await resposta.json().catch((erro) => {
            if (controller.signal.aborted) throw erro;
            return {};
          })
        : {};

      if (resposta.ok) {
        feedbackForm.textContent = "Mensagem enviada com sucesso! Em breve entrarei em contato.";
        form.reset();
        CAMPOS.forEach(({ campo }) => campo.classList.remove("input--valid"));
      } else if (ehJson && dados?.errors) {
        feedbackForm.classList.add("contact__feedback--error");
        feedbackForm.textContent = Object.values(dados.errors).join(" ");
      } else if (ehJson && dados?.error) {
        feedbackForm.classList.add("contact__feedback--error");
        feedbackForm.textContent = dados.error;
      } else {
        // Resposta não-JSON (404/405 do próprio servidor estático) significa
        // que o backend não está ativo nesta origem — ex.: Live Server ou
        // GitHub Pages, que não rodam o Express.
        feedbackForm.classList.add("contact__feedback--error");
        feedbackForm.textContent =
          'O envio online não está ativo nesta hospedagem. Teste com "npm run dev:all" ou copie meu e-mail abaixo.';
      }
    } catch {
      if (controller.signal.aborted) {
        feedbackForm.classList.add("contact__feedback--error");
        feedbackForm.textContent =
          "O envio demorou demais. Verifique sua conexão e tente novamente.";
      } else {
        feedbackForm.classList.add("contact__feedback--error");
        feedbackForm.textContent =
          "Não foi possível enviar. Verifique sua conexão e tente novamente.";
      }
    } finally {
      clearTimeout(timerEnvio);
      botaoEnviar.disabled = false;
      form.removeAttribute("aria-busy");
      botaoEnviar.textContent = textoOriginal;
      feedbackTimer = setTimeout(() => {
        feedbackForm.textContent = "";
      }, FEEDBACK_DURACAO_MS);
    }
  });
}
