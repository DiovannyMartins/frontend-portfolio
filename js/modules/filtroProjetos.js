/*
 * MÓDULO: Filtro de projetos
 * -------------------------------
 * Filtra os cards de projeto por categoria, mantendo o estado
 * de acessibilidade (aria-pressed) sincronizado com o botão ativo.
 */

export function initFiltroProjetos() {
  const botoes = document.querySelectorAll(".projects__filter-btn");
  const cards = document.querySelectorAll(".project-card");

  if (botoes.length === 0) return;

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      botoes.forEach((btn) => {
        btn.classList.remove("projects__filter-btn--active");
        btn.setAttribute("aria-pressed", "false");
      });

      botao.classList.add("projects__filter-btn--active");
      botao.setAttribute("aria-pressed", "true");

      const filtro = botao.dataset.filtro;

      cards.forEach((card) => {
        const corresponde =
          filtro === "todos" || card.dataset.categoria === filtro;
        card.classList.toggle("project-card--hidden", !corresponde);
      });
    });
  });
}
