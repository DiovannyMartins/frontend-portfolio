import { cp, mkdir } from "node:fs/promises";
import { defineConfig } from "vite";

// base relativa: o build funciona tanto na raiz quanto em subpastas
// sem nenhum ajuste.
export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "copiar-arquivos-estaticos",
      // Imagens referenciadas por string no JS (tema.js, copiarEmail.js) não
      // passam pelo processamento do Vite, então precisam existir verbatim em
      // dist/ para o build funcionar. O script anti-FOUC já vive em public/.
      closeBundle: async () => {
        const assetsDinamicos = [
          "icon-logo-dark.png",
          "icon-logo.png",
          "github-dark.png",
          "github.png",
          "icon-sol.png",
          "icon-lua.png",
          "icon-seta-preto.png",
          "icon-seta-branco.png",
          "icon-envelope-preto.png",
          "icon-envelope-branco.png",
        ];
        await mkdir("dist/img", { recursive: true });
        await Promise.all(assetsDinamicos.map((asset) => cp(`img/${asset}`, `dist/img/${asset}`)));
      },
    },
  ],
  server: {
    // Durante o desenvolvimento, encaminha chamadas à API para o backend
    // Hono (npm run dev:server), mantendo o frontend no Vite e o backend separado.
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  build: {
    target: "es2020",
    outDir: "dist",
  },
});
