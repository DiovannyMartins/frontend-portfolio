# Frontend Portfolio

Portfólio front-end responsivo desenvolvido com HTML, CSS e TypeScript (compilado para JavaScript), empacotado com **Vite**, com backend **Hono** para o formulário de contato (deploy no **Cloudflare Pages**) e scripts de automação em **Node.js**.

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

- TypeScript Vanilla (sem frameworks)
- Vite como dev server e build (minificação, hashing de assets)
- Backend Hono com validação server-side, rate limit, envio de e-mail (Resend) e cabeçalhos de segurança (secure-headers/CSP)
- Deploy no Cloudflare Pages com Pages Functions (frontend e API no mesmo domínio)
- Validação de e-mail em fonte única compartilhada entre frontend e backend
- Testes automatizados com o runner nativo do Node via `tsx --test`
- Typecheck dos três ambientes (frontend, Node e Cloudflare Pages Functions) com `npm run typecheck`
- ESLint + Prettier para lint e formatação consistente
- Scripts de automação: sitemap, verificação de assets, otimização de imagens e screenshots
- Anti-spam em camadas no formulário: honeypot + honeytoken, tempo mínimo de preenchimento, rate limit por IP e por e-mail do remetente, dedupe de conteúdo e cap global de entregas (além do Cloudflare Turnstile)
- Internacionalização **PT/EN**: página `/en/` estática gerada no build, switcher de idioma, persistência da escolha e backend respondendo no idioma do visitante
- **CI no GitHub Actions** (typecheck, lint, test, check, format e build) a cada push/PR
- Hero com "editor vivo" (canvas animado com tokens de código) como aprimoramento progressivo
- Responsivo (layout adapta-se a todas as telas)
- Dark/Light Mode
- Acessível (ARIA)
- SEO otimizado (hreflang + sitemap com alternates por idioma)

---

## Tecnologias

| Stack                | Detalhe                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| HTML5                | Semântica, ARIA, meta tags Open Graph/Twitter Card                       |
| CSS3                 | Variáveis CSS, Grid, Flexbox, animações, `@import` modular               |
| TypeScript           | Código-fonte com tipos estritos; o Vite gera JavaScript para o navegador |
| Vite                 | Dev server, build de produção e proxy para a API em desenvolvimento      |
| Hono                 | API para o formulário de contato (validação, rate limit, e-mail)         |
| secure-headers       | Cabeçalhos de segurança e Content-Security-Policy no Hono                |
| Resend               | Envio de e-mail a partir do formulário (REST API, sem SMTP)              |
| Cloudflare Turnstile | CAPTCHA do formulário (anti-bot), validado no servidor                   |
| Cloudflare Pages     | Hospedagem do frontend + Pages Functions (API no mesmo domínio)          |
| ESLint + Prettier    | Lint estático e formatação consistente do código                         |
| Git/GitHub           | Versionamento e deploy via Cloudflare Pages                              |
| Google Fonts         | Inter (todo o texto)                                                     |

---

## Sobre o projeto

O projeto foi desenvolvido com foco em simplicidade, desempenho e facilidade de avaliação, usando Vite apenas como ferramenta de desenvolvimento/build — o código continua Vanilla (TypeScript no código-fonte, JavaScript no navegador), sem framework. As decisões técnicas principais:

- **Vite para desenvolvimento e build**: dev server com HMR, proxy para a API, minificação e hashing de assets no build. O resultado em `dist/` é JavaScript e pode ser publicado em qualquer hosting estático.
- **Backend Hono opcional**: usado apenas para o formulário de contato. Sem variáveis do Resend, roda em "modo log" redigido (por padrão em desenvolvimento) — **apenas em desenvolvimento**; em produção o servidor não inicia sem elas.
- **Configuração centralizada**: `server/lib/config.ts` expõe `carregarConfig(env)`, que lê um objeto de ambiente — `process.env` no Node ou `context.env` no Cloudflare Workers. O mesmo código roda nos dois runtimes.
- **Segurança no backend**: secure-headers (Hono) com Content-Security-Policy ajustada (Google Fonts + script anti-FOUC externo), anti-spam em camadas no formulário, rate limit por IP, limite de payload (`16kb`) e validação server-side.
- **CSS modular com `@import`**: base (reset, variáveis, tipografia), componentes (header, hero, about-skills, projetos, contato, botoes, footer, toast) e utilitários (acessibilidade, animações) separados em arquivos independentes. Facilita manutenção e leitura.
- **TypeScript em ES Modules**: cada funcionalidade (tema, menu, scroll, filtro, formulário, copiar e-mail, typing effect, editor vivo) vive em seu próprio módulo. O `main.ts` apenas inicializa — sem acoplamento. Imagens alternadas pelo tema usam caminhos em string (`img/...`), que permanecem válidos no build gerado em `dist/` (o Vite não processa essas referências dinâmicas). A validação de e-mail vive em `shared/validacao.ts`, usada pelo frontend e pelo backend (fonte única de verdade). Tipos compartilhados entre frontend, Node e Cloudflare ficam em `shared/types.ts`.
- **Anti-FOUC no tema**: `public/js/tema-inicial.js` roda no `<head>` antes da renderização (script clássico síncrono), evitando o flash do tema errado — sem precisar de `'unsafe-inline'` na CSP.
- **Testes com `tsx --test`**: cobertura da validação, CORS, rate limit, anti-spam e dos endpoints da API, sem dependências adicionais além do `tsx`.
- **Internacionalização**: um dicionário em `shared/i18n.ts` (PT/EN) alimenta a geração da página `/en/` no build, as strings dinâmicas em runtime (`js/i18n.ts`) e as mensagens do servidor (via header `x-lang`). A escolha de idioma fica em `localStorage["idioma"]` e um script anti-FOUC redireciona conforme a preferência (ou o navegador na primeira visita), ignorando bots para preservar o SEO.
- **Acessibilidade como requisito, não extra**: skip link, ARIA labels, `aria-live` nos erros do formulário, `aria-pressed` nos filtros, focus visible customizado.
- **Performance**: imagens em WebP com lazy loading, `preload` da imagem hero, `preconnect` para fontes, `theme-color` para mobile.

---

## Funcionalidades

- **Dark/Light mode** com persistência via `localStorage` e anti-FOUC
- **Menu mobile** com animação hamburguer/X e fechamento ao clicar fora
- **Scroll spy** que destaca o link do menu conforme a seção visível
- **Filtro de projetos** por categoria (Dashboard, Landing Page, E-commerce)
- **Busca em tempo real** por título ou descrição dos projetos
- **Formulário de contato** com validação visual e feedback em tempo real (bordas verdes/vermelhas) e anti-spam em camadas
- **Anti-spam em camadas**: honeypot `website`, honeytoken preenchido pelo JS, tempo mínimo de preenchimento (3s), rate limit por IP (10/15min) e por e-mail do remetente (3/15min), dedupe de conteúdo (>3 cópias idênticas/1h) e cap global de entregas (20/15min) — bloqueios respondem 429 genérico e registram log `[anti-spam]`
- **Kill-switch do formulário**: `CONTATO_ENABLED=false` desliga o envio (503) sem novo deploy
- **Internacionalização PT/EN**: switcher de idioma no header, página `/en/` gerada no build, persistência da escolha e mensagens do backend no idioma do visitante
- **CI no GitHub Actions**: typecheck, lint, test, check, format e build a cada push/PR
- **Botão copiar e-mail** com toast notification de confirmação
- **Scroll reveal** nas seções ao rolar a página
- **Botão voltar ao topo** com animação fade
- **Efeito de digitação** no título hero
- **Editor vivo na hero** — canvas animado com tokens de código que reage ao ponteiro; desliga em `prefers-reduced-motion` e em telas sensíveis ao toque
- **Skip link** para navegação por teclado
- **Imagens otimizadas** em WebP com lazy loading
- **Screenshots automáticos** dos projetos (Playwright): estabiliza o frame (fontes, tema claro, sem animações), falha em captura em branco/erro e gera `screenshots-preview.html` para revisão
- **Testes automatizados** da API (`npm test`)
- **Lint e formatação** com ESLint e Prettier (`npm run lint`, `npm run format`)
- **SEO**: `sitemap.xml` com hreflang por idioma, `robots.txt`, Open Graph, Twitter Card

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

> Os arquivos-fonte estão em TypeScript (`js/*.ts`) e **não funcionam** abrindo o `index.html` diretamente nem com Live Server sem o Vite — o navegador só entende o JavaScript gerado pelo dev/build. Use sempre `npm run dev` (ou `npm run dev:all`) para desenvolvimento. A pasta `dist/`, gerada por `npm run build`, contém JavaScript e pode ser publicada em hospedagem estática; `npm run preview` serve esse build localmente. Os caminhos de imagem em string (`img/...`) continuam válidos no build gerado — eles não tornam o TypeScript executável diretamente no navegador.

### Formulário de contato

O formulário envia para `POST /api/contato`, então **precisa do backend rodando**. Antes de enviar, ele checa `GET /api/health`:

- **Com backend** (`npm run dev:all` ou `npm start`): envio normal.
- **Sem backend** (hospedagem somente estática do `dist/`, sem Pages Functions): a interface funciona normalmente, mas o formulário mostra a mensagem "O envio online não está ativo nesta hospedagem" e orienta a usar `npm run dev:all` — não tenta enviar nem gera erro de POST no console.

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
- O widget usa **modo interativo** (`appearance: "always"` em `js/modules/formulario.ts`): o desafio é sempre exibido, em vez de invisível/automático — dificulta bots que só resolvem o modo oculto.
- O **token** gerado pelo widget é enviado no campo `turnstile` do corpo do POST.
- No servidor, `server/routes/contato.ts` valida o token via [siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) (`server/lib/turnstile.ts`) usando a secret key.
- **Sem `TURNSTILE_SECRET_KEY`** (ex.: dev local), a validação é ignorada — o captcha só bloqueia em produção.
- Configure `TURNSTILE_HOSTNAMES` em produção para restringir tokens aos domínios do site. `TURNSTILE_ACTION` pode ser usado quando o widget tiver uma action definida.
- O widget é resetado a cada tentativa de envio (o token é de uso único).

#### Anti-spam em camadas e resposta a ataques

Além do Turnstile, o formulário combina camadas defensivas: rate limit por IP (10/15min), honeypot `website`, honeytoken preenchido pelo JS no load, tempo mínimo de preenchimento (3s), rate limit por e-mail do remetente (3/15min), dedupe de conteúdo (>3 cópias idênticas/1h) e cap global de entregas (20/15min). Bloqueios respondem **429 genérico** (ou sucesso simulado nas armadilhas), sem revelar qual camada pegou.

Ao suspeitar de um ataque:

1. **Observe os logs** — cada bloqueio gera `[anti-spam] <camada> bloqueado (chave: ...)`. A camada que dispara indica o tipo de ataque.
2. **Não precisa agir** — as camadas continuam bloqueando; mensagens válidas ainda passam.
3. **Se o ataque sobreviver a todas as camadas**, desligue o formulário sem deploy: defina `CONTATO_ENABLED=false` (variável de ambiente) → a API responde 503 e o site mostra "envio online não ativo".
4. **Investigue** no painel do Resend (envios recentes) e no Cloudflare (logs/analytics) para entender a origem.

Para criar as chaves: [dash.cloudflare.com](https://dash.cloudflare.com/) → **Turnstile** → **Add widget** (modo **Managed**, hostnames `diovanny.dev`, `www.diovanny.dev` e `frontend-portfolio-5at.pages.dev`). Em produção, a secret key vai como variável no Cloudflare (ver abaixo).

### Scripts disponíveis

| Comando                    | Descrição                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`              | Inicia o Vite (frontend) com proxy para a API                                                                              |
| `npm run dev:all`          | Inicia frontend e backend juntos                                                                                           |
| `npm run server`           | Inicia apenas o backend Hono com reload automático (`tsx watch server/index.ts`)                                           |
| `npm run build`            | Roda o typecheck, gera o build de produção em `dist/` e a versão em inglês em `dist/en/`                                   |
| `npm run preview`          | Serve localmente o build gerado                                                                                            |
| `npm start`                | Inicia o servidor Hono via `tsx` (API; em produção não inicia sem as variáveis do Resend)                                  |
| `npm run typecheck`        | Verifica os tipos dos três ambientes (frontend, Node e Cloudflare Pages Functions)                                         |
| `npm run types:cloudflare` | Regenera `functions/types.d.ts` (tipos do runtime Cloudflare)                                                              |
| `npm run pages:dev`        | Sobe o Cloudflare Pages localmente (build + `wrangler pages dev`) — testa as Functions                                     |
| `npm run pages:deploy`     | Builda e publica no Cloudflare Pages (`wrangler pages deploy dist`)                                                        |
| `npm test`                 | Roda os testes automatizados da API com `tsx --test`                                                                       |
| `npm run lint`             | Verifica o código com ESLint                                                                                               |
| `npm run lint:fix`         | Corrige automaticamente os problemas de lint                                                                               |
| `npm run format`           | Formata todos os arquivos com Prettier                                                                                     |
| `npm run format:check`     | Verifica se todos os arquivos seguem o padrão do Prettier                                                                  |
| `npm run sitemap`          | Regenera o `sitemap.xml` em `public/` (lastmod = data do último commit que alterou o `index.html`)                         |
| `npm run check`            | Verifica se todas as referências a arquivos locais existem e lista imagens órfãs                                           |
| `npm run imagens`          | Converte PNGs/JPGs grandes (> 10 KB) de `img/` para WebP                                                                   |
| `npm run screenshots`      | Captura screenshots dos projetos (Playwright), gera as thumbnails WebP em `img/` e um relatório `screenshots-preview.html` |

### Deploy — Cloudflare Pages

O deploy recomendado é o **Cloudflare Pages**: ele serve o frontend (`dist/`) e as Pages Functions (`functions/`) no mesmo domínio, mantendo o site e a API sempre online juntos.

```bash
# 1. Autentique na sua conta Cloudflare (primeira vez)
npx wrangler login

# 2. Publica o site (frontend + API) no seu projeto Pages
npm run pages:deploy
```

O site fica disponível em `https://diovanny.dev` (domínio próprio) e a API em `https://diovanny.dev/api/...`.

> Este repo também está conectado ao Cloudflare Pages via **Git integration**: cada push na `main` passa pelo CI (`npm run build`) e publica sozinho. O comando abaixo é a alternativa manual.

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
│   ├── _headers              # Cabeçalhos HTTP/segurança (Cloudflare Pages)
│   ├── js/
│   │   ├── tema-inicial.js   # Anti-FOUC (aplica o tema antes do render)
│   │   └── idioma-inicial.js # Anti-FOUC de idioma (redireciona por preferência/navegador)
│   ├── robots.txt            # Diretrizes para crawlers
│   └── sitemap.xml           # Mapa do site (gerado via npm run sitemap)
├── shared/
│   ├── validacao.ts          # Validação de e-mail (fonte única frontend/backend)
│   ├── anti-spam.ts          # Limites das camadas de anti-spam + honeytoken/fill-time
│   ├── i18n.ts               # Dicionário PT/EN (estático + dinâmico + servidor)
│   └── types.ts              # Tipos compartilhados (AppEnv, AppConfig, respostas da API)
├── css/
│   ├── base/
│   │   ├── reset.css          # Reset e normalização
│   │   ├── variables.css      # Variáveis CSS (cores, espaçamentos)
│   │   └── typography.css     # Fontes e tamanhos
│   ├── components/
│   │   ├── header.css         # Header e navegação
│   │   ├── hero.css           # Seção hero
│   │   ├── hero-live.css       # Editor vivo da hero (aprimoramento progressivo sobre hero.css)
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
│   ├── i18n.ts               # Runtime de i18n (traduz strings dinâmicas + switcher)
│   ├── modules/
│   │   ├── tema.ts            # Dark/Light mode
│   │   ├── menu.ts            # Menu mobile
│   │   ├── scroll.ts          # Scroll spy, reveal e voltar ao topo
│   │   ├── filtroProjetos.ts  # Filtro e busca de projetos
│   │   ├── formulario.ts      # Validação e envio do formulário
│   │   ├── copiarEmail.ts     # Copiar e-mail
│   │   ├── toast.ts           # Notificações toast
│   │   ├── typingEffect.ts    # Efeito de digitação
│   │   └── livingEditor.ts    # Editor vivo da hero (canvas animado)
│   └── main.ts                # Entry point (inicializa módulos)
├── types/
│   └── turnstile.d.ts         # Tipagem mínima do Cloudflare Turnstile no window
├── functions/
│   ├── types.d.ts             # Tipos do runtime Cloudflare (gerado por wrangler types)
│   └── api/
│       └── [[path]].ts        # Pages Functions: qualquer rota /api/* monta o app Hono
├── server/
│   ├── index.ts               # Inicializa o servidor Hono no Node (@hono/node-server)
│   ├── app.ts                 # App Hono (secure-headers, CORS, rate limit, rotas) — factory criarApp()
│   ├── app.test.ts            # Testes automatizados da API (tsx --test)
│   ├── routes/contato.ts      # POST /api/contato com validação, anti-spam e Turnstile
│   ├── lib/
│   │   ├── config.ts          # carregarConfig(env) — lê process.env ou context.env
│   │   ├── email.ts           # Envio de e-mail via Resend (REST API / modo log)
│   │   ├── turnstile.ts       # Valida o token do Cloudflare Turnstile (siteverify)
│   │   ├── anti-spam.ts       # Contadores das camadas extras (e-mail, dedupe, cap global)
│   │   └── idioma.ts          # Resolve as mensagens do backend pelo header x-lang
│   └── .env.example           # Modelo de variáveis de ambiente
├── scripts/
│   ├── gerar-sitemap.js       # Regenera public/sitemap.xml (com hreflang por idioma)
│   ├── gerar-pagina-en.js     # Gera dist/en/index.html a partir do build
│   ├── verificar-assets.js    # Checa referências locais e imagens órfãs
│   ├── otimizar-imagens.js    # Converte PNGs/JPGs para WebP
│   └── capturar-screenshots.js# Captura thumbnails dos projetos (Playwright + sharp)
├── .github/
│   └── workflows/ci.yml       # GitHub Actions: typecheck, lint, test, check, format e build
├── img/                       # Imagens e ícones (WebP otimizado)
├── index.html                 # Página principal (entry point do Vite)
├── vite.config.ts             # Configuração do Vite (build, proxy e cópia de estáticos)
├── tsconfig.json              # Typecheck do frontend (js/, shared/, types/)
├── tsconfig.node.json         # Typecheck do Node (server/, shared/, vite.config.ts)
├── functions/tsconfig.json    # Typecheck das Pages Functions (funções + runtime Cloudflare)
├── tsconfig.base.json         # Base comum (strict, noEmit, ES2022)
├── wrangler.toml              # Configuração do Cloudflare Pages
├── eslint.config.js           # Configuração do ESLint (flat config)
├── .prettierrc.json           # Configuração do Prettier
├── .prettierignore            # Arquivos ignorados pelo Prettier
├── CONTEXT.md                 # Glossário do domínio (contexto único)
├── docs/adr/                  # Registros de decisão de arquitetura (ADRs)
├── package.json               # Scripts e dependências
└── README.md
```

---

## O que aprendi

- **Manipulação do DOM** — criação e remoção de elementos, event delegation, manipulação de classes e atributos
- **Organização de código** — separação em módulos TypeScript/ES6, cada funcionalidade isolada e testável
- **CSS modular** — uso de `@import` para organizar estilos em base, componentes e utilitários
- **Responsividade** — media queries, grid e flexbox para adaptar o layout às telas
- **Acessibilidade** — ARIA labels, navegação por teclado, skip link, focus management
- **Performance** — lazy loading de imagens, preload de recursos críticos, preconnect para fontes externas
- **Aprimoramento progressivo** — "editor vivo" na hero com Canvas API, desativado quando há `prefers-reduced-motion` ou tela sensível ao toque
- **Persistência de estado** — uso de `localStorage` para manter preferências do usuário entre sessões
- **Validação de formulário** — feedback visual em tempo real no frontend e validação server-side no Hono, com regras compartilhadas em fonte única
- **Backend com Hono** — rotas, middlewares, rate limit, envio de e-mail com Resend, modo log para desenvolvimento e configuração por ambiente (`process.env`/`context.env`)
- **Cloudflare Pages + Functions** — deploy do frontend e da API no mesmo domínio, variáveis por secret e domínio próprio (diovanny.dev)
- **Segurança web** — secure-headers/CSP, honeypot + Cloudflare Turnstile, limite de payload e validação de entrada no servidor
- **Testes automatizados** — cobertura da API com `tsx --test` (runner nativo do Node) e `fetch`
- **TypeScript estrito** — tipagem de frontend (Vite), Node (tsx) e Cloudflare (Wrangler) em configurações separadas, com `npm run typecheck`
- **Qualidade de código** — ESLint e Prettier para manter o código consistente e sem problemas comuns
- **Automação com Node.js** — scripts para gerar sitemap, verificar referências de assets, otimizar imagens e capturar screenshots
- **Internacionalização** — páginas estáticas por idioma (uma fonte + geração no build) + strings dinâmicas em runtime + backend no idioma do visitante, com hreflang/sitemap para SEO
- **CI no GitHub Actions** — gate de qualidade (typecheck, lint, test, check, format, build) antes do merge, com deploy via Git integration do Cloudflare

---

## Autor

**Diovanny Martins** — Desenvolvedor Full-Stack

- **Site:** [diovanny.dev](https://diovanny.dev)
- **GitHub:** [@DiovannyMartins](https://github.com/DiovannyMartins)
- **E-mail:** diovannydev@gmail.com

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
