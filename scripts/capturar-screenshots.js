// Captura screenshots dos projetos (GitHub Pages) e gera as thumbnails WebP
// usadas na seção de projetos, nas versões full (1280px) e reduzida (768px).
// Uso: npm run screenshots
// Requer o navegador do Playwright instalado uma única vez:
//   npx playwright install chromium
//
// Para reduzir falsos positivos de layout, cada captura:
// - espera as fontes carregarem (document.fonts.ready) e um settle extra;
// - desliga animações/transições (prefers-reduced-motion + injeção de CSS);
// - fixa o tema claro (colorScheme: light), mantendo as prévias consistentes;
// - FALHA (exit 1) se a página exibir sinal de erro (404 / page not found) ou
//   se a imagem sair em branco/única cor — em vez de gravar uma thumbnail ruim.
// Ao final, gera screenshots-preview.html para revisão visual antes do commit.
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, "..");
const IMG_DIR = path.join(RAIZ, "img");
const RELATORIO = path.join(RAIZ, "screenshots-preview.html");

const PROJETOS = [
  { slug: "project-dashboard", url: "https://diovannymartins.github.io/business-dashboard/" },
  { slug: "project-saas", url: "https://diovannymartins.github.io/saas-landing-page/" },
  { slug: "project-ecommerce", url: "https://diovannymartins.github.io/modern-ecommerce/" },
  { slug: "project-admin", url: "https://diovannymartins.github.io/admin-dashboard/" },
];

const LARGURA = 1280;
const ALTURA = 800;
const QUALIDADE = 80;
const SETTLE_MS = 400;
// Desvio padrão médio dos canais RGB; abaixo disso = tela em branco/única cor.
const DESVIO_PADRAO_MINIMO = 10;

// Sinais de página de erro (ex.: GitHub Pages sem site publicado).
const PADROES_ERRO = /(404|page not found|there isn't a github pages site here)/i;

const CSS_SEM_ANIMACAO =
  "*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}";

async function paginaEhErro(pagina) {
  const texto = await pagina.evaluate(() => document.body?.innerText.slice(0, 2000) ?? "");
  return PADROES_ERRO.test(texto);
}

async function imagemEhBranca(png) {
  const { channels } = await sharp(png).stats();
  const canais = channels.slice(0, 3);
  const stdevMedio = canais.reduce((soma, canal) => soma + canal.stdev, 0) / canais.length;
  return stdevMedio < DESVIO_PADRAO_MINIMO;
}

async function main() {
  const navegador = await chromium.launch();
  const resultados = [];

  try {
    for (const { slug, url } of PROJETOS) {
      const pagina = await navegador.newPage({ viewport: { width: LARGURA, height: ALTURA } });
      try {
        await pagina.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
        await pagina.goto(url, { waitUntil: "networkidle", timeout: 30000 });

        await pagina.addStyleTag({ content: CSS_SEM_ANIMACAO });
        await pagina.evaluate(() => document.fonts.ready);
        await pagina.waitForTimeout(SETTLE_MS);

        if (await paginaEhErro(pagina)) {
          throw new Error("página exibe erro (404 / page not found)");
        }

        const png = await pagina.screenshot({ type: "png" });

        if (await imagemEhBranca(png)) {
          throw new Error("captura sem conteúdo (imagem em branco/única cor)");
        }

        await sharp(png)
          .webp({ quality: QUALIDADE })
          .toFile(path.join(IMG_DIR, `${slug}.webp`));
        await sharp(png)
          .resize({ width: 768 })
          .webp({ quality: QUALIDADE })
          .toFile(path.join(IMG_DIR, `${slug}-768.webp`));

        resultados.push({ slug, url, ok: true });
        console.log(`✓ ${slug} <- ${url}`);
      } catch (erro) {
        resultados.push({ slug, url, ok: false, erro: erro.message });
        console.error(`✗ ${slug}: ${erro.message}`);
      } finally {
        await pagina.close();
      }
    }
  } finally {
    await navegador.close();
  }

  await escreverRelatorio(resultados);

  const falhas = resultados.filter((r) => !r.ok);
  if (falhas.length) {
    console.error(`\n${falhas.length} projeto(s) falharam:`);
    falhas.forEach((f) => console.error(`  - ${f.slug}: ${f.erro}`));
    process.exitCode = 1;
  } else {
    console.log(
      `\n${resultados.length} thumbnails atualizadas em img/ (revise em screenshots-preview.html)`,
    );
  }
}

async function escreverRelatorio(resultados) {
  const itens = resultados
    .map((r) => {
      if (!r.ok) {
        return `<div class="item item--falha"><h3>${r.slug}</h3><p class="erro">${r.erro}</p></div>`;
      }
      return `<div class="item"><h3>${r.slug}</h3><img src="./img/${r.slug}.webp" alt="Thumbnail ${r.slug}"><p class="url">${r.url}</p></div>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Screenshots - revisão</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 2rem; background: #f5f5f5; color: #1e1e1e; }
      h1 { font-size: 1.25rem; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
      .item { background: #fff; border-radius: 8px; padding: 1rem; box-shadow: 0 1px 4px rgba(0,0,0,.12); }
      .item img { width: 100%; height: auto; border-radius: 4px; }
      .item .url { color: #555; font-size: .8rem; word-break: break-all; }
      .item .erro { color: #b00020; }
      .item--falha { border: 1px solid #b00020; }
    </style>
  </head>
  <body>
    <h1>Prévia das thumbnails</h1>
    <div class="grid">
${itens}
    </div>
  </body>
</html>
`;

  await writeFile(RELATORIO, html, "utf8");
}

main();
