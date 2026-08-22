// Captura screenshots dos projetos (GitHub Pages) e gera as thumbnails WebP
// usadas na seção de projetos, nas versões full (1280px) e reduzida (768px).
// Uso: npm run screenshots
// Requer o navegador do Playwright instalado uma única vez:
//   npx playwright install chromium
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, "..");
const IMG_DIR = path.join(RAIZ, "img");

const PROJETOS = [
  { slug: "project-dashboard", url: "https://diovannymartins.github.io/business-dashboard/" },
  { slug: "project-saas", url: "https://diovannymartins.github.io/saas-landing-page/" },
  { slug: "project-ecommerce", url: "https://diovannymartins.github.io/modern-ecommerce/" },
  { slug: "project-admin", url: "https://diovannymartins.github.io/admin-dashboard/" },
];

const LARGURA = 1280;
const ALTURA = 800;
const QUALIDADE = 80;

async function main() {
  const navegador = await chromium.launch();
  try {
    const pagina = await navegador.newPage({ viewport: { width: LARGURA, height: ALTURA } });

    let sucesso = 0;
    const falhas = [];

    for (const { slug, url } of PROJETOS) {
      try {
        await pagina.goto(url, { waitUntil: "networkidle", timeout: 30000 });

        const png = await pagina.screenshot({ type: "png" });

        await sharp(png)
          .webp({ quality: QUALIDADE })
          .toFile(path.join(IMG_DIR, `${slug}.webp`));
        await sharp(png)
          .resize({ width: 768 })
          .webp({ quality: QUALIDADE })
          .toFile(path.join(IMG_DIR, `${slug}-768.webp`));

        console.log(`✓ ${slug} <- ${url}`);
        sucesso++;
      } catch (erro) {
        falhas.push(`${slug}: ${erro.message}`);
        console.error(`✗ ${slug} falhou`);
      }
    }

    if (falhas.length) {
      console.error(`\n${falhas.length} projeto(s) falharam:`);
      falhas.forEach((f) => console.error(`  - ${f}`));
      process.exitCode = 1;
    } else {
      console.log(`\n${sucesso} thumbnails atualizadas em img/`);
    }
  } finally {
    await navegador.close();
  }
}

main();
