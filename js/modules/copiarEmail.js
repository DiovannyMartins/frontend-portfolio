import { criarToast } from "./toast.js";

export function initCopiarEmail() {
  const btnCopiarEmail = document.getElementById("btnCopiarEmail");
  const textoCopiarEmail = document.getElementById("textoCopiarEmail");
  const iconEmail = document.getElementById("iconEmail");

  if (!btnCopiarEmail) return;

  const FEEDBACK_DURACAO_MS = 2000;
  const textoOriginal = textoCopiarEmail.textContent;
  const iconOriginal = iconEmail.src;
  let feedbackTimer;

  btnCopiarEmail.addEventListener("click", () => {
    const email = btnCopiarEmail.dataset.email;

    if (!navigator.clipboard?.writeText) {
      criarToast("Não foi possível copiar o e-mail neste navegador.", false);
      return;
    }

    navigator.clipboard
      .writeText(email)
      .then(() => {
        const modoClaro =
          document.documentElement.classList.contains("light-mode");

        textoCopiarEmail.textContent = "Copiado!";
        iconEmail.src = modoClaro
          ? "img/icon-check-preto.png"
          : "img/icon-check-branco.png";

        criarToast("E-mail copiado com sucesso!");

        clearTimeout(feedbackTimer);
        feedbackTimer = setTimeout(() => {
          textoCopiarEmail.textContent = textoOriginal;
          iconEmail.src = iconOriginal;
        }, FEEDBACK_DURACAO_MS);
      })
      .catch(() => {
        criarToast("Erro ao copiar e-mail. Tente novamente.", false);
      });
  });
}
