// Anti-FOUC: aplica o tema salvo antes da página renderizar, evitando o
// "flash" do tema errado. Roda no <head> como script clássico síncrono.
let temaSalvo;
try {
  temaSalvo = localStorage.getItem("tema");
} catch {
  temaSalvo = null;
}

const prefereClaro = window.matchMedia?.("(prefers-color-scheme: light)").matches;

if (temaSalvo === "light" || (temaSalvo !== "dark" && prefereClaro)) {
  document.documentElement.classList.add("light-mode");
  document.querySelector('meta[name="theme-color"]').content = "#f5f5f5";
}
