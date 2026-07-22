/*
 * MÓDULO: Filtro e busca de projetos
 * ---------------------------------------
 * Centraliza a visibilidade dos cards: categoria ativa + termo de busca
 * são avaliados juntos pela mesma função, evitando que um filtro
 * sobrescreva o estado do outro. Também exibe a mensagem de
 * "nenhum projeto encontrado" quando a combinação não retorna resultados.
 */

export function initFiltroProjetos() {
  const botoes = document.querySelectorAll(".projects__filter-btn");
  const campoBusca = document.getElementById("buscaProjetos");
  const cards = document.querySelectorAll(".project-card");
  const mensagemVazio = document.getElementById("projetosVazio");

  if (botoes.length === 0 || cards.length === 0) return;

  let filtroAtivo = "todos";
  let termoBusca = "";

  function aplicarFiltros() {
    let totalVisiveis = 0;

    cards.forEach((card) => {
      const correspondeCategoria =
        filtroAtivo === "todos" || card.dataset.categoria === filtroAtivo;

      const titulo = card
        .querySelector(".project-card__title")
        .textContent.toLowerCase();
      const descricao = card
        .querySelector(".project-card__text")
        .textContent.toLowerCase();
      const correspondeBusca =
        titulo.includes(termoBusca) || descricao.includes(termoBusca);

      const visivel = correspondeCategoria && correspondeBusca;
      card.classList.toggle("project-card--hidden", !visivel);

      if (visivel) totalVisiveis++;
    });

    if (mensagemVazio) {
      mensagemVazio.hidden = totalVisiveis > 0;
    }
  }

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      botoes.forEach((btn) => {
        btn.classList.remove("projects__filter-btn--active");
        btn.setAttribute("aria-pressed", "false");
      });

      botao.classList.add("projects__filter-btn--active");
      botao.setAttribute("aria-pressed", "true");

      filtroAtivo = botao.dataset.filtro;
      aplicarFiltros();
    });
  });

  if (campoBusca) {
    campoBusca.addEventListener("input", () => {
      termoBusca = campoBusca.value.toLowerCase().trim();
      aplicarFiltros();
    });
  }
}
