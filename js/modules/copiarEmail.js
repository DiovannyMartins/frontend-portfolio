import { criarToast } from "./toast.js";

export function initCopiarEmail() {
  const btnCopiarEmail = document.getElementById("btnCopiarEmail");
  const textoCopiarEmail = document.getElementById("textoCopiarEmail");
  const iconEmail = document.getElementById("iconEmail");

  if (!btnCopiarEmail) return;

  const FEEDBACK_DURACAO_MS = 2000;

  btnCopiarEmail.addEventListener("click", () => {
    const email = btnCopiarEmail.dataset.email;

    navigator.clipboard
      .writeText(email)
      .then(() => {
        const textoOriginal = textoCopiarEmail.textContent;
        const iconOriginal = iconEmail.src;
        const modoClaro =
          document.documentElement.classList.contains("light-mode");

        textoCopiarEmail.textContent = "Copiado!";
        iconEmail.src = modoClaro
          ? "img/icon-check-preto.png"
          : "img/icon-check-branco.png";

        criarToast("E-mail copiado com sucesso!");

        setTimeout(() => {
          textoCopiarEmail.textContent = textoOriginal;
          iconEmail.src = iconOriginal;
        }, FEEDBACK_DURACAO_MS);
      })
      .catch(() => {
        criarToast("Erro ao copiar e-mail. Tente novamente.", false);
      });
  });
}
