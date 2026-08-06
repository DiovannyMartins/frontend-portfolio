export function criarToast(mensagem, sucesso = true) {
  const toastExistente = document.querySelector(".toast-notification");
  if (toastExistente) {
    toastExistente.remove();
  }

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  const icon = document.createElement("span");
  icon.className = "toast__icon";
  icon.textContent = sucesso ? "✓" : "✕";

  const message = document.createElement("span");
  message.className = "toast__message";
  message.textContent = mensagem;

  toast.appendChild(icon);
  toast.appendChild(message);

  document.body.appendChild(toast);

  toast.offsetHeight;
  toast.classList.add("toast--visible");

  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
