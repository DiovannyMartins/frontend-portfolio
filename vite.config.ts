import { cp, mkdir } from "node:fs/promises";
import { defineConfig } from "vite";

// Base relativa para que os assets funcionem também em subpastas.
export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "injetar-script-anti-fouc",
      transformIndexHtml: {
        order: "post",
        handler(html) {
          return html.replace(
            "<!-- ANTI_FOUC_SCRIPT -->",
            '<script src="./js/tema-inicial.js"></script>',
          );
        },
      },
    },
    {
      name: "copiar-arquivos-estaticos",
      // Imagens referenciadas por string no TS (tema.ts, copiarEmail.ts) não
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
          "icon-check-preto.png",
          "icon-check-branco.png",
          "icon-envelope-preto.png",
          "icon-envelope-branco.png",
        ];
        await mkdir("dist/img", { recursive: true });
        await Promise.all(assetsDinamicos.map((asset) => cp(`img/${asset}`, `dist/img/${asset}`)));
      },
    },
  ],
  server: {
    // Durante o desenvolvimento, encaminha chamadas à API para o backend Hono.
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  build: {
    target: "es2020",
    outDir: "dist",
  },
});
