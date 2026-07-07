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

// Atualiza o ano do rodapé automaticamente
const anoAtual = document.getElementById("anoAtual");
anoAtual.textContent = new Date().getFullYear();

// Botão voltar ao topo
const btnTopo = document.getElementById("btnTopo");

// Mostra o botão só depois que o usuário rolar a página
window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    btnTopo.classList.add("mostrar");
  } else {
    btnTopo.classList.remove("mostrar");
  }
});

// Ao clicar, rola suavemente até o topo
btnTopo.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
