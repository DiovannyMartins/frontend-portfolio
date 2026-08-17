// Converte PNGs/JPGs grandes da pasta img/ para WebP (formato usado pelo site).
// Ícones pequenos ficam em PNG propositalmente: WebP ganha pouco nesse tamanho
// e geraria arquivos duplicados não referenciados (o `npm run check` apontaria).
// Não regrava arquivos que já têm WebP mais novo que o original.
// Uso: npm run imagens
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.resolve(__dirname, "../img");
const FORMATOS_FONTE = [".png", ".jpg", ".jpeg"];
const QUALIDADE = 80;
const TAMANHO_MINIMO_BYTES = 10 * 1024; // ignora ícones (< 10 KB)

const arquivos = await readdir(IMG_DIR);
let convertidos = 0;
let ignorados = 0;

for (const arquivo of arquivos) {
  const ext = path.extname(arquivo).toLowerCase();
  if (!FORMATOS_FONTE.includes(ext)) continue;

  const origem = path.join(IMG_DIR, arquivo);
  const destino = path.join(IMG_DIR, path.basename(arquivo, ext) + ".webp");

  const infoOrigem = await stat(origem);

  // Mantém o WebP existente se ele for mais novo que o original.
  const infoDestino = await stat(destino).catch(() => null);
  if (infoDestino && infoDestino.mtimeMs >= infoOrigem.mtimeMs) continue;

  if (infoOrigem.size < TAMANHO_MINIMO_BYTES) {
    ignorados++;
    continue;
  }

  await sharp(origem).webp({ quality: QUALIDADE }).toFile(destino);

  const tamanhoDestino = (await stat(destino)).size;
  const economia = (infoOrigem.size - tamanhoDestino) / 1024;
  console.log(`${arquivo} -> ${path.basename(destino)} (${economia.toFixed(1)} KB economizados)`);
  convertidos++;
}

if (convertidos === 0) {
  console.log("Nenhuma imagem grande para converter (ícones < 10 KB são mantidos em PNG).");
} else {
  console.log(
    `\nConvertidas ${convertidos} imagem(ns). Atualize as referências .png -> .webp no HTML/JS.`,
  );
}
console.log(`Ícones ignorados: ${ignorados}`);
