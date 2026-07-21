/*
 * PONTO DE ENTRADA DO JAVASCRIPT
 * ---------------------------------
 * Cada funcionalidade vive isolada em seu próprio módulo, com seu próprio
 * escopo — isso elimina de vez o risco de variáveis vazando pro escopo
 * global e colidindo entre si.
 *
 * Este arquivo só importa e inicializa cada módulo. Se um módulo não for
 * necessário em outra página no futuro, basta remover a linha correspondente.
 */

import { initMenuMobile } from "./modules/menu.js";
import { initTema } from "./modules/tema.js";
import { initScrollSpy } from "./modules/scrollSpy.js";
import { initScrollReveal } from "./modules/scrollReveal.js";
import { initTypingEffect } from "./modules/typingEffect.js";
import { initFiltroProjetos } from "./modules/filtroProjetos.js";
import { initBuscaProjetos } from "./modules/buscaProjetos.js";
import { initCopiarEmail } from "./modules/copiarEmail.js";
import { initVoltarTopo } from "./modules/voltarTopo.js";
import { initFormulario } from "./modules/formulario.js";
import { initAnoRodape } from "./modules/anoRodape.js";

// Cada init() é independente — se um módulo falhar, os outros continuam funcionando.
initMenuMobile();
initTema();
initScrollSpy();
initScrollReveal();
initTypingEffect();
initFiltroProjetos();
initBuscaProjetos();
initCopiarEmail();
initVoltarTopo();
initFormulario();
initAnoRodape();
