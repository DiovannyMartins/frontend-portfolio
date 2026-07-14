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

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("nav--active");
    menuToggle.classList.toggle("header__menu-toggle--active");
  });

  // Fecha o menu automaticamente ao clicar em um link.
  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav--active");
      menuToggle.classList.remove("header__menu-toggle--active");
    });
  });
}
