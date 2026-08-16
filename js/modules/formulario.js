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
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearTimeout(feedbackTimer);
    feedbackForm.textContent = "";

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

    if (!formValido) return;

    feedbackForm.textContent =
      "Formulário validado. O envio ainda não está configurado; copie o e-mail abaixo para enviar sua mensagem.";

    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
      feedbackForm.textContent = "";
    }, FEEDBACK_DURACAO_MS);
  });
}
