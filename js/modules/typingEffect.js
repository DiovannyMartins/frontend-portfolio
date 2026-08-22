export function initTypingEffect() {
  const alvo = document.getElementById("typingText");
  if (!alvo) return;

  const barra = document.querySelector(".hero__accent");
  const texto = alvo.textContent.trim();
  const velocidadeMs = 100;
  const palavraChave = "Full-Stack";
  const inicioChave = texto.indexOf(palavraChave);
  let indice = 0;

  alvo.textContent = "";
  barra?.classList.add("hero__accent--hidden");

  // Syntax highlight: envolve a palavra-chave em um span índigo conforme a
  // digitação alcança, como uma keyword destacada num editor de código.
  function montarHtml(digitado) {
    if (inicioChave === -1 || digitado.length <= inicioChave) return digitado;

    const fimChave = inicioChave + palavraChave.length;
    return (
      digitado.slice(0, inicioChave) +
      '<span class="hero__title-keyword">' +
      digitado.slice(inicioChave, fimChave) +
      "</span>" +
      digitado.slice(fimChave)
    );
  }

  function digitar() {
    if (indice >= texto.length) {
      barra?.classList.remove("hero__accent--hidden");
      return;
    }

    indice++;
    alvo.innerHTML = montarHtml(texto.slice(0, indice));
    setTimeout(digitar, velocidadeMs);
  }

  digitar();
}
