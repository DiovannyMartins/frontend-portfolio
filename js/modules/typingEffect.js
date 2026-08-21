export function initTypingEffect() {
  const alvo = document.getElementById("typingText");
  if (!alvo) return;

  const barra = document.querySelector(".hero__accent");
  const texto = alvo.textContent.trim();
  const velocidadeMs = 100;
  let indice = 0;

  alvo.textContent = "";
  barra?.classList.add("hero__accent--hidden");

  function digitar() {
    if (indice >= texto.length) {
      barra?.classList.remove("hero__accent--hidden");
      return;
    }

    alvo.textContent += texto.charAt(indice);
    indice++;
    setTimeout(digitar, velocidadeMs);
  }

  digitar();
}
