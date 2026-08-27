---
name: Diovanny.dev
description: Portfólio Full-Stack de Diovanny Martins — um editor de código escuro onde o trabalho fala.
colors:
  selection-indigo: "rgb(129, 140, 248)"
  neutral-bg: "rgb(30, 30, 30)"
  neutral-surface: "rgb(45, 45, 48)"
  neutral-control: "rgb(62, 62, 66)"
  ink: "rgb(255, 255, 255)"
  ink-muted: "rgb(203, 213, 225)"
  hairline: "rgba(255, 255, 255, 0.28)"
  success: "rgb(80, 200, 120)"
  error: "rgb(255, 130, 130)"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "50px"
    fontWeight: 800
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "35px"
    fontWeight: 900
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "20px"
    fontWeight: 900
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "13px"
    fontWeight: 400
rounded:
  sm: "10px"
  md: "15px"
  full: "50%"
spacing:
  xs: "10px"
  sm: "15px"
  md: "20px"
  lg: "30px"
  xl: "50px"
components:
  button-primary:
    backgroundColor: "{colors.neutral-control}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 15px"
  button-cta:
    backgroundColor: "{colors.neutral-control}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "15px 20px"
  chip-active:
    backgroundColor: "rgba(255, 255, 255, 0.25)"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 15px"
---

# Design System: Diovanny.dev

## Overview

**Creative North Star: "The Code Editor"**

O sistema visual é um editor de código em dark mode: um fundo neutro-escuro (`rgb(30, 30, 30)`), um único acento índigo reservado a foco e feedback, e a Inter — a fonte de UI por excelência — em toda parte. Não há ornamento; a identidade vem da precisão de ferramenta, não da decoração. O design serve ao conteúdo como um editor serve ao trabalho: ordenado, legível, sem distração.

A profundidade é majoritariamente plana, construída por três degraus tonais de cinza (`neutral-bg` → `neutral-surface` → `neutral-control`). A única elevação real é a das "janelas" — a mídia da hero e a janela `stack.ts` da seção Tecnologias — que flutuam com a mesma sombra longa; o glow branco suave responde ao hover dos controles. Sombra é destaque, não padrão.

O sistema alterna entre dark e light por `prefers-color-scheme` e persistência em `localStorage`. O dark é o estado canônico (definido em `:root`); o light inverte os tons mantendo a mesma gramática.

**Key Characteristics:**

- Fundo neutro-escuro de IDE (`rgb(30, 30, 30)`) com um único acento índigo.
- Inter (400–900) como única família tipográfica de UI; `ui-monospace` apenas como "voz de código" (barras de janela e trechos de código).
- Superfícies planas com três degraus tonais; sombra apenas como destaque.
- Raio de 15px dominante (controles, cards e janelas), 10px em inputs.
- Feedback de cor restrito a verde (sucesso) e vermelho (erro) em estados de formulário.

## Colors

Paleta monocromática de cinzas de interface sobre a qual um único índigo — a cor de seleção — marca foco e estados.

### Primary

- **Selection Indigo** (`rgb(129, 140, 248)`): o anel de foco acessível (`--focus-ring`), o cursor de digitação da hero, a barra de acento sob o título e a ação primária (CTA e submit). No light mode passa a `rgb(67, 56, 202)`. É o acento raro do sistema; sobre ele, o texto usa `--on-accent` (escuro no dark, branco no light).

### Neutral

- **Editor Base** (`rgb(30, 30, 30)`): fundo principal e do header/hero. No light mode vira `rgb(245, 245, 245)`.
- **Panel** (`rgb(45, 45, 48)`): fundo das seções alternadas (about, projects, footer), de inputs e do toast. No light mode vira `rgb(230, 230, 230)`.
- **Control** (`rgb(62, 62, 66)`): fundo de botões, chips de navegação, filtros e cards sociais. No light mode vira `rgb(210, 210, 215)`.
- **Ink** (`rgb(255, 255, 255)`): texto e ícones principais. No light mode vira `rgb(20, 20, 20)`.
- **Ink Muted** (`rgb(203, 213, 225)`): texto de parágrafo e placeholders. No light mode vira `rgb(60, 60, 60)`.
- **Hairline** (`rgba(255, 255, 255, 0.28)`): borda sutil do header e bordas de estado. No light mode vira `rgba(20, 20, 20, 0.24)`.

### Status

- **Success Green** (`rgb(80, 200, 120)`): validação válida e feedback de sucesso.
- **Error Red** (`rgb(255, 130, 130)`): validação inválida e mensagens de erro.

### Brand Marks (content)

Cores dos logos oficiais das tecnologias na janela `stack.ts` — tratadas como conteúdo (como as thumbnails dos projetos), nunca como acento de UI:

- **HTML5** `rgb(227, 79, 38)` · **CSS3** `rgb(21, 114, 182)` · **JavaScript** `rgb(247, 223, 30)` · **TypeScript** `rgb(49, 120, 198)` · **Node.js** `rgb(95, 160, 78)` · **Git** `rgb(240, 81, 51)`.
- No light mode, o amarelo do JavaScript escurece via `color-mix(in srgb, rgb(247, 223, 30) 55%, black)` para manter contraste.

### Named Rules

**The One Accent Rule.** O Selection Indigo marca quatro momentos: o anel de foco, o cursor de digitação, a barra de acento da hero e a ação primária (CTA/submit). Fora desses quatro, a interface é puro cinza. Sua raridade é o ponto.

## Typography

**Display Font:** Inter (com fallback `sans-serif`)
**Body Font:** Inter (com fallback `sans-serif`)

**Code Voice:** `ui-monospace, monospace` — a voz de "código" da interface (13px nas barras de janela, 15px nos trechos de código da hero e da janela `stack.ts`, 14px em mobile). Nunca usada em texto de UI; é o conteúdo do editor, não a interface.

**Character:** Uma única família, pesos 400–900, carregada com eixo variável (14–32 opsz). A hierarquia vem do peso e do tamanho, nunca de uma segunda fonte — a disciplina de uma ferramenta de software.

### Hierarchy

- **Display** (800, 50px, 1.15): o título da hero, com cursor de bloco índigo anexado (`::after`). 40px em telas ≤ 768px.
- **Headline** (900, 35px, normal): títulos de seção (`h2`).
- **Title** (900, 20px, normal): títulos de cards e subtítulos (`h3`).
- **Body** (400, 18px, 1.5): parágrafos, em `ink-muted`. 14px e line-height 20px em telas ≤ 768px.
- **Label** (400, 13px, normal): rodapé e mensagens de erro de campo.

## Layout

Página única com header fixo de ~80px (`scroll-margin-top` compensa âncoras). O conteúdo é um fluxo vertical de seções full-width que alternam entre `Editor Base` e `Panel`, cada uma centrada com `flex`/`grid`. A hero divide o espaço lado a lado (texto + imagem) em `space-evenly` e colapsa para uma coluna central na marca de 768px, ocultando a imagem. A seção Tecnologias centra uma janela de editor de `min(100%, 640px)`; a grade de projetos usa `minmax(min(100%, 300px), 1fr)`. Um breakpoint principal: 768px (mobile). O ritmo de espaçamento é 10 / 15 / 20 / 30 / 50px.

## Elevation & Depth

**Flat por padrão, com profundidade pontual.** A hierarquia nasce da alternância tonal de três degraus, não de sombras. Sombra e glow são reservados para dois momentos: a sombra longa das janelas (hero e Tecnologias) e o glow de resposta ao hover dos controles. Não há elevação estrutural (nenhum card "flutua" por padrão).

### Shadow Vocabulary

- **Window Float** (`box-shadow: 0 28px 70px -38px var(--shadow-dark)`): apenas nas janelas — a mídia da hero e a janela `stack.ts` de Tecnologias.
- **Hover Glow** (`box-shadow: 0 0 0.5em 0 rgba(255, 255, 255, 0.5)`): resposta padrão ao hover de botões, links de navegação e chips.
- **Toast Shadow** (`box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3)`): única sombra "levantada" real, no toast.

### Named Rules

**The Flat-By-Default Rule.** Superfícies são planas em repouso. Sombra aparece só como resposta a um estado (hover) ou como destaque deliberado (janelas). Nunca como padrão de todos os cards.

## Shapes

Forma arredondada e contida. O raio de 15px domina controles, cards e janelas; inputs usam 10px; o botão "voltar ao topo" é um círculo perfeito (50%). Bordas são sempre hairline de 1px quando existem. Nenhum recorte, silhueta ou geometria decorativa.

## Components

### Buttons

- **Shape:** raio 15px, sem borda.
- **Primary (ação principal):** fundo `Selection Indigo`, texto `--on-accent`, padding 15px 20px (CTA da hero) ou 12px 20px (submit). É o único botão colorido do sistema.
- **Secondary:** fundo `Control`, texto `Ink`, padding 10px 15px (navegação, filtros, links de projeto).
- **Hover / Focus:** hover levanta (`translateY(-0.25em)`) e acende (glow branco nos secundários, glow índigo no primário); foco usa o anel índigo global (`outline: 3px solid Selection Indigo`, offset 2px). Transições de 0.3s ease.
- **Disabled:** submit desabilitado reduz opacidade para 0.7 e troca o cursor para `wait`.

### Chips / Filtros

- **Style:** fundo `Control`, texto `Ink`, raio 15px, padding 10px 20px.
- **State:** ativo troca para `rgba(255, 255, 255, 0.25)` com glow (o mesmo padrão do link de navegação ativo). Estado comunicado por `aria-pressed`.

### Cards / Containers

- **Corner Style:** 15px (project-card e janelas).
- **Background:** `Editor Base` (cards ficam sobre o `Panel` da seção).
- **Project card:** abre com uma thumbnail de screenshot (`aspect-ratio: 16/10`, raio 10px, `object-fit: cover`) seguida de título, texto e link; plano e levanta no hover (`translateY(-5px)`).
- **Shadow Strategy:** project-card é plano; janelas carregam a `Window Float`.
- **Internal Padding:** 20px (project-card).

### Janela de Editor (stack.ts)

- **Style:** a seção Tecnologias é uma janela de editor idêntica em gramática à mídia da hero: fundo `Panel`, borda hairline, raio 15px, `Window Float`, `min(100%, 640px)`.
- **Bar:** 42px com aba `stack.ts` em `ui-monospace` 13px (`Ink`) e meta muted; borda inferior hairline — o mesmo chrome da hero.
- **Editor:** linhas de código numeradas (números muted, `user-select: none`); linhas decorativas `const stack = [` / `];` são `aria-hidden`; cada tecnologia é uma linha com o logo oficial em SVG inline (22px, cor da marca — o único colorido do sistema, tratado como conteúdo, não como acento) + nome em mono 500 `Ink` + vírgula muted.
- **Hover:** a linha acende com highlight neutro translúcido (`--glow-faint`), como seleção de linha de editor.
- **Temas:** cores de marca fixas; no light mode o amarelo do JavaScript escurece via `color-mix` para manter contraste.

### Inputs / Fields

- **Style:** fundo `Panel`, texto `Ink`, borda 1px `Control`, raio 10px, padding 12px 15px.
- **Focus:** borda `rgba(255,255,255,0.7)` e anel `box-shadow: 0 0 0 3px` suave.
- **Valid / Invalid:** borda verde/vermelha com anel em `color-mix(..., 20%, transparent)`; mensagem de erro em 13px `Error Red` com `aria-live`.

### Navigation

- **Style:** header fixo com borda inferior hairline; links de navegação em chips (`Control`, raio 15px). Link ativo destacado por fundo translúcido. Em telas ≤ 768px vira um painel full-screen deslizante com hambúrguer animado (três barras → X).

### Toast (componente de assinatura)

- **Style:** caixa flutuante no canto inferior direito (fundo `Panel`, raio 12px, borda `Control`, `Toast Shadow`), com ícone circular verde de confirmação. Aparece com `translateY(20px) scale(0.9) → 0/1` e desliza para um banner full-width em mobile.

### Botão Voltar ao Topo

- **Style:** círculo de 50px (`Control`, raio 50%), fixo no canto inferior direito, que faz fade + escala ao entrar/ sair conforme o scroll.

## Do's and Don'ts

### Do:

- **Do** usar o Selection Indigo apenas no foco, no cursor de digitação, na barra de acento da hero e na ação primária (CTA/submit) — nunca como preenchimento decorativo.
- **Do** construir hierarquia com os três degraus tonais (`Editor Base`, `Panel`, `Control`).
- **Do** usar raio 15px em controles, cards e janelas; 10px em inputs.
- **Do** abrir os cards de projeto com uma thumbnail real do trabalho (nunca um placeholder decorativo).
- **Do** manter Inter como única família; varie peso (400–900) e tamanho, não a fonte.
- **Do** levantar e acender controles no hover (`translateY` + glow), com 0.3s ease.

### Don't:

- **Don't** introduzir uma segunda cor de acento ou qualquer paleta "colorida" além do índigo — cor de marca só nos logos-SVG das tecnologias, como conteúdo.
- **Don't** usar sombra neumórfica ou sombras estruturais em cards; elevação só nas janelas (hero e Tecnologias) e no toast.
- **Don't** dar sombras estruturais a cards comuns; a superfície é plana em repouso.
- **Don't** usar raios maiores que 15px em cards e janelas, nem quebrar a escala 10/15/50%.
- **Don't** usar `ui-monospace` fora das janelas/código — a voz de código nunca vira voz de UI.
