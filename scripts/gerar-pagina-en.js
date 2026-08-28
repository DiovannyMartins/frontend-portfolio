// Gera a versão em inglês (dist/en/index.html) a partir do build (dist/index.html).
// Roda ao final do `npm run build` via tsx (para importar o dicionário TS).
//
// O que o script faz:
// - traduz os elementos com data-i18n / data-i18n-placeholder / data-i18n-aria / data-i18n-alt
// - troca lang, title, meta description/OG/Twitter, canonical, og:url e og:locale
// - ajusta o switcher de idioma para apontar para a página PT
// - prefixa "../" nos assets relativos (a página vive em /en/, um nível abaixo)
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { traducoes } from "../shared/i18n.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, "..");
const ORIGEM = path.join(RAIZ, "dist", "index.html");
const DESTINO = path.join(RAIZ, "dist", "en", "index.html");

const en = traducoes.en;
const URL_PT = "https://diovanny.dev/";
const URL_EN = "https://diovanny.dev/en/";

// Troca o nó de texto de elementos com data-i18n (todos são de texto simples,
// sem filhos de marcação). Mantém o marcador — é metadata de build, sem efeito.
function traduzirTextos(html) {
  return html.replace(
    /(<[^>]*\bdata-i18n=")([^"]+)("[^>]*>)([\s\S]*?)(<\/[^>]*>)/g,
    (match, abertura, chave, resto, conteudo, fechamento) => {
      const valor = en[chave];
      if (valor === undefined) return match;
      return `${abertura}${chave}${resto}${valor}${fechamento}`;
    },
  );
}

// Traduz um atributo real (placeholder, aria-label, alt) a partir do marcador
// data-i18n-<marcador>, removendo o marcador e atualizando o atributo.
function traduzirAtributo(html, marcador, real) {
  const reTag = new RegExp(`<[^>]*\\bdata-i18n-${marcador}="[^"]+"[^>]*>`, "g");
  return html.replace(reTag, (tag) => {
    const chave = tag.match(new RegExp(`data-i18n-${marcador}="([^"]+)"`))?.[1];
    const valor = chave ? en[chave] : undefined;
    if (valor === undefined) return tag;

    const semMarcador = tag.replace(new RegExp(`data-i18n-${marcador}="[^"]+"`), "");
    const reReal = new RegExp(`(\\b${real}=")[^"]*(")`);
    if (reReal.test(semMarcador)) {
      return semMarcador.replace(reReal, `$1${valor}$2`);
    }
    return semMarcador.replace(/>$/, ` ${real}="${valor}">`);
  });
}

// Traduz head: lang, title, meta de SEO/OG/Twitter e canonical/og:url.
function traduzirHead(html) {
  let resultado = html
    .replace(/<html lang="pt-BR">/, '<html lang="en">')
    .replace(/<title>([^<]*)<\/title>/, `<title>${en.titulo}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"/,
      `<meta name="description" content="${en.descricao}"`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"/,
      `<meta property="og:title" content="${en.titulo}"`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"/,
      `<meta property="og:description" content="${en.ogDescricao}"`,
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"/,
      `<meta name="twitter:title" content="${en.titulo}"`,
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"/,
      `<meta name="twitter:description" content="${en.ogDescricao}"`,
    )
    .replace(
      /<meta\s+property="og:locale"\s+content="pt_BR"/,
      `<meta property="og:locale" content="${en.ogLocale}"`,
    )
    .replace(`<link rel="canonical" href="${URL_PT}"`, `<link rel="canonical" href="${URL_EN}"`)
    .replace(
      `<meta property="og:url" content="${URL_PT}"`,
      `<meta property="og:url" content="${URL_EN}"`,
    );
  return resultado;
}

// Na página EN o switcher aponta para a versão PT (/), com rótulo "PT".
// Reconstruído por inteiro: mexer em atributos isolados com regex colide
// (ex.: `lang=` casa dentro de `hreflang=`).
function traduzirSwitcher(html) {
  return html.replace(
    /<a[^>]*\bdata-lang-switch[^>]*>[^<]*<\/a>/,
    () =>
      '<a class="lang-switch nav__link btn" href="/" hreflang="pt-BR" lang="pt" data-lang-switch>PT</a>',
  );
}

// A página /en/ vive um nível abaixo da raiz: prefixa "../" nos assets
// relativos (./assets, ./img, ./js). URLs absolutas e âncoras ficam intactas.
function ajustarAssets(html) {
  const ehRelativo = (valor) =>
    !/^(https?:|data:|mailto:|\/|#)/.test(valor) && !valor.startsWith("..");

  let resultado = html.replace(/(src|href)="([^"]+)"/g, (match, atributo, valor) =>
    ehRelativo(valor) ? `${atributo}="../${valor.replace(/^\.\//, "")}"` : match,
  );

  resultado = resultado.replace(/srcset="([^"]+)"/g, (match, valor) => {
    const novo = valor
      .split(",")
      .map((parte) => {
        const p = parte.trim();
        return ehRelativo(p) ? `../${p.replace(/^\.\//, "")}` : p;
      })
      .join(", ");
    return `srcset="${novo}"`;
  });

  return resultado;
}

const html = await readFile(ORIGEM, "utf8");

let resultado = traduzirTextos(html);
resultado = traduzirAtributo(resultado, "placeholder", "placeholder");
resultado = traduzirAtributo(resultado, "aria", "aria-label");
resultado = traduzirAtributo(resultado, "alt", "alt");
resultado = traduzirHead(resultado);
resultado = traduzirSwitcher(resultado);
resultado = ajustarAssets(resultado);

await mkdir(path.dirname(DESTINO), { recursive: true });
await writeFile(DESTINO, resultado, "utf8");
console.log("dist/en/index.html gerado com sucesso.");
