# Frontend Portfolio

Portfólio front-end responsivo desenvolvido com HTML, CSS e JavaScript, empacotado com **Vite**, com backend **Express** para o formulário de contato e scripts de automação em **Node.js**.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-Sim-green?style=for-the-badge)

---

## Destaques

- JavaScript Vanilla (sem frameworks)
- Vite como dev server e build (minificação, hashing de assets)
- Backend Express com validação server-side, rate limit e envio de e-mail (Nodemailer)
- Scripts de automação: sitemap, verificação de assets e otimização de imagens
- Responsivo (layout adapta-se a todas as telas)
- Dark/Light Mode
- Acessível (ARIA)
- SEO otimizado

---

## Tecnologias

| Stack | Detalhe |
|-------|---------|
| HTML5 | Semântica, ARIA, meta tags Open Graph/Twitter Card |
| CSS3 | Variáveis CSS, Grid, Flexbox, animações, `@import` modular |
| JavaScript (ES6+) | ES Modules — frontend sem dependências de runtime |
| Vite | Dev server, build de produção e proxy para a API em desenvolvimento |
| Node.js / Express | API para o formulário de contato (validação, rate limit, e-mail) |
| Nodemailer | Envio de e-mail a partir do formulário |
| Git/GitHub | Versionamento e deploy via GitHub Pages (frontend) |
| Google Fonts | Fjalla One (títulos) e Inter (corpo) |

---

## Sobre o projeto

O projeto foi desenvolvido com foco em simplicidade, desempenho e facilidade de avaliação, usando Vite apenas como ferramenta de desenvolvimento/build — o código continua JavaScript Vanilla, sem framework. As decisões técnicas principais:

- **Vite para desenvolvimento e build**: dev server com HMR, proxy para a API, minificação e hashing de assets no build. O site continua estático e pode ser publicado em qualquer hosting estático.
- **Backend Express opcional**: usado apenas para o formulário de contato. Sem variáveis SMTP, roda em "modo log" (exibe a mensagem no console) — **apenas em desenvolvimento**; em produção o servidor não inicia sem SMTP.
- **CSS modular com `@import`**: base (reset, variáveis, tipografia), componentes (header, hero, about-skills, projetos, contato, botoes, footer, toast) e utilitários (acessibilidade, animações) separados em arquivos independentes. Facilita manutenção e leitura.
- **JavaScript em ES Modules**: cada funcionalidade (tema, menu, scroll, filtro, formulário, copiar e-mail, typing effect) vive em seu próprio módulo. O `main.js` apenas inicializa — sem acoplamento. Imagens alternadas pelo tema usam caminhos em string (`img/...`), o que mantém o site funcional em hospedagem estática crua sem build.
- **Anti-FOUC no tema**: o script de tema roda no `<head>` antes da renderização, evitando o flash do tema errado.
- **Acessibilidade como requisito, não extra**: skip link, ARIA labels, `aria-live` nos erros do formulário, `aria-pressed` nos filtros, focus visible customizado.
- **Performance**: imagens em WebP com lazy loading, `preload` da imagem hero, `preconnect` para fontes, `theme-color` para mobile.

---

## Funcionalidades

- **Dark/Light mode** com persistência via `localStorage` e anti-FOUC
- **Menu mobile** com animação hamburguer/X e fechamento ao clicar fora
- **Scroll spy** que destaca o link do menu conforme a seção visível
- **Filtro de projetos** por categoria (Dashboard, Landing Page, E-commerce)
- **Busca em tempo real** por título ou descrição dos projetos
- **Formulário de contato** com validação visual e feedback em tempo real (bordas verdes/vermelhas)
- **Botão copiar e-mail** com toast notification de confirmação
- **Scroll reveal** nas seções ao rolar a página
- **Botão voltar ao topo** com animação fade
- **Efeito de digitação** no título hero
- **Skip link** para navegação por teclado
- **Imagens otimizadas** em WebP com lazy loading
- **SEO**: `sitemap.xml`, `robots.txt`, Open Graph, Twitter Card

---

## Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org) 20 ou superior.

```bash
# 1. Clone o repositório
git clone https://github.com/DiovannyMartins/frontend-portfolio.git

# 2. Entre na pasta
cd frontend-portfolio

# 3. Instale as dependências
npm install

# 4. Rode o ambiente de desenvolvimento
# Opção A: frontend + backend juntos (Vite em :5173, API em :3001)
npm run dev:all

# Opção B: apenas o frontend (sem API)
npm run dev
```

### Formulário de contato

O formulário envia para `POST /api/contato`, então **precisa do backend rodando**. Antes de enviar, ele checa `GET /api/health`:

- **Com backend** (`npm run dev:all` ou `npm start`): envio normal.
- **Sem backend** (abrir o `index.html` direto, Live Server ou GitHub Pages): o formulário mostra a mensagem "O envio online não está ativo nesta hospedagem" e orienta a usar `npm run dev:all` — não tenta enviar nem gera erro de POST no console.

Para testar o envio localmente, copie `server/.env.example` para `server/.env`:

```powershell
# PowerShell
Copy-Item server/.env.example server/.env

# ou manualmente: crie um arquivo server/.env com o conteúdo de server/.env.example
```

- **Sem SMTP configurado**: o servidor roda em "modo log" — as mensagens aparecem no console do terminal. **Apenas para desenvolvimento local**: em produção o servidor **não inicia** sem SMTP, evitando que e-mails e mensagens dos visitantes vazem para os logs da plataforma.
- **Com SMTP configurado**: preencha `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` e `EMAIL_DESTINO` no `.env` (para Gmail, use uma senha de app). Se o frontend e a API estiverem em origens diferentes, configure também `FRONTEND_ORIGIN` (origens autorizadas, separadas por vírgula).

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o Vite (frontend) com proxy para a API |
| `npm run dev:all` | Inicia frontend e backend juntos |
| `npm run server` | Inicia apenas o backend Express (usado pelo `dev:all`) |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Serve localmente o build gerado |
| `npm start` | Inicia o servidor Express (serve a API; para também servir o `dist/`, defina `NODE_ENV=production`) |
| `npm run sitemap` | Regenera o `sitemap.xml` em `public/` |
| `npm run check` | Verifica se todas as referências a arquivos locais existem e lista imagens órfãs |
| `npm run imagens` | Converte PNGs/JPGs grandes (> 10 KB) de `img/` para WebP |

### Deploy

- **Frontend estático**: `npm run build` e publique a pasta `dist/` (Netlify, Vercel...). Ou publique o repositório direto no GitHub Pages — o site funciona sem build porque as imagens são referenciadas por caminho.
- **Frontend + API**: `npm run build` e depois `npm start` com `NODE_ENV=production` — o Express serve o `dist/` e a API no mesmo processo (Render, Railway, um VPS...). No Windows:

  ```powershell
  $env:NODE_ENV="production"; npm start
  ```

  No Linux/macOS:

  ```bash
  NODE_ENV=production npm start
  ```

  Configure `PORT` e as variáveis SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_DESTINO`) no ambiente da plataforma — em produção o servidor não inicia sem elas (o "modo log" é restrito ao desenvolvimento local).

---

## Estrutura de pastas

```
frontend-portfolio/
├── public/
│   ├── robots.txt            # Diretrizes para crawlers
│   └── sitemap.xml           # Mapa do site (gerado via npm run sitemap)
├── css/
│   ├── base/
│   │   ├── reset.css          # Reset e normalização
│   │   ├── variables.css      # Variáveis CSS (cores, espaçamentos)
│   │   └── typography.css     # Fontes e tamanhos
│   ├── components/
│   │   ├── header.css         # Header e navegação
│   │   ├── hero.css           # Seção hero
│   │   ├── about-skills.css   # Sobre mim e cards de tecnologias
│   │   ├── projetos.css       # Grid e filtros de projetos
│   │   ├── contato.css        # Formulário e redes sociais
│   │   ├── botoes.css         # Botões globais
│   │   ├── footer.css         # Rodapé
│   │   └── toast.css          # Notificações toast
│   ├── utils/
│   │   ├── acessibilidade.css # Skip link, sr-only, focus visible
│   │   └── animacoes.css      # Keyframes e scroll reveal
│   └── main.css               # Entry point (importa todos os módulos)
├── js/
│   ├── modules/
│   │   ├── tema.js            # Dark/Light mode
│   │   ├── menu.js            # Menu mobile
│   │   ├── scroll.js          # Scroll spy, reveal e voltar ao topo
│   │   ├── filtroProjetos.js  # Filtro e busca de projetos
│   │   ├── formulario.js      # Validação e envio do formulário
│   │   ├── copiarEmail.js     # Copiar e-mail
│   │   ├── toast.js           # Notificações toast
│   │   └── typingEffect.js    # Efeito de digitação
│   └── main.js                # Entry point (inicializa módulos)
├── server/
│   ├── index.js               # Inicializa o servidor Express
│   ├── app.js                 # App Express (middlewares, rotas, estático)
│   ├── routes/contato.js      # POST /api/contato com validação
│   ├── lib/email.js           # Envio de e-mail (Nodemailer / modo log)
│   └── .env.example           # Modelo de variáveis de ambiente
├── scripts/
│   ├── gerar-sitemap.js       # Regenera public/sitemap.xml
│   ├── verificar-assets.js    # Checa referências locais e imagens órfãs
│   └── otimizar-imagens.js    # Converte PNGs/JPGs para WebP
├── img/                       # Imagens e ícones (WebP otimizado)
├── index.html                 # Página principal (entry point do Vite)
├── vite.config.js             # Configuração do Vite
├── package.json               # Scripts e dependências
└── README.md
```

---

## O que aprendi

- **Manipulação do DOM** — criação e remoção de elementos, event delegation, manipulação de classes e atributos
- **Organização de código** — separação em módulos ES6, cada funcionalidade isolada e testável
- **CSS modular** — uso de `@import` para organizar estilos em base, componentes e utilitários
- **Responsividade** — media queries, grid e flexbox para adaptar o layout às telas
- **Acessibilidade** — ARIA labels, navegação por teclado, skip link, focus management
- **Performance** — lazy loading de imagens, preload de recursos críticos, preconnect para fontes externas
- **Persistência de estado** — uso de `localStorage` para manter preferências do usuário entre sessões
- **Validação de formulário** — feedback visual em tempo real no frontend e validação server-side no Express
- **Backend com Express** — rotas, middlewares, rate limit, envio de e-mail com Nodemailer e modo log para desenvolvimento
- **Automação com Node.js** — scripts para gerar sitemap, verificar referências de assets e otimizar imagens

---

## Autor

**Diovanny Martins** — Desenvolvedor Front-End

- **GitHub:** [@DiovannyMartins](https://github.com/DiovannyMartins)
- **LinkedIn:** [Diovanny Martins](https://linkedin.com/in/diovanny-martins)
- **E-mail:** diovannydev@gmail.com

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
