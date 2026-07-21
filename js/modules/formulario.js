/*
 * MÓDULO: Formulário de contato
 * -----------------------------------
 * Validação client-side simples. Não substitui validação de backend
 * (que não existe aqui, já que é um formulário simulado), mas garante
 * boa experiência de preenchimento.
 */

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

  function validarEmail(email) {
    return REGEX_EMAIL.test(email);
  }

  function marcarErro(campo, elementoErro, mensagem) {
    campo.classList.add("input--invalid");
    campo.classList.remove("input--valid");
    elementoErro.textContent = mensagem;
  }

  function limparErro(campo, elementoErro) {
    campo.classList.remove("input--invalid");
    elementoErro.textContent = "";
  }

  function marcarValido(campo) {
    campo.classList.add("input--valid");
    campo.classList.remove("input--invalid");
  }

  // Validação em tempo real ao digitar
  campoNome.addEventListener("input", () => {
    if (campoNome.value.trim().length >= 3) {
      marcarValido(campoNome);
      limparErro(campoNome, erroNome);
    } else if (campoNome.value.trim().length > 0) {
      marcarErro(campoNome, erroNome, "Digite seu nome completo.");
    } else {
      limparErro(campoNome, erroNome);
      campoNome.classList.remove("input--valid");
    }
  });

  campoEmail.addEventListener("input", () => {
    if (validarEmail(campoEmail.value.trim())) {
      marcarValido(campoEmail);
      limparErro(campoEmail, erroEmail);
    } else if (campoEmail.value.trim().length > 0) {
      marcarErro(campoEmail, erroEmail, "Digite um e-mail válido.");
    } else {
      limparErro(campoEmail, erroEmail);
      campoEmail.classList.remove("input--valid");
    }
  });

  campoMensagem.addEventListener("input", () => {
    if (campoMensagem.value.trim().length >= 10) {
      marcarValido(campoMensagem);
      limparErro(campoMensagem, erroMensagem);
    } else if (campoMensagem.value.trim().length > 0) {
      marcarErro(
        campoMensagem,
        erroMensagem,
        "Escreva uma mensagem com pelo menos 10 caracteres.",
      );
    } else {
      limparErro(campoMensagem, erroMensagem);
      campoMensagem.classList.remove("input--valid");
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

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
      "Mensagem enviada com sucesso! Em breve entro em contato.";
    form.reset();

    // Remove classes de válido após reset
    campoNome.classList.remove("input--valid");
    campoEmail.classList.remove("input--valid");
    campoMensagem.classList.remove("input--valid");

    setTimeout(() => {
      feedbackForm.textContent = "";
    }, FEEDBACK_DURACAO_MS);
  });
}
