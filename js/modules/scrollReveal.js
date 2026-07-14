/*
 * MÓDULO: Scroll Reveal
 * -------------------------
 * Aplica fade-in nos elementos marcados com .reveal conforme entram na viewport.
 */

export function initScrollReveal() {
  const elementos = document.querySelectorAll(".reveal");

  if (elementos.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
        }
      });
    },
    { threshold: 0.15 },
  );

  elementos.forEach((el) => observer.observe(el));
}
