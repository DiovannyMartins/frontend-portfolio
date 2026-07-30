export function criarToast(mensagem, sucesso = true) {
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

  toast.offsetHeight;
  toast.classList.add("toast--visible");

  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
