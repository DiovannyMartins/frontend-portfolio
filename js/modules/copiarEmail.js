/*
 * MÓDULO: Copiar e-mail
 * -------------------------
 * Copia o e-mail para a área de transferência com feedback visual temporário.
 */

export function initCopiarEmail() {
  const btnCopiarEmail = document.getElementById("btnCopiarEmail");
  const textoCopiarEmail = document.getElementById("textoCopiarEmail");
  const iconEmail = document.getElementById("iconEmail");

  if (!btnCopiarEmail) return;

  const FEEDBACK_DURACAO_MS = 2000;

  function criarToast(mensagem, sucesso = true) {
    // Remove toast existente se houver
    const toastExistente = document.querySelector(".toast-notification");
    if (toastExistente) {
      toastExistente.remove();
    }

    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.innerHTML = `
      <span class="toast__icon">${sucesso ? "✓" : "✕"}</span>
      <span class="toast__message">${mensagem}</span>
    `;

    document.body.appendChild(toast);

    // Força reflow para animação funcionar
    toast.offsetHeight;
    toast.classList.add("toast--visible");

    setTimeout(() => {
      toast.classList.remove("toast--visible");
      setTimeout(() => toast.remove(), 300);
    }, FEEDBACK_DURACAO_MS);
  }

  btnCopiarEmail.addEventListener("click", () => {
    const email = btnCopiarEmail.dataset.email;

    navigator.clipboard.writeText(email).then(() => {
      const textoOriginal = textoCopiarEmail.textContent;
      const iconOriginal = iconEmail.src;
      const modoClaro = document.documentElement.classList.contains("light-mode");

      textoCopiarEmail.textContent = "Copiado!";
      iconEmail.src = modoClaro
        ? "img/icon-check-preto.png"
        : "img/icon-check-branco.png";

      criarToast("E-mail copiado com sucesso!");

      setTimeout(() => {
        textoCopiarEmail.textContent = textoOriginal;
        iconEmail.src = iconOriginal;
      }, FEEDBACK_DURACAO_MS);
    }).catch(() => {
      criarToast("Erro ao copiar e-mail. Tente novamente.", false);
    });
  });
}
