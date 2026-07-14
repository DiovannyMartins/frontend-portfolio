/*
 * MÓDULO: Dark / Light mode
 * ----------------------------
 * Persiste a preferência do usuário em localStorage e troca as imagens
 * que dependem de contraste.
 */

export function initTema() {
  const themeToggle = document.getElementById("themeToggle");
  const iconTema = document.getElementById("iconTema");
  const iconSeta = document.getElementById("iconSeta");
  const iconEmail = document.getElementById("iconEmail");
  const logoImg = document.querySelector(".header__logo img");
  const iconGithub = document.getElementById("iconGithub");
  const body = document.body;

  if (!themeToggle) return;

  function atualizarImagens(tema) {
    const claro = tema === "light";
    logoImg.src = claro ? "img/icon-logo-dark.png" : "img/icon-logo.png";
    iconGithub.src = claro ? "img/github-dark.png" : "img/github.png";
    iconTema.src = claro ? "img/icon-sol.png" : "img/icon-lua.png";
    iconSeta.src = claro
      ? "img/icon-seta-preto.png"
      : "img/icon-seta-branco.png";
    iconEmail.src = claro
      ? "img/icon-envelope-preto.png"
      : "img/icon-envelope-branco.png";
  }

  // Aplica o tema salvo assim que a página carrega, antes de qualquer interação.
  const temaSalvo = localStorage.getItem("tema");
  if (temaSalvo === "light") {
    body.classList.add("light-mode");
  }
  atualizarImagens(temaSalvo === "light" ? "light" : "dark");

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const novoTema = body.classList.contains("light-mode") ? "light" : "dark";

    localStorage.setItem("tema", novoTema);
    atualizarImagens(novoTema);
  });
}
