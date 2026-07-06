// Seleciona os elementos do menu mobile
const menuToggle = document.getElementById("menuToggle");
const menu = document.querySelector(".menu");

// Alterna a classe "active" ao clicar no botão hambúrguer
menuToggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// Fecha o menu automaticamente ao clicar em um link (boa prática de UX)
const menuLinks = document.querySelectorAll(".menu a");

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
  });
});
