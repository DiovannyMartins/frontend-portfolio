# Frontend Portfolio

Portfólio front-end responsivo desenvolvido com HTML, CSS e JavaScript, empacotado com **Vite**, com backend **Hono** para o formulário de contato (deploy no **Cloudflare Pages**) e scripts de automação em **Node.js**.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-Sim-green?style=for-the-badge)

---

## Destaques

- JavaScript Vanilla (sem frameworks)
- Vite como dev server e build (minificação, hashing de assets)
- Backend Hono com validação server-side, rate limit, envio de e-mail (Resend) e cabeçalhos de segurança (secure-headers/CSP)
- Deploy no Cloudflare Pages com Pages Functions (frontend e API no mesmo domínio)
- Validação de e-mail em fonte única compartilhada entre frontend e backend
- Testes automatizados com o runner nativo do Node (`node --test`)
- ESLint + Prettier para lint e formatação consistente
- Scripts de automação: sitemap, verificação de assets e otimização de imagens
- Anti-spam com honeypot e Cloudflare Turnstile (CAPTCHA) no formulário de contato
- Responsivo (layout adapta-se a todas as telas)
- Dark/Light Mode
- Acessível (ARIA)
- SEO otimizado

---

## Tecnologias

| Stack                | Detalhe                                                             |
| -------------------- | ------------------------------------------------------------------- |
| HTML5                | Semântica, ARIA, meta tags Open Graph/Twitter Card                  |
| CSS3                 | Variáveis CSS, Grid, Flexbox, animações, `@import` modular          |
| JavaScript (ES6+)    | ES Modules — frontend sem dependências de runtime                   |
| Vite                 | Dev server, build de produção e proxy para a API em desenvolvimento |
| Hono                 | API para o formulário de contato (validação, rate limit, e-mail)    |
| secure-headers       | Cabeçalhos de segurança e Content-Security-Policy no Hono           |
| Resend               | Envio de e-mail a partir do formulário (REST API, sem SMTP)         |
| Cloudflare Turnstile | CAPTCHA do formulário (anti-bot), validado no servidor              |
| Cloudflare Pages     | Hospedagem do frontend + Pages Functions (API no mesmo domínio)     |
| ESLint + Prettier    | Lint estático e formatação consistente do código                    |
| Git/GitHub           | Versionamento e deploy via Cloudflare Pages                         |
| Google Fonts         | Inter (todo o texto)                                                |

---

## Sobre o projeto

O projeto foi desenvolvido com foco em simplicidade, desempenho e facilidade de avaliação, usando Vite apenas como ferramenta de desenvolvimento/build — o código continua JavaScript Vanilla, sem framework. As decisões técnicas principais:

- **Vite para desenvolvimento e build**: dev server com HMR, proxy para a API, minificação e hashing de assets no build. O site continua estático e pode ser publicado em qualquer hosting estático.
- **Backend Hono opcional**: usado apenas para o formulário de contato. Sem variáveis do Resend, roda em "modo log" redigido (por padrão em desenvolvimento) — **apenas em desenvolvimento**; em produção o servidor não inicia sem elas.
- **Configuração centralizada**: `server/lib/config.js` expõe `carregarConfig(env)`, que lê um objeto de ambiente — `process.env` no Node ou `context.env` no Cloudflare Workers. O mesmo código roda nos dois runtimes.
- **Segurança no backend**: secure-headers (Hono) com Content-Security-Policy ajustada (Google Fonts + script anti-FOUC externo), honeypot anti-spam no formulário, rate limit por IP, limite de payload (`16kb`) e validação server-side.
- **CSS modular com `@import`**: base (reset, variáveis, tipografia), componentes (header, hero, about-skills, projetos, contato, botoes, footer, toast) e utilitários (acessibilidade, animações) separados em arquivos independentes. Facilita manutenção e leitura.
- **JavaScript em ES Modules**: cada funcionalidade (tema, menu, scroll, filtro, formulário, copiar e-mail, typing effect) vive em seu próprio módulo. O `main.js` apenas inicializa — sem acoplamento. Imagens alternadas pelo tema usam caminhos em string (`img/...`), o que mantém o site funcional em hospedagem estática crua sem build. A validação de e-mail vive em `shared/validacao.js`, usada pelo frontend e pelo backend (fonte única de verdade).
- **Anti-FOUC no tema**: `public/js/tema-inicial.js` roda no `<head>` antes da renderização (script clássico síncrono), evitando o flash do tema errado — sem precisar de `'unsafe-inline'` na CSP.
- **Testes com `node --test`**: cobertura da validação, CORS, rate limit e dos endpoints da API, sem dependências adicionais.
- **Acessibilidade como requisito, não extra**: skip link, ARIA labels, `aria-live` nos erros do formulário, `aria-pressed` nos filtros, focus visible customizado.
- **Performance**: imagens em WebP com lazy loading, `preload` da imagem hero, `preconnect` para fontes, `theme-color` para mobile.

---

## Funcionalidades

- **Dark/Light mode** com persistência via `localStorage` e anti-FOUC
- **Menu mobile** com animação hamburguer/X e fechamento ao clicar fora
- **Scroll spy** que destaca o link do menu conforme a seção visível
- **Filtro de projetos** por categoria (Dashboard, Landing Page, E-commerce)
- **Busca em tempo real** por título ou descrição dos projetos
- **Formulário de contato** com validação visual e feedback em tempo real (bordas verdes/vermelhas) e honeypot anti-spam
- **Botão copiar e-mail** com toast notification de confirmação
- **Scroll reveal** nas seções ao rolar a página
- **Botão voltar ao topo** com animação fade
- **Efeito de digitação** no título hero
- **Skip link** para navegação por teclado
- **Imagens otimizadas** em WebP com lazy loading
- **Testes automatizados** da API (`npm test`)
- **Lint e formatação** com ESLint e Prettier (`npm run lint`, `npm run format`)
- **SEO**: `sitemap.xml`, `robots.txt`, Open Graph, Twitter Card

---

## Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org) 22.12 ou superior.

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
- **Sem backend** (abrir o `index.html` direto ou Live Server): o formulário mostra a mensagem "O envio online não está ativo nesta hospedagem" e orienta a usar `npm run dev:all` — não tenta enviar nem gera erro de POST no console.

Para testar o envio localmente, copie `server/.env.example` para `server/.env`:

```powershell
# PowerShell
Copy-Item server/.env.example server/.env

# ou manualmente: crie um arquivo server/.env com o conteúdo de server/.env.example
```

- **Sem Resend configurado**: o servidor roda em "modo log" — as mensagens aparecem no console do terminal. **Apenas para desenvolvimento local**: em produção o servidor **não inicia** sem Resend e Turnstile configurados, evitando que e-mails e mensagens dos visitantes vazem para os logs da plataforma.
- **Com Resend configurado**: preencha `RESEND_API_KEY` (crie em [resend.com/api-keys](https://resend.com/api-keys)) e `RESEND_FROM` no `.env`. Na conta grátis, use `onboarding@resend.dev` e defina `EMAIL_DESTINO` como o **mesmo e-mail da sua conta Resend** (só é possível enviar para si mesmo sem domínio verificado). Se o frontend e a API estiverem em origens diferentes, configure também `FRONTEND_ORIGIN` (origens autorizadas, separadas por vírgula).

#### CAPTCHA com Cloudflare Turnstile

O formulário usa o [Turnstile](https://www.cloudflare.com/products/turnstile/) como proteção anti-bot:

- A **sitekey** (pública) fica no `<div id="turnstile" data-sitekey="...">` do `index.html` e no script `https://challenges.cloudflare.com/turnstile/v0/api.js` (carregado sem `async`/`defer` no `<head>` — necessário para o `window.turnstile.render` estar pronto).
- O widget usa **modo interativo** (`appearance: "always"` em `js/modules/formulario.js`): o desafio é sempre exibido, em vez de invisível/automático — dificulta bots que só resolvem o modo oculto.
- O **token** gerado pelo widget é enviado no campo `turnstile` do corpo do POST.
- No servidor, `server/routes/contato.js` valida o token via [siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) (`server/lib/turnstile.js`) usando a secret key.
- **Sem `TURNSTILE_SECRET_KEY`** (ex.: dev local), a validação é ignorada — o captcha só bloqueia em produção.
- Configure `TURNSTILE_HOSTNAMES` em produção para restringir tokens aos domínios do site. `TURNSTILE_ACTION` pode ser usado quando o widget tiver uma action definida.
- O widget é resetado a cada tentativa de envio (o token é de uso único).

Para criar as chaves: [dash.cloudflare.com](https://dash.cloudflare.com/) → **Turnstile** → **Add widget** (modo **Managed**, hostnames `diovanny.dev`, `www.diovanny.dev` e `frontend-portfolio-5at.pages.dev`). Em produção, a secret key vai como variável no Cloudflare (ver abaixo).

### Scripts disponíveis

| Comando                | Descrição                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Inicia o Vite (frontend) com proxy para a API                                                      |
| `npm run dev:all`      | Inicia frontend e backend juntos                                                                   |
| `npm run server`       | Inicia apenas o backend Hono (usado pelo `dev:all`)                                                |
| `npm run build`        | Gera o build de produção em `dist/`                                                                |
| `npm run preview`      | Serve localmente o build gerado                                                                    |
| `npm start`            | Inicia o servidor Hono (API; em produção não inicia sem as variáveis do Resend)                    |
| `npm run pages:dev`    | Sobe o Cloudflare Pages localmente (build + `wrangler pages dev`) — testa as Functions             |
| `npm run pages:deploy` | Builda e publica no Cloudflare Pages (`wrangler pages deploy dist`)                                |
| `npm test`             | Roda os testes automatizados da API (`node --test`)                                                |
| `npm run lint`         | Verifica o código com ESLint                                                                       |
| `npm run lint:fix`     | Corrige automaticamente os problemas de lint                                                       |
| `npm run format`       | Formata todos os arquivos com Prettier                                                             |
| `npm run format:check` | Verifica se todos os arquivos seguem o padrão do Prettier                                          |
| `npm run sitemap`      | Regenera o `sitemap.xml` em `public/` (lastmod = data do último commit que alterou o `index.html`) |
| `npm run check`        | Verifica se todas as referências a arquivos locais existem e lista imagens órfãs                   |
| `npm run imagens`      | Converte PNGs/JPGs grandes (> 10 KB) de `img/` para WebP                                           |

### Deploy — Cloudflare Pages

O deploy recomendado é o **Cloudflare Pages**: ele serve o frontend (`dist/`) e as Pages Functions (`functions/`) no mesmo domínio, mantendo o site e a API sempre online juntos.

```bash
# 1. Autentique na sua conta Cloudflare (primeira vez)
npx wrangler login

# 2. Publica o site (frontend + API) no seu projeto Pages
npm run pages:deploy
```

O site fica disponível em `https://diovanny.dev` (domínio próprio) e a API em `https://diovanny.dev/api/...`.

### Configurando as variáveis de ambiente no Cloudflare

As variáveis do Resend **não** devem ir no `.env` em produção. Defina-as como secrets no projeto Pages (painel em **Settings → Environment variables**, ou via CLI):

```bash
npx wrangler pages secret put RESEND_API_KEY --project-name frontend-portfolio
npx wrangler pages secret put RESEND_FROM --project-name frontend-portfolio
npx wrangler pages secret put EMAIL_DESTINO --project-name frontend-portfolio
npx wrangler pages secret put TURNSTILE_SECRET_KEY --project-name frontend-portfolio
```

> Na conta grátis do Resend, use `RESEND_FROM=onboarding@resend.dev` e `EMAIL_DESTINO` = o mesmo e-mail da sua conta Resend. Com um domínio verificado no Resend, dá para usar `contato@seudominio.com` e enviar para qualquer e-mail. A `TURNSTILE_SECRET_KEY` é criada em **Turnstile** no painel do Cloudflare (a sitekey, pública, vai no `index.html`).

### Usando o domínio próprio (diovanny.dev)

1. No painel do Cloudflare Pages, abra o projeto e vá em **Custom domains** → **Set up a custom domain**.
2. Adicione `diovanny.dev` (e opcionalmente `www.diovanny.dev`).
3. Como o domínio foi comprado no próprio Cloudflare, ele já aponta automaticamente para o Pages (nenhum ajuste de DNS manual é necessário).
4. Pronto: o site e a API ficam online em `https://diovanny.dev` e `https://diovanny.dev/api/...`.

> O site **não** fica mais hospedado no GitHub Pages — a hospedagem oficial é o Cloudflare Pages no domínio próprio `diovanny.dev`.

### Deploy em outros hostings

- **Frontend estático**: `npm run build` e publique a pasta `dist/` (Netlify, Vercel...). O formulário exibirá "envio online não ativo" sem a API.
- **VPS/Node**: `npm start` com as variáveis do Resend configuradas — o Hono sobe a API (para servir também o `dist/`, use um servidor estático à parte).

---

## Estrutura de pastas

```
frontend-portfolio/
├── public/
│   ├── robots.txt            # Diretrizes para crawlers
│   └── sitemap.xml           # Mapa do site (gerado via npm run sitemap)
├── shared/
│   └── validacao.js          # Validação de e-mail (fonte única frontend/backend)
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
│   ├── tema-inicial.js        # Anti-FOUC (em public/js/; aplica o tema antes do render)
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
├── functions/
│   └── api/
│       └── [[path]].js          # Pages Functions: qualquer rota /api/* monta o app Hono
├── server/
│   ├── index.js               # Inicializa o servidor Hono no Node (@hono/node-server)
│   ├── app.js                 # App Hono (secure-headers, CORS, rate limit, rotas) — factory criarApp()
│   ├── app.test.js            # Testes automatizados da API (node --test)
│   ├── routes/contato.js      # POST /api/contato com validação, honeypot e Turnstile
│   ├── lib/
│   │   ├── config.js          # carregarConfig(env) — lê process.env ou context.env
│   │   ├── email.js           # Envio de e-mail via Resend (REST API / modo log)
│   │   └── turnstile.js       # Valida o token do Cloudflare Turnstile (siteverify)
│   └── .env.example           # Modelo de variáveis de ambiente
├── scripts/
│   ├── gerar-sitemap.js       # Regenera public/sitemap.xml
│   ├── verificar-assets.js    # Checa referências locais e imagens órfãs
│   └── otimizar-imagens.js    # Converte PNGs/JPGs para WebP
├── img/                       # Imagens e ícones (WebP otimizado)
├── index.html                 # Página principal (entry point do Vite)
├── vite.config.js             # Configuração do Vite (build, proxy e cópia de estáticos)
├── wrangler.toml              # Configuração do Cloudflare Pages
├── eslint.config.js           # Configuração do ESLint (flat config)
├── .prettierrc.json           # Configuração do Prettier
├── .prettierignore            # Arquivos ignorados pelo Prettier
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
- **Validação de formulário** — feedback visual em tempo real no frontend e validação server-side no Hono, com regras compartilhadas em fonte única
- **Backend com Hono** — rotas, middlewares, rate limit, envio de e-mail com Resend, modo log para desenvolvimento e configuração por ambiente (`process.env`/`context.env`)
- **Cloudflare Pages + Functions** — deploy do frontend e da API no mesmo domínio, variáveis por secret e domínio próprio (diovanny.dev)
- **Segurança web** — secure-headers/CSP, honeypot + Cloudflare Turnstile, limite de payload e validação de entrada no servidor
- **Testes automatizados** — cobertura da API com o runner nativo do Node (`node --test`) e `fetch`
- **Qualidade de código** — ESLint e Prettier para manter o código consistente e sem problemas comuns
- **Automação com Node.js** — scripts para gerar sitemap, verificar referências de assets e otimizar imagens

---

## Autor

**Diovanny Martins** — Desenvolvedor Full-Stack

- **Site:** [diovanny.dev](https://diovanny.dev)
- **GitHub:** [@DiovannyMartins](https://github.com/DiovannyMartins)
- **LinkedIn:** [Diovanny Martins](https://www.linkedin.com/in/diovanny-martins-455a9942b/?trk=public-profile-join-page)
- **E-mail:** diovannydev@gmail.com

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
