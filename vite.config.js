import { cp } from "node:fs/promises";
import { defineConfig } from "vite";

// base relativa: o build funciona tanto na raiz quanto em subpastas
// (ex.: GitHub Pages em /frontend-portfolio/) sem nenhum ajuste.
export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "copiar-imagens",
      // As imagens referenciadas por string no JS (tema.js, copiarEmail.js)
      // não passam pelo processamento do Vite, então precisam existir
      // verbatim em dist/img/ para o build funcionar.
      closeBundle: async () => {
        await cp("img", "dist/img", { recursive: true });
      },
    },
  ],
  server: {
    // Durante o desenvolvimento, encaminha chamadas à API para o backend
    // Express, mantendo o frontend no Vite e o backend separado.
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  build: {
    target: "es2020",
    outDir: "dist",
  },
});