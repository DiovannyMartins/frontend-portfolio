/*
 * MÓDULO: Filtro de busca nos projetos
 * ---------------------------------------
 * Permite buscar projetos por título ou descrição em tempo real.
 */

export function initBuscaProjetos() {
  const buscaInput = document.getElementById("buscaProjetos");
  const projetos = document.querySelectorAll(".project-card");

  if (!buscaInput || projetos.length === 0) return;

  buscaInput.addEventListener("input", () => {
    const termo = buscaInput.value.toLowerCase().trim();

    projetos.forEach((projeto) => {
      const titulo = projeto.querySelector(".project-card__title").textContent.toLowerCase();
      const descricao = projeto.querySelector(".project-card__text").textContent.toLowerCase();

      if (titulo.includes(termo) || descricao.includes(termo)) {
        projeto.style.display = "";
      } else {
        projeto.style.display = "none";
      }
    });
  });
}