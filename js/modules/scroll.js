export function initScroll() {
  initScrollReveal();
  initScrollSpy();
  initVoltarTopo();
}

function initScrollReveal() {
  const elementos = document.querySelectorAll(".reveal");

  if (elementos.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  elementos.forEach((el) => observer.observe(el));
}

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  if (sections.length === 0) return;

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
            link.setAttribute("aria-current", "page");
          }
        });
      });
    },
    { rootMargin: "-50% 0px -50% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

function initVoltarTopo() {
  const btnTopo = document.getElementById("btnTopo");
  if (!btnTopo) return;

  window.addEventListener(
    "scroll",
    () => {
      const deveMostrar = window.scrollY > 400;
      btnTopo.classList.toggle("back-to-top--visible", deveMostrar);
    },
    { passive: true },
  );

  btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
