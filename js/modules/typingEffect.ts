export function initTypingEffect() {
  const alvo = document.getElementById("typingText");
  if (!alvo) return;

  const barra = document.querySelector(".hero__accent");
  const texto = alvo.textContent?.trim() ?? "";
  const velocidadeMs = 100;
  const palavraChave = "Full-Stack";
  const inicioChave = texto.indexOf(palavraChave);
  let indice = 0;

  alvo.textContent = "";
  barra?.classList.add("hero__accent--hidden");

  const digitar = () => {
    if (indice >= texto.length) {
      barra?.classList.remove("hero__accent--hidden");
      return;
    }

    indice++;
    const digitado = texto.slice(0, indice);
    alvo.textContent = "";

    if (inicioChave !== -1 && digitado.length > inicioChave) {
      const fimChave = Math.min(inicioChave + palavraChave.length, digitado.length);

      if (inicioChave > 0) {
        alvo.appendChild(document.createTextNode(digitado.slice(0, inicioChave)));
      }

      const span = document.createElement("span");
      span.className = "hero__title-keyword";
      span.textContent = digitado.slice(inicioChave, fimChave);
      alvo.appendChild(span);

      if (fimChave < digitado.length) {
        alvo.appendChild(document.createTextNode(digitado.slice(fimChave)));
      }
    } else {
      alvo.appendChild(document.createTextNode(digitado));
    }

    setTimeout(digitar, velocidadeMs);
  };

  digitar();
}
