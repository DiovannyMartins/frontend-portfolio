export function initFormulario() {
  const form = document.getElementById("formContato");
  if (!form) return;

  const campoNome = document.getElementById("nome");
  const campoEmail = document.getElementById("email");
  const campoMensagem = document.getElementById("mensagem");
  const feedbackForm = document.getElementById("feedbackForm");

  const erroNome = document.getElementById("erroNome");
  const erroEmail = document.getElementById("erroEmail");
  const erroMensagem = document.getElementById("erroMensagem");

  const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const FEEDBACK_DURACAO_MS = 5000;
  let feedbackTimer;

  function validarEmail(email) {
    return REGEX_EMAIL.test(email);
  }

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

  function configurarValidacaoCampo(campo, elementoErro, validador, msgErro) {
    // Estratégia de UX: campo vazio = neutro (sem borda colorida), campo
    // preenchido e inválido = vermelho, campo preenchido e válido = verde.
    // Assim o usuário não vê erros antes mesmo de interagir com o campo.
    campo.addEventListener("input", () => {
      const valor = campo.value.trim();
      if (valor.length > 0 && validador(valor)) {
        marcarValido(campo);
        limparErro(campo, elementoErro);
      } else if (valor.length > 0) {
        marcarErro(campo, elementoErro, msgErro);
      } else {
        limparErro(campo, elementoErro);
        campo.classList.remove("input--valid");
      }
    });
  }

  configurarValidacaoCampo(
    campoNome,
    erroNome,
    (v) => v.length >= 3,
    "Digite seu nome completo.",
  );

  configurarValidacaoCampo(
    campoEmail,
    erroEmail,
    (v) => validarEmail(v),
    "Digite um e-mail válido.",
  );

  configurarValidacaoCampo(
    campoMensagem,
    erroMensagem,
    (v) => v.length >= 10,
    "Escreva uma mensagem com pelo menos 10 caracteres.",
  );

  // A validação no submit duplica a lógica dos listeners de input porque
  // tem um contrato diferente: aqui forçamos erro em todos os campos
  // inválidos de uma vez (mesmo os que o usuário nunca tocou), para que
  // o formulário inteiro seja validado no momento do envio.
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearTimeout(feedbackTimer);
    feedbackForm.textContent = "";
    feedbackForm.classList.remove("contact__feedback--error");

    let formValido = true;

    if (campoNome.value.trim().length < 3) {
      marcarErro(campoNome, erroNome, "Digite seu nome completo.");
      formValido = false;
    } else {
      marcarValido(campoNome);
      limparErro(campoNome, erroNome);
    }

    if (!validarEmail(campoEmail.value.trim())) {
      marcarErro(campoEmail, erroEmail, "Digite um e-mail válido.");
      formValido = false;
    } else {
      marcarValido(campoEmail);
      limparErro(campoEmail, erroEmail);
    }

    if (campoMensagem.value.trim().length < 10) {
      marcarErro(
        campoMensagem,
        erroMensagem,
        "Escreva uma mensagem com pelo menos 10 caracteres.",
      );
      formValido = false;
    } else {
      marcarValido(campoMensagem);
      limparErro(campoMensagem, erroMensagem);
    }

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
          "O envio online não está ativo nesta hospedagem. Teste com \"npm run dev:all\" ou copie meu e-mail abaixo.";
        return;
      }

      const resposta = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: campoNome.value.trim(),
          email: campoEmail.value.trim(),
          mensagem: campoMensagem.value.trim(),
        }),
        signal: controller.signal,
      });

      const ehJson = resposta.headers
        .get("content-type")
        ?.includes("application/json");
      const dados = ehJson
        ? await resposta.json().catch((erro) => {
            if (controller.signal.aborted) throw erro;
            return {};
          })
        : {};

      if (resposta.ok) {
        feedbackForm.textContent =
          "Mensagem enviada com sucesso! Em breve entrarei em contato.";
        form.reset();
        campoNome.classList.remove("input--valid");
        campoEmail.classList.remove("input--valid");
        campoMensagem.classList.remove("input--valid");
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
          "O envio online não está ativo nesta hospedagem. Teste com \"npm run dev:all\" ou copie meu e-mail abaixo.";
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
