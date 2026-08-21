// Ícones desenhados (geometria, não Unicode) — check verde para sucesso e
// X vermelho para erro. O estado de erro usa --status-error, corrigindo o
// feedback de "Erro ao copiar e-mail" que antes exibia ícone verde.
const ICONES = {
  sucesso:
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="12" fill="var(--status-success)"/><path d="M7 12.5l3.5 3.5L17 9" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  erro:
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="12" fill="var(--status-error)"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
};

export function criarToast(mensagem, sucesso = true) {
  const toastExistente = document.querySelector(".toast-notification");
  if (toastExistente) {
    toastExistente.remove();
  }

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.classList.toggle("toast--error", !sucesso);
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  const icon = document.createElement("span");
  icon.className = "toast__icon";
  icon.innerHTML = sucesso ? ICONES.sucesso : ICONES.erro;

  const message = document.createElement("span");
  message.className = "toast__message";
  message.textContent = mensagem;

  toast.appendChild(icon);
  toast.appendChild(message);

  document.body.appendChild(toast);

  // Força um reflow lendo offsetHeight. Sem isso, o navegador agrupa a
  // adição do elemento e da classe .toast--visible no mesmo frame, e a
  // transição CSS de opacity/transform nunca dispara.
  toast.offsetHeight;
  toast.classList.add("toast--visible");

  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
