import { initMenuMobile } from "./modules/menu.js";
import { initTema } from "./modules/tema.js";
import { initScroll } from "./modules/scroll.js";
import { initTypingEffect } from "./modules/typingEffect.js";
import { initFiltroProjetos } from "./modules/filtroProjetos.js";
import { initCopiarEmail } from "./modules/copiarEmail.js";
import { initFormulario } from "./modules/formulario.js";

initMenuMobile();
initTema();
initScroll();
initTypingEffect();
initFiltroProjetos();
initCopiarEmail();
initFormulario();

document.getElementById("anoAtual").textContent = new Date().getFullYear();
