/*
 * MÓDULO: Efeito de digitação
 * -------------------------------
 * Digita o título do hero letra por letra ao carregar a página.
 */

export function initTypingEffect() {
  const alvo = document.getElementById("typingText");
  if (!alvo) return;

  const texto = "Desenvolvedor Front-End";
  const velocidadeMs = 100;
  let indice = 0;

  function digitar() {
    if (indice >= texto.length) return;

    alvo.textContent += texto.charAt(indice);
    indice++;
    setTimeout(digitar, velocidadeMs);
  }

  digitar();
}
