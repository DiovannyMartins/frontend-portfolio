/*
 * MÓDULO: Scroll Spy
 * ---------------------
 * Destaca o link do menu correspondente à seção visível na tela,
 * usando IntersectionObserver.
 */

export function initScrollSpy() {
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
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("nav__link--active");
          }
        });
      });
    },
    // Gatilho no meio vertical da tela — dá a sensação mais natural de "seção atual"
    { rootMargin: "-50% 0px -50% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}
