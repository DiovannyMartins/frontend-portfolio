// Regenera o sitemap.xml a partir da lista de rotas.
// Uso: npm run sitemap
import { execFile } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, "..");
// O sitemap fica em public/ para ser copiado para o build pelo Vite.
const DESTINO = path.join(RAIZ, "public", "sitemap.xml");

// Edite conforme o domínio/página do portfólio.
const URL_BASE = "https://diovanny.dev";

// Declarações de alternates por idioma, idênticas nas duas páginas.
const ALTERNATES = [
  { hreflang: "pt-BR", href: `${URL_BASE}/` },
  { hreflang: "en", href: `${URL_BASE}/en/` },
  { hreflang: "x-default", href: `${URL_BASE}/` },
];

// Páginas por idioma: "/" é PT, "/en/" é EN. Cada uma declara as alternates.
const PAGINAS = [`${URL_BASE}/`, `${URL_BASE}/en/`];

// Fallback (fonte controlada por versão) quando o git não está disponível.
// Ajuste manualmente quando o conteúdo da página mudar de fato.
const ULTIMA_MODIFICACAO_FALLBACK = "2026-08-16";

const execFileAsync = promisify(execFile);

// lastmod = data do último commit que alterou o index.html (data do committer,
// %cI — a data do autor pode ser anterior e não refletir quando a mudança foi
// registrada no repositório). Usar o mtime do filesystem é frágil: um checkout
// novo ou um CI pode reatribuir mtime sem mudança de conteúdo, alterando o
// lastmod em builds não relacionados.
async function obterUltimaModificacao() {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["log", "-1", "--format=%cI", "--", "index.html"],
      { cwd: RAIZ },
    );
    const data = stdout.trim();
    if (data) return new Date(data).toISOString().split("T")[0];
  } catch {
    // git indisponível (ex.: fora de um repositório): usa o fallback.
  }
  return ULTIMA_MODIFICACAO_FALLBACK;
}

const ultimaModificacao = await obterUltimaModificacao();

const urls = PAGINAS.map((loc) => {
  const links = ALTERNATES.map(
    (a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`,
  ).join("\n");
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${ultimaModificacao}</lastmod>
${links}
  </url>`;
}).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

await writeFile(DESTINO, sitemap, "utf8");
console.log("sitemap.xml atualizado com sucesso.");
