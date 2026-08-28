// Runtime de i18n: como as páginas são estáticas por idioma (/ é PT, /en/ é EN),
// aqui só se traduzem as strings dinâmicas (feedback, toasts, aria-labels) e se
// preserva a âncora atual ao trocar de idioma pelo switcher.
import { idiomaPorPrefixo, traducoes } from "../shared/i18n.ts";
import type { ChaveTraducao, Idioma } from "../shared/i18n.ts";

export function idiomaAtual(): Idioma {
  return idiomaPorPrefixo(document.documentElement.lang);
}

export function traduzir(chave: ChaveTraducao): string {
  return traducoes[idiomaAtual()][chave];
}

// Persiste a escolha do usuário e garante que o switcher aponte para a outra
// língua preservando a âncora atual (ex.: /en/#sobre).
export function initIdioma() {
  const switcher = document.querySelector<HTMLAnchorElement>("[data-lang-switch]");
  if (!switcher) return;

  // getAttribute devolve o caminho literal ("/en/" na página PT, "/" na EN);
  // href resolveria para URL absoluta, que não deve ir para o localStorage.
  const destino = switcher.getAttribute("href") ?? "/";
  switcher.href = `${destino}${location.hash}`;
  switcher.addEventListener("click", () => {
    try {
      localStorage.setItem("idioma", destino);
    } catch {
      // Sem storage, o idioma continua funcionando por URL.
    }
  });
}
