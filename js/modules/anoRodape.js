/*
 * MÓDULO: Ano automático no rodapé
 * --------------------------------------
 */

export function initAnoRodape() {
  const anoAtual = document.getElementById("anoAtual");
  if (!anoAtual) return;

  anoAtual.textContent = new Date().getFullYear();
}
