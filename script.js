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

// Dark/Light mode
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Aplica o tema salvo ao carregar a página
const temaSalvo = localStorage.getItem("tema");
if (temaSalvo === "light") {
  body.classList.add("light-mode");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");

  if (body.classList.contains("light-mode")) {
    themeToggle.textContent = "☀️";
    localStorage.setItem("tema", "light");
  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("tema", "dark");
  }
});

// Destaca o link do menu conforme a seção visível na tela
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".menu a");

const menuObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  { rootMargin: "-50% 0px -50% 0px" },
);

sections.forEach((section) => menuObserver.observe(section));

// Scroll reveal (fade-in ao aparecer na tela)
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 },
);

revealElements.forEach((el) => revealObserver.observe(el));

// Copia o e-mail para a área de transferência
const btnCopiarEmail = document.getElementById("btnCopiarEmail");

btnCopiarEmail.addEventListener("click", () => {
  const email = btnCopiarEmail.dataset.email;

  navigator.clipboard.writeText(email).then(() => {
    const textoOriginal = btnCopiarEmail.textContent;
    btnCopiarEmail.textContent = "✅ Copiado!";

    setTimeout(() => {
      btnCopiarEmail.textContent = textoOriginal;
    }, 2000);
  });
});
