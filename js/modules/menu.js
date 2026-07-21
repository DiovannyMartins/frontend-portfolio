/*
 * MÓDULO: Menu mobile
 * ---------------------
 * Controla abertura/fechamento do menu no breakpoint mobile,
 * incluindo a animação do ícone hamburguer → X.
 */

export function initMenuMobile() {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".nav");

  if (!menuToggle || !nav) return; // guarda de segurança: evita erro se o módulo rodar em outra página sem esses elementos

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

  // Fecha o menu automaticamente ao clicar em um link.
  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      fecharMenu();
    });
  });

  // Fecha o menu ao clicar fora dele.
  document.addEventListener("click", (event) => {
    const clicouNoMenu = nav.contains(event.target);
    const clicouNoBotao = menuToggle.contains(event.target);

    if (!clicouNoMenu && !clicouNoBotao && nav.classList.contains("nav--active")) {
      fecharMenu();
    }
  });

  // Fecha o menu ao pressionar Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("nav--active")) {
      fecharMenu();
      menuToggle.focus();
    }
  });
}
