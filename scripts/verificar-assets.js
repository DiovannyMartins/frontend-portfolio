// Verifica se todas as referências locais (img, link, script e @import)
// apontam para arquivos que realmente existem e lista imagens órfãs.
// Uso: npm run check
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, "..");

const ARQUIVO_INICIAL = "index.html";
const PASTA_JS = path.join(RAIZ, "js");
const PASTA_CSS = path.join(RAIZ, "css");
const PASTA_IMG = path.join(RAIZ, "img");

async function listarArquivos(dir) {
  const entradas = await readdir(dir, { withFileTypes: true });
  const arquivos = [];
  for (const entrada of entradas) {
    const caminho = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      arquivos.push(...(await listarArquivos(caminho)));
    } else {
      arquivos.push(caminho);
    }
  }
  return arquivos;
}

async function arquivosExistentes() {
  const arquivos = [path.join(RAIZ, ARQUIVO_INICIAL)];
  arquivos.push(...(await listarArquivos(PASTA_JS)));
  arquivos.push(...(await listarArquivos(PASTA_CSS)));
  return arquivos;
}

function extrairReferencias(conteudo, formato) {
  const refs = [];

  const regras =
    formato === "html"
      ? [[/(?:src|href)\s*=\s*"([^"]+)"/g, "arquivo"]]
      : formato === "css"
        ? [
            [/@import\s+(?:url\(\s*)?["']?([^"')]+)["']?\s*\)?/g, "arquivo"],
            [/url\(["']?([^"')]+)["']?\)/g, "arquivo"],
          ]
        : [
            [/from\s+["']([^"']+)["']/g, "arquivo"],
            [/import\s+["']([^"']+)["']/g, "arquivo"],
            // Referências dinâmicas em strings (ex.: tema.js alterna img/icon-lua.png)
            // resolvem em relação à raiz do projeto, como o navegador faz.
            [/["'`]((?:img|css|js)\/[^"'`]+)["'`]/g, "raiz"],
          ];

  for (const [padrao, base] of regras) {
    let match;
    while ((match = padrao.exec(conteudo)) !== null) {
      const url = match[1].trim();
      if (
        url.startsWith("#") ||
        url.startsWith("data:") ||
        url.startsWith("mailto:") ||
        /^[a-z]+:\/\//i.test(url)
      ) {
        continue;
      }
      refs.push({ url, base });
    }
  }
  return refs;
}

function limparUrl(url) {
  return url.split("?")[0].split("#")[0];
}

async function main() {
  const erros = [];
  const referencias = new Set();
  const arquivos = await arquivosExistentes();

  for (const arquivo of arquivos) {
    const conteudo = await readFile(arquivo, "utf8");
    const formato = arquivo.endsWith(".html") ? "html" : arquivo.endsWith(".css") ? "css" : "js";
    const dir = path.dirname(arquivo);

    for (const { url, base } of extrairReferencias(conteudo, formato)) {
      const caminho = limparUrl(url);

      const baseAbs = base === "raiz" ? RAIZ : dir;
      const alvo = path.resolve(baseAbs, caminho);
      referencias.add(path.relative(RAIZ, alvo).replace(/\\/g, "/"));
      try {
        const info = await stat(alvo);
        if (!info.isFile())
          erros.push(`Não é um arquivo: ${url} (em ${path.relative(RAIZ, arquivo)})`);
      } catch {
        erros.push(`Arquivo não encontrado: ${url} (em ${path.relative(RAIZ, arquivo)})`);
      }
    }
  }

  // Imagens órfãs: existem na pasta img/ mas não são referenciadas.
  const orfas = [];
  const imagens = await listarArquivos(PASTA_IMG);
  for (const img of imagens) {
    const relativo = path.relative(RAIZ, img).replace(/\\/g, "/");
    if (!referencias.has(relativo)) orfas.push(relativo);
  }

  if (erros.length) {
    console.error("Problemas encontrados:");
    erros.forEach((e) => console.error(`  ✗ ${e}`));
    process.exitCode = 1;
  } else {
    console.log("Todas as referências locais estão válidas.");
  }

  if (orfas.length) {
    console.log(`\nImagens órfãs (não referenciadas no código):\n  - ${orfas.join("\n  - ")}`);
  }
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
