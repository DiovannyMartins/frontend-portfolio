export function initTema() {
  const themeToggle = document.getElementById("themeToggle");

  if (!themeToggle) return;

  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');

  // [elemento, imagem no tema claro, imagem no tema escuro]
  // Caminhos em string (e não import) para que o site funcione também em
  // hospedagem estática crua (ex.: GitHub Pages), sem build do Vite.
  const imagensPorTema = [
    [document.querySelector(".header__logo img"), "img/icon-logo-dark.png", "img/icon-logo.png"],
    [document.getElementById("iconGithub"), "img/github-dark.png", "img/github.png"],
    [document.getElementById("iconTema"), "img/icon-sol.png", "img/icon-lua.png"],
    [document.getElementById("iconSeta"), "img/icon-seta-preto.png", "img/icon-seta-branco.png"],
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

  function atualizarThemeColor() {
    if (themeColor) {
      themeColor.content = temaAtual() === "light" ? "#f5f5f5" : "#1e1e1e";
    }
  }

  function atualizarAcessibilidade() {
    const claro = temaAtual() === "light";
    themeToggle.setAttribute("aria-pressed", String(claro));
    themeToggle.setAttribute("aria-label", claro ? "Ativar tema escuro" : "Ativar tema claro");
  }

  atualizarImagens();
  atualizarThemeColor();
  atualizarAcessibilidade();

  themeToggle.addEventListener("click", () => {
    root.classList.toggle("light-mode");
    localStorage.setItem("tema", temaAtual());
    atualizarImagens();
    atualizarThemeColor();
    atualizarAcessibilidade();
  });
}
