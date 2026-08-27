import { criarToast } from "./toast.ts";

export function initCopiarEmail() {
  const btnCopiarEmail = document.querySelector<HTMLButtonElement>("#btnCopiarEmail");
  const textoCopiarEmail = document.getElementById("textoCopiarEmail");
  const iconEmail = document.querySelector<HTMLImageElement>("#iconEmail");

  if (!btnCopiarEmail || !textoCopiarEmail || !iconEmail) return;

  const FEEDBACK_DURACAO_MS = 2000;
  const textoOriginal = textoCopiarEmail.textContent;
  let feedbackTimer: number | undefined;

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
    // data-email é sempre preenchido no HTML; o fallback só cobre o caso de
    // marcação quebrada sem passar undefined para o Clipboard API.
    const email = btnCopiarEmail.dataset.email ?? "";

    const mostrarSucesso = () => {
      textoCopiarEmail.textContent = "Copiado!";
      iconEmail.src = iconCheckAtual();

      criarToast("E-mail copiado com sucesso!");

      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => {
        textoCopiarEmail.textContent = textoOriginal;
        iconEmail.src = iconEnvelopeAtual();
      }, FEEDBACK_DURACAO_MS);
    };

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

function copiarComFallback(texto: string): Promise<void> {
  const area = document.createElement("textarea");
  area.value = texto;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);

  try {
    area.select();
    return document.execCommand("copy")
      ? Promise.resolve()
      : Promise.reject(new Error("Cópia não suportada"));
  } finally {
    area.remove();
  }
}
