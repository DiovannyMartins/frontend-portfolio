# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recrutadores e empresas (avaliando o perfil para uma vaga ou contratação) e clientes de trabalhos freelancer (buscando alguém para um projeto específico). Ambos visitam a partir de um link (GitHub, aplicação de vaga ou indicação), percorrem as seções e decidem se entram em contato.

## Product Purpose

Portfólio pessoal que apresenta Diovanny Martins, seu trabalho, suas tecnologias e uma forma de contato. Sucesso significa o visitante entender rapidamente quem ele é e o que faz, ver projetos reais e conseguir contatá-lo sem atrito.

## Positioning

Desenvolvedor Full-Stack de fato: front-end e back-end com o mesmo peso, entregando aplicações web modernas, responsivas e funcionais — de interfaces intuitivas (HTML, CSS, JavaScript) a back-ends eficientes e bem estruturados (Node.js, Hono).

## Operating Context

O visitante navega por uma única página (one-page) em pt-BR, nas seções Home, Sobre, Tecnologias, Projetos e Contato. Avalia o trabalho pelos projetos linkados (hospedados em GitHub Pages) e inicia contato pelo formulário ou pelas redes sociais. O site roda em Cloudflare Pages no domínio próprio diovanny.dev, com a API do formulário no mesmo domínio.

## Capabilities and Constraints

- JavaScript Vanilla (ES Modules, sem framework de runtime); Vite apenas como dev server/build.
- Backend Hono para o formulário de contato (validação server-side, rate limit, honeypot, Cloudflare Turnstile, envio por Resend com modo log em dev).
- Dark/Light mode persistido via localStorage com anti-FOUC.
- Acessibilidade como requisito (ARIA, skip link, focus visible, navegação por teclado, aria-live nos erros).
- Responsivo, SEO (sitemap, robots.txt, Open Graph, Twitter Card), imagens WebP com lazy loading.
- Testes automatizados da API com `node --test`; ESLint + Prettier.
- Seções: Home (hero com efeito de digitação), Sobre, Tecnologias (HTML5, CSS3, JavaScript, Node.js), Projetos (filtro por categoria e busca), Contato (formulário + redes sociais).
- Categorias de projetos: Dashboard, Landing Page, E-commerce.

## Brand Commitments

- Nome: Diovanny Martins — Desenvolvedor Full-Stack.
- Marca/identidade: "Diovanny.dev".
- E-mail: diovannydev@gmail.com.
- Links: GitHub @DiovannyMartins e domínio diovanny.dev.
- Licença MIT.

## Evidence on Hand

- Quatro projetos reais linkados (GitHub Pages): Business Dashboard, SaaS Landing Page, Modern E-commerce, Admin Dashboard.
- Não há testemunhos, métricas, cases de sucesso ou logos de clientes — nada disso deve ser inventado.

## Product Principles

- Mostrar trabalho real: os projetos linkados são a prova; o site é a vitrine, não o claim.
- Full-stack sem divisão: front-end e back-end são tratados com o mesmo rigor e aparecem igualmente.
- Acessibilidade e performance não são extras: são parte da qualidade do trabalho apresentado.
- Código organizado e testável como argumento: a própria estrutura do portfólio demonstra o padrão de engenharia.
- Foco no contato: o objetivo final de cada visita é facilitar uma conversa.

## Accessibility & Inclusion

- Conteúdo em pt-BR.
- ARIA labels, skip link, navegação por teclado, foco visível customizado e feedback com aria-live.
- Imagens com alt text e dark/light mode para preferência de esquema de cores.
