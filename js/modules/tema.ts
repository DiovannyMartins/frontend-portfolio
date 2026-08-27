type Tema = "light" | "dark";

type ImagemPorTema = [imagem: HTMLImageElement | null, srcClaro: string, srcEscuro: string];

export function initTema() {
  const themeToggle = document.getElementById("themeToggle");

  if (!themeToggle) return;

  const root = document.documentElement;
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const themeLabel = document.getElementById("themeLabel");

  // [elemento, imagem no tema claro, imagem no tema escuro]
  // Caminhos em string (e não import) para que as imagens continuem válidas no
  // build gerado em `dist/` (o Vite não processa essas referências dinâmicas).
  const imagensPorTema: ImagemPorTema[] = [
    [
      document.querySelector<HTMLImageElement>(".header__logo img"),
      "img/icon-logo-dark.png",
      "img/icon-logo.png",
    ],
    [
      document.querySelector<HTMLImageElement>("#iconGithub"),
      "img/github-dark.png",
      "img/github.png",
    ],
    [document.querySelector<HTMLImageElement>("#iconTema"), "img/icon-sol.png", "img/icon-lua.png"],
    [
      document.querySelector<HTMLImageElement>("#iconSeta"),
      "img/icon-seta-preto.png",
      "img/icon-seta-branco.png",
    ],
    [
      document.querySelector<HTMLImageElement>("#iconEmail"),
      "img/icon-envelope-preto.png",
      "img/icon-envelope-branco.png",
    ],
  ];

  function temaAtual(): Tema {
    return root.classList.contains("light-mode") ? "light" : "dark";
  }

  const atualizarImagens = () => {
    const claro = temaAtual() === "light";

    imagensPorTema.forEach(([img, srcClaro, srcEscuro]) => {
      if (img) {
        img.src = claro ? srcClaro : srcEscuro;
      }
    });
  };

  const atualizarThemeColor = () => {
    if (themeColor) {
      themeColor.content = temaAtual() === "light" ? "#f5f5f5" : "#1e1e1e";
    }
  };

  const atualizarAcessibilidade = () => {
    const claro = temaAtual() === "light";
    themeToggle.setAttribute("aria-pressed", String(claro));
    themeToggle.setAttribute("aria-label", claro ? "Ativar tema escuro" : "Ativar tema claro");
    if (themeLabel) {
      themeLabel.textContent = claro ? "Tema escuro" : "Tema claro";
    }
  };

  atualizarImagens();
  atualizarThemeColor();
  atualizarAcessibilidade();

  themeToggle.addEventListener("click", () => {
    const aplicarTema = () => {
      root.classList.toggle("light-mode");
      try {
        localStorage.setItem("tema", temaAtual());
      } catch {
        // Preferência de tema continua funcionando mesmo sem storage.
      }
      atualizarImagens();
      atualizarThemeColor();
      atualizarAcessibilidade();
    };

    // Transição cinematográfica da troca de tema via View Transitions.
    // Fallback: troca instantânea quando o navegador não suporta.
    if (document.startViewTransition) {
      document.startViewTransition(aplicarTema);
    } else {
      aplicarTema();
    }
  });
}
