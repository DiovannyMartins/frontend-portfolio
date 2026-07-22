/*
 * MÓDULO: Botão voltar ao topo
 * ---------------------------------
 */

export function initVoltarTopo() {
  const btnTopo = document.getElementById("btnTopo");
  if (!btnTopo) return;

  const SCROLL_MINIMO_PARA_MOSTRAR = 400;

  // passive: true informa que o listener não chama preventDefault (melhora a performance do scroll)
  window.addEventListener(
    "scroll",
    () => {
      const deveMostrar = window.scrollY > SCROLL_MINIMO_PARA_MOSTRAR;
      btnTopo.classList.toggle("back-to-top--visible", deveMostrar);
    },
    { passive: true },
  );

  btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
