export function initScroll() {
  initScrollReveal();
  initScrollSpy();
  initVoltarTopo();
}

function initScrollReveal() {
  const elementos = document.querySelectorAll(".reveal");

  if (elementos.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("reveal--visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    // Dispara quando 15% do elemento está visível — evita que seções grandes
    // fora da tela já sejam marcadas como "visíveis" antes da hora.
    { threshold: 0.15 },
  );

  elementos.forEach((el) => observer.observe(el));
}

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  if (sections.length === 0 || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute("id");

        navLinks.forEach((link) => {
          link.classList.remove("nav__link--active");
          link.removeAttribute("aria-current");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("nav__link--active");
            link.setAttribute("aria-current", "location");
          }
        });
      });
    },
    // Margens negativas de 50% encolhem a área de observação para uma linha
    // horizontal no centro da tela. A seção só é considerada "ativa" quando
    // o ponto médio dela cruza o meio do viewport, evitando ambiguidade entre
    // seções adjacentes (ex: topo de #projetos ainda visível enquanto #contato já entrou).
    { rootMargin: "-50% 0px -50% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

function initVoltarTopo() {
  const btnTopo = document.getElementById("btnTopo");
  if (!btnTopo) return;

  function atualizarVisibilidade() {
    const deveMostrar = window.scrollY > 400;
    btnTopo.classList.toggle("back-to-top--visible", deveMostrar);
  }

  window.addEventListener("scroll", atualizarVisibilidade, { passive: true });
  atualizarVisibilidade();

  btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
