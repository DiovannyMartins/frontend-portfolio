/*
 * MÓDULO: Modo Foco
 * ---------------------
 * Esconde elementos distrativos (header, footer, botão voltar ao topo)
 * para permitir leitura focada do conteúdo.
 */

export function initModoFoco() {
  const btnFoco = document.getElementById("btnModoFoco");
  if (!btnFoco) return;

  const header = document.querySelector(".header");
  const footer = document.querySelector(".footer");
  const btnTopo = document.getElementById("btnTopo");
  const backToTop = document.querySelector(".back-to-top");

  let modoFocoAtivo = false;

  function ativarModoFoco() {
    modoFocoAtivo = true;
    document.body.classList.add("modo-foco");
    btnFoco.setAttribute("aria-pressed", "true");
    btnFoco.textContent = "Sair do Modo Foco";

    if (header) header.style.opacity = "0";
    if (footer) footer.style.opacity = "0";
    if (btnTopo) btnTopo.style.opacity = "0";
    if (backToTop) backToTop.style.opacity = "0";
  }

  function desativarModoFoco() {
    modoFocoAtivo = false;
    document.body.classList.remove("modo-foco");
    btnFoco.setAttribute("aria-pressed", "false");
    btnFoco.textContent = "Modo Foco";

    if (header) header.style.opacity = "1";
    if (footer) footer.style.opacity = "1";
    if (btnTopo) btnTopo.style.opacity = "1";
    if (backToTop) backToTop.style.opacity = "1";
  }

  btnFoco.addEventListener("click", () => {
    if (modoFocoAtivo) {
      desativarModoFoco();
    } else {
      ativarModoFoco();
    }
  });

  // Atalho de teclado: F para ativar/desativar
  document.addEventListener("keydown", (event) => {
    if (event.key === "f" || event.key === "F") {
      // Ignora se estiver em um input
      if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
        return;
      }
      if (modoFocoAtivo) {
        desativarModoFoco();
      } else {
        ativarModoFoco();
      }
    }
  });
}