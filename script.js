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
const iconeTema = themeToggle.querySelector("i");
const logoImg = document.querySelector(".logo img");
const iconGithub = document.getElementById("iconGithub");
const body = document.body;

// Troca a logo e o ícone do GitHub conforme o tema
function atualizarImagens(tema) {
  if (tema === "light") {
    logoImg.src = "img/icon-logo-dark.png";
    iconGithub.src = "img/github-dark.png";
  } else {
    logoImg.src = "img/icon-logo.png";
    iconGithub.src = "img/github.png";
  }
}

// Aplica o tema salvo ao carregar a página
const temaSalvo = localStorage.getItem("tema");
if (temaSalvo === "light") {
  body.classList.add("light-mode");
  iconeTema.classList.replace("fa-moon", "fa-sun");
}
atualizarImagens(temaSalvo === "light" ? "light" : "dark");

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");

  if (body.classList.contains("light-mode")) {
    iconeTema.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("tema", "light");
    atualizarImagens("light");
  } else {
    iconeTema.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("tema", "dark");
    atualizarImagens("dark");
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
    const htmlOriginal = btnCopiarEmail.innerHTML;
    btnCopiarEmail.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';

    setTimeout(() => {
      btnCopiarEmail.innerHTML = htmlOriginal;
    }, 2000);
  });
});

// Filtro de projetos
const filtroBotoes = document.querySelectorAll(".filtro-btn");
const projetoCards = document.querySelectorAll(".projeto-card");

filtroBotoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    // Marca o botão clicado como ativo e remove dos demais
    filtroBotoes.forEach((btn) => btn.classList.remove("active"));
    botao.classList.add("active");

    const filtro = botao.dataset.filtro;

    projetoCards.forEach((card) => {
      const categoria = card.dataset.categoria;

      if (filtro === "todos" || categoria === filtro) {
        card.classList.remove("escondido");
      } else {
        card.classList.add("escondido");
      }
    });
  });
});

// Efeito de digitação no título do hero
const typingText = document.getElementById("typingText");
const texto = "Desenvolvedor Front-End";
let indice = 0;

function digitar() {
  if (indice < texto.length) {
    typingText.textContent += texto.charAt(indice);
    indice++;
    setTimeout(digitar, 100);
  }
}

digitar();

// Validação do formulário de contato
const formContato = document.getElementById("formContato");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoMensagem = document.getElementById("mensagem");
const feedbackForm = document.getElementById("feedbackForm");

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function mostrarErro(campo, elementoErro, mensagem) {
  campo.classList.add("invalido");
  elementoErro.textContent = mensagem;
}

function limparErro(campo, elementoErro) {
  campo.classList.remove("invalido");
  elementoErro.textContent = "";
}

formContato.addEventListener("submit", (event) => {
  event.preventDefault();

  let formValido = true;

  // Valida nome
  if (campoNome.value.trim().length < 3) {
    mostrarErro(
      campoNome,
      document.getElementById("erroNome"),
      "Digite seu nome completo.",
    );
    formValido = false;
  } else {
    limparErro(campoNome, document.getElementById("erroNome"));
  }

  // Valida e-mail
  if (!validarEmail(campoEmail.value.trim())) {
    mostrarErro(
      campoEmail,
      document.getElementById("erroEmail"),
      "Digite um e-mail válido.",
    );
    formValido = false;
  } else {
    limparErro(campoEmail, document.getElementById("erroEmail"));
  }

  // Valida mensagem
  if (campoMensagem.value.trim().length < 10) {
    mostrarErro(
      campoMensagem,
      document.getElementById("erroMensagem"),
      "Escreva uma mensagem com pelo menos 10 caracteres.",
    );
    formValido = false;
  } else {
    limparErro(campoMensagem, document.getElementById("erroMensagem"));
  }

  // Se tudo estiver certo
  if (formValido) {
    feedbackForm.textContent =
      "Mensagem enviada com sucesso! Em breve entro em contato.";
    formContato.reset();

    setTimeout(() => {
      feedbackForm.textContent = "";
    }, 5000);
  }
});
