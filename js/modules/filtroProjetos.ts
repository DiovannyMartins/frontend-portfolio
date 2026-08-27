export function initFiltroProjetos() {
  const botoes = document.querySelectorAll<HTMLButtonElement>(".projects__filter-btn");
  const campoBusca = document.querySelector<HTMLInputElement>("#buscaProjetos");
  const cards = document.querySelectorAll<HTMLElement>(".project-card");
  const mensagemVazio = document.getElementById("projetosVazio");

  if (botoes.length === 0 || cards.length === 0) return;

  // "todos" é um valor sentinela — não corresponde a nenhum data-categoria real,
  // apenas sinaliza que nenhum filtro de categoria está ativo.
  let filtroAtivo: string | undefined = "todos";
  let termoBusca = "";

  function aplicarFiltros() {
    let totalVisiveis = 0;

    cards.forEach((card) => {
      const correspondeCategoria =
        filtroAtivo === "todos" || card.dataset.categoria === filtroAtivo;

      const tituloElement = card.querySelector(".project-card__title");
      const descricaoElement = card.querySelector(".project-card__text");
      const titulo = tituloElement ? (tituloElement.textContent?.toLowerCase() ?? "") : "";
      const descricao = descricaoElement ? (descricaoElement.textContent?.toLowerCase() ?? "") : "";
      const correspondeBusca = titulo.includes(termoBusca) || descricao.includes(termoBusca);

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
