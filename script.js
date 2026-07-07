// Seleciona os elementos do menu mobile
const menuToggle = document.getElementById("menuToggle");
const menu = document.querySelector(".menu");

// Alterna a classe "active" no menu E no botão ao clicar no hambúrguer
menuToggle.addEventListener("click", () => {
  menu.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

// Fecha o menu automaticamente ao clicar em um link
const menuLinks = document.querySelectorAll(".menu a");

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
    menuToggle.classList.remove("active");
  });
});
