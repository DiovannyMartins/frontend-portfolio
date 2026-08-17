export function initMenuMobile() {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".nav");

  if (!menuToggle || !nav) return;

  function abrirMenu() {
    nav.classList.add("nav--active");
    menuToggle.classList.add("header__menu-toggle--active");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fechar menu");
  }

  function fecharMenu() {
    nav.classList.remove("nav--active");
    menuToggle.classList.remove("header__menu-toggle--active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }

  menuToggle.addEventListener("click", () => {
    const estaAberto = nav.classList.contains("nav--active");
    if (estaAberto) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  });

  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });

  document.addEventListener("click", (event) => {
    const clicouNoMenu = nav.contains(event.target);
    const clicouNoBotao = menuToggle.contains(event.target);

    if (!clicouNoMenu && !clicouNoBotao && nav.classList.contains("nav--active")) {
      fecharMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("nav--active")) {
      fecharMenu();
      menuToggle.focus();
    }
  });

  // Ao redimensionar para desktop, o toggle some (display: none no CSS) e o
  // menu aberto não deve permanecer no estado "ativo".
  window.addEventListener("resize", () => {
    const toggleVisivel = getComputedStyle(menuToggle).display !== "none";
    if (nav.classList.contains("nav--active") && !toggleVisivel) {
      fecharMenu();
    }
  });
}
