import { cp, mkdir } from "node:fs/promises";
import { defineConfig } from "vite";

// base relativa: o build funciona tanto na raiz quanto em subpastas
// sem nenhum ajuste.
export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "copiar-arquivos-estaticos",
      // Imagens referenciadas por string no JS (tema.js, copiarEmail.js) e o
      // script anti-FOUC (js/tema-inicial.js) não passam pelo processamento do
      // Vite, então precisam existir verbatim em dist/ para o build funcionar.
      closeBundle: async () => {
        await cp("img", "dist/img", { recursive: true });
        await mkdir("dist/js", { recursive: true });
        await cp("js/tema-inicial.js", "dist/js/tema-inicial.js");
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
