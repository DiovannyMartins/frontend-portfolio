import { criarToast } from "./toast.js";

export function initCopiarEmail() {
  const btnCopiarEmail = document.getElementById("btnCopiarEmail");
  const textoCopiarEmail = document.getElementById("textoCopiarEmail");
  const iconEmail = document.getElementById("iconEmail");

  if (!btnCopiarEmail || !textoCopiarEmail || !iconEmail) return;

  const FEEDBACK_DURACAO_MS = 2000;
  const textoOriginal = textoCopiarEmail.textContent;
  let feedbackTimer;

  // O ícone do envelope deve sempre refletir o tema ATUAL, e não o tema do
  // momento em que a página carregou — senão, após alternar o tema e copiar,
  // a restauração mostraria o ícone do tema errado.
  function iconEnvelopeAtual() {
    return document.documentElement.classList.contains("light-mode")
      ? "img/icon-envelope-preto.png"
      : "img/icon-envelope-branco.png";
  }

  function iconCheckAtual() {
    return document.documentElement.classList.contains("light-mode")
      ? "img/icon-check-preto.png"
      : "img/icon-check-branco.png";
  }

  btnCopiarEmail.addEventListener("click", async () => {
    const email = btnCopiarEmail.dataset.email;

    function mostrarSucesso() {
      textoCopiarEmail.textContent = "Copiado!";
      iconEmail.src = iconCheckAtual();

      criarToast("E-mail copiado com sucesso!");

      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => {
        textoCopiarEmail.textContent = textoOriginal;
        iconEmail.src = iconEnvelopeAtual();
      }, FEEDBACK_DURACAO_MS);
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        await copiarComFallback(email);
      }
      mostrarSucesso();
    } catch {
      try {
        await copiarComFallback(email);
        mostrarSucesso();
      } catch {
        criarToast("Erro ao copiar e-mail. Tente novamente.", false);
      }
    }
  });
}

function copiarComFallback(texto) {
  const area = document.createElement("textarea");
  area.value = texto;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
area.style.opacity = "0";
  document.body.appendChild(area);

  let copiou = false;
  try {
    area.select();
    copiou = document.execCommand("copy");
  } finally {
    area.remove();
  }

  return copiou
    ? Promise.resolve()
    : Promise.reject(new Error("Cópia não suportada"));
}
