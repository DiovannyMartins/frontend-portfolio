export function initTypingEffect() {
  const alvo = document.getElementById("typingText");
  if (!alvo) return;

  const texto = alvo.textContent.trim();
  const velocidadeMs = 100;
  let indice = 0;

  alvo.textContent = "";

  function digitar() {
    if (indice >= texto.length) return;

    alvo.textContent += texto.charAt(indice);
    indice++;
    setTimeout(digitar, velocidadeMs);
  }

  digitar();
}
