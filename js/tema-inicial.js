// Anti-FOUC: aplica o tema salvo antes da página renderizar, evitando o
// "flash" do tema errado. Roda no <head> como script clássico síncrono —
// não use async/defer, senão o flash volta a aparecer.
if (localStorage.getItem("tema") === "light") {
  document.documentElement.classList.add("light-mode");
  document.querySelector('meta[name="theme-color"]').content = "#f5f5f5";
}
