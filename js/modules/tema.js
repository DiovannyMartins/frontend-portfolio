/*
 * MÓDULO: Dark / Light mode
 * ----------------------------
 * Persiste a preferência do usuário em localStorage e troca as imagens
 * que dependem de contraste.
 *
 * A classe .light-mode é aplicada no <html> por um script inline no <head>
 * (anti-FOUC) — este módulo apenas sincroniza as imagens e o toggle.
 */

export function initTema() {
  const themeToggle = document.getElementById("themeToggle");

  if (!themeToggle) return;

  const root = document.documentElement;

  // [elemento, imagem no tema claro, imagem no tema escuro]
  const imagensPorTema = [
    [
      document.querySelector(".header__logo img"),
      "img/icon-logo-dark.png",
      "img/icon-logo.png",
    ],
    [
      document.getElementById("iconGithub"),
      "img/github-dark.png",
      "img/github.png",
    ],
    [
      document.getElementById("iconTema"),
      "img/icon-sol.png",
      "img/icon-lua.png",
    ],
    [
      document.getElementById("iconSeta"),
      "img/icon-seta-preto.png",
      "img/icon-seta-branco.png",
    ],
    [
      document.getElementById("iconEmail"),
      "img/icon-envelope-preto.png",
      "img/icon-envelope-branco.png",
    ],
  ];

  function temaAtual() {
    return root.classList.contains("light-mode") ? "light" : "dark";
  }

  function atualizarImagens() {
    const claro = temaAtual() === "light";

    imagensPorTema.forEach(([img, srcClaro, srcEscuro]) => {
      // Guarda individual: se uma imagem não existir na página, as outras continuam trocando
      if (img) {
        img.src = claro ? srcClaro : srcEscuro;
      }
    });
  }

  // Sincroniza as imagens com o tema já aplicado no carregamento da página.
  atualizarImagens();

  themeToggle.addEventListener("click", () => {
    root.classList.toggle("light-mode");
    localStorage.setItem("tema", temaAtual());
    atualizarImagens();
  });
}
