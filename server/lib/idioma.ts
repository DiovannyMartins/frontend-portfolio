// Resolução do idioma das mensagens do backend a partir do header x-lang
// (ver shared/i18n.ts). Fonte única usada por app.ts e routes/contato.ts.
import type { Context } from "hono";
import { HEADER_IDIOMA, idiomaPorPrefixo, traducoes } from "../../shared/i18n.ts";
import type { Idioma, Mensagens } from "../../shared/i18n.ts";

export function idiomaDoRequest(c: Context): Idioma {
  return idiomaPorPrefixo(c.req.header(HEADER_IDIOMA));
}

export function mensagensDoRequest(c: Context): Mensagens {
  return traducoes[idiomaDoRequest(c)];
}
