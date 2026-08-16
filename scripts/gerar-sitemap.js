// Regenera o sitemap.xml a partir da lista de rotas.
// Uso: npm run sitemap
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, "..");
// O sitemap fica em public/ para ser copiado para o build pelo Vite.
const DESTINO = path.join(RAIZ, "public", "sitemap.xml");

// Edite conforme o domínio/página do portfólio.
const URL_BASE = "https://diovannymartins.github.io/frontend-portfolio";
const ROTAS = [""];

const hoje = new Date().toISOString().split("T")[0];

const urls = ROTAS.map((rota) => {
  const loc = `${URL_BASE.replace(/\/$/, "")}/${rota.replace(/^\//, "")}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${hoje}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`;
}).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await writeFile(DESTINO, sitemap, "utf8");
console.log("sitemap.xml atualizado com sucesso.");