# Frontend Portfolio

Portfólio front-end responsivo desenvolvido com HTML, CSS e JavaScript puro, focado em performance, acessibilidade e organização de código.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsive-Sim-green?style=for-the-badge)

---

## Destaques

- 100% JavaScript Vanilla
- Zero dependências
- Mobile First
- Dark/Light Mode
- Acessível (ARIA)
- SEO otimizado

---

## Demo

<div align="center">
  <img src="https://raw.githubusercontent.com/DiovannyMartins/frontend-portfolio/main/img/imagem.webp" alt="Preview do portfólio rodando no navegador" width="800">
  <br>
  <a href="https://diovannymartins.github.io/frontend-portfolio/">Ver ao vivo</a>
</div>

---

## Tecnologias

| Stack | Detalhe |
|-------|---------|
| HTML5 | Semântica, ARIA, meta tags Open Graph/Twitter Card |
| CSS3 | Variáveis CSS, Grid, Flexbox, animações, `@import` modular |
| JavaScript (ES6+) | ES Modules, sem dependências externas |
| Git/GitHub | Versionamento e deploy via GitHub Pages |
| Google Fonts | Fjalla One (títulos) e Inter (corpo) |

---

## Sobre o projeto

O projeto foi desenvolvido com foco em simplicidade, desempenho e facilidade de avaliação, dispensando etapas de build ou dependências externas. As decisões técnicas principais:

- **Zero dependências**: nenhum framework, nenhum build step. Abre o `index.html` e funciona.
- **CSS modular com `@import`**: base (reset, variáveis, tipografia), componentes (header, hero, cards, contato) e utilitários (acessibilidade, animações) separados em arquivos independentes. Facilita manutenção e leitura.
- **JavaScript em ES Modules**: cada funcionalidade (tema, menu, filtro, formulário, scroll spy) vive em seu próprio módulo. O `main.js` apenas inicializa — sem acoplamento.
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

Pré-requisitos: nenhum. Apenas um navegador moderno.

```bash
# 1. Clone o repositório
git clone https://github.com/DiovannyMartins/frontend-portfolio.git

# 2. Entre na pasta
cd frontend-portfolio

# 3. Abra no navegador
# Opção A: duplo clique no index.html
# Opção B: Live Server no VS Code (recomendado para desenvolvimento)
```

Não há `npm install`, não há build, não há variáveis de ambiente. É static-first por design.

---

## Estrutura de pastas

```
frontend-portfolio/
├── css/
│   ├── base/
│   │   ├── reset.css          # Reset e normalização
│   │   ├── variables.css      # Variáveis CSS (cores, espaçamentos)
│   │   └── typography.css     # Fontes e tamanhos
│   ├── components/
│   │   ├── header.css         # Header e navegação
│   │   ├── hero.css           # Seção hero
│   │   ├── cards.css          # Cards de tecnologias
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
│   │   ├── scrollSpy.js       # Destaque do link ativo
│   │   ├── scrollReveal.js    # Animação ao rolar
│   │   ├── filtroProjetos.js  # Filtro e busca de projetos
│   │   ├── formulario.js      # Validação do formulário
│   │   ├── copiarEmail.js     # Copiar e-mail + toast
│   │   ├── voltarTopo.js      # Botão voltar ao topo
│   │   ├── typingEffect.js    # Efeito de digitação
│   │   └── anoRodape.js       # Ano dinâmico no footer
│   └── main.js                # Entry point (inicializa módulos)
├── img/                       # Imagens e ícones (WebP otimizado)
├── index.html                 # Página principal
├── robots.txt                 # Diretrizes para crawlers
├── sitemap.xml                # Mapa do site para SEO
└── README.md
```

---

## O que aprendi

- **Manipulação do DOM** — criação e remoção de elementos, event delegation, manipulação de classes e atributos
- **Organização de código** — separação em módulos ES6, cada funcionalidade isolada e testável
- **CSS modular** — uso de `@import` para organizar estilos em base, componentes e utilitários
- **Responsividade** — mobile-first com media queries, grid e flexbox
- **Acessibilidade** — ARIA labels, navegação por teclado, skip link, focus management
- **Performance** — lazy loading de imagens, preload de recursos críticos, preconnect para fontes externas
- **Persistência de estado** — uso de `localStorage` para manter preferências do usuário entre sessões
- **Validação de formulário** — feedback visual em tempo real sem dependências externas

---

## Testes

Este projeto não possui suite de testes automatizados no momento. A validação é feita manualmente:

- Teste de responsividade (Chrome DevTools: mobile, tablet, desktop)
- Navegação por teclado (Tab, Enter, Escape)
- Validação de formulário (campos vazios, e-mail inválido)
- Alternância de tema e persistência após reload
- Filtro e busca de projetos (combinações e estado vazio)

---

## Roadmap / Melhorias futuras

- [ ] Migrar para um gerador estático (Astro ou 11ty) para otimizar build
- [ ] Adicionar testes E2E com Playwright
- [ ] Implementar página de detalhes para cada projeto
- [ ] Adicionar modo de alto contraste
- [ ] Integrar formulário com backend (Formspree ou similar)
- [ ] Adicionar métricas de performance (Lighthouse CI)
- [ ] Suporte a múltiplos idiomas (i18n)

---

## Autor

**Diovanny Martins** — Desenvolvedor Front-End

- **GitHub:** [@DiovannyMartins](https://github.com/DiovannyMartins)
- **LinkedIn:** [Diovanny Martins](https://linkedin.com/in/diovanny-martins)
- **E-mail:** diovannydev@gmail.com

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
