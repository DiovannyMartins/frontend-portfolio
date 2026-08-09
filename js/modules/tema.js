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
      if (img) {
        img.src = claro ? srcClaro : srcEscuro;
      }
    });
  }

  atualizarImagens();

  themeToggle.addEventListener("click", () => {
    root.classList.toggle("light-mode");
    localStorage.setItem("tema", temaAtual());
    atualizarImagens();
  });
}
