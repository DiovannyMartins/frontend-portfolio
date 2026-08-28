import { initMenuMobile } from "./modules/menu.ts";
import { initTema } from "./modules/tema.ts";
import { initScroll } from "./modules/scroll.ts";
import { initTypingEffect } from "./modules/typingEffect.ts";
import { initFiltroProjetos } from "./modules/filtroProjetos.ts";
import { initCopiarEmail } from "./modules/copiarEmail.ts";
import { initFormulario } from "./modules/formulario.ts";
import { initLivingEditor } from "./modules/livingEditor.ts";
import { initIdioma } from "./i18n.ts";

initIdioma();
initMenuMobile();
initTema();
initScroll();
initTypingEffect();
initFiltroProjetos();
initCopiarEmail();
initFormulario();
initLivingEditor();

const anoAtual = document.getElementById("anoAtual");
if (anoAtual) {
  anoAtual.textContent = String(new Date().getFullYear());
}
