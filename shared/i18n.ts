// Dicionário de traduções PT/EN do site. Fonte única consumida por:
// - scripts/gerar-pagina-en.js (gera dist/en/index.html a partir do index.html)
// - js/i18n.ts (strings dinâmicas em runtime)
// - server (mensagens do formulário, escolhidas pelo header x-lang)
//
// O texto em PT do index.html também fica inline no HTML (funciona sem JS e é
// o default de SEO); as chaves deste dicionário são o canônico das traduções.

export type Idioma = "pt" | "en";

// Header usado pelo formulário para avisar o idioma ao backend (mensagens de
// validação/erro no idioma do visitante). Nome único: renomeá-lo toca
// frontend + backend + testes.
export const HEADER_IDIOMA = "x-lang";

export type ChaveTraducao = keyof (typeof traducoes)["pt"];

// Conjunto de mensagens de um idioma, alargado para string (os valores são
// literais via `as const`; consumidores querem apenas o formato das chaves).
export type Mensagens = Record<ChaveTraducao, string>;

export const traducoes = {
  pt: {
    // Head / SEO
    titulo: "Diovanny Martins | Desenvolvedor Full-Stack",
    descricao:
      "Portfólio de Diovanny Martins, desenvolvedor Full-Stack especializado em HTML5, CSS3, JavaScript e Node.js. Confira meus projetos e entre em contato.",
    ogDescricao:
      "Portfólio de Diovanny Martins, desenvolvedor Full-Stack especializado em HTML5, CSS3, JavaScript e Node.js.",
    ogLocale: "pt_BR",
    // Cabeçalho
    navegacaoPrincipal: "Navegação principal",
    pularParaConteudo: "Pular para o conteúdo principal",
    paginaInicial: "Diovanny.dev - Página inicial",
    logoAlt: "Logo Diovanny.dev",
    navHome: "Home",
    navSobre: "Sobre",
    navTecnologias: "Tecnologias",
    navProjetos: "Projetos",
    navContato: "Contato",
    ativarTemaEscuro: "Ativar tema escuro",
    ativarTemaClaro: "Ativar tema claro",
    temaEscuro: "Tema escuro",
    temaClaro: "Tema claro",
    abrirMenu: "Abrir menu",
    fecharMenu: "Fechar menu",
    // Hero
    heroTitulo: "Desenvolvedor Full-Stack",
    heroTexto:
      "Desenvolvendo aplicações web modernas, responsivas e eficientes, do front-end ao back-end.",
    verProjetos: "Ver Projetos",
    heroImagemAlt: "Tela de computador com código-fonte de uma aplicação web",
    // Sobre
    sobreTitulo: "Sobre mim",
    sobreTexto:
      "Olá, eu sou o Diovanny, Desenvolvedor Full-Stack focado na criação de aplicações web modernas, responsivas e funcionais. Trabalho desde a construção de interfaces intuitivas até o desenvolvimento de back-ends eficientes e bem estruturados, utilizando tecnologias como HTML, CSS, JavaScript e Node.js. Busco unir boa experiência do usuário, código organizado e soluções que possam evoluir junto com o projeto.",
    // Tecnologias
    tecnologiasTitulo: "Minhas Tecnologias",
    stackTab: "stack.ts",
    stackMeta: "• 6 tecnologias",
    // Projetos
    projetosTitulo: "Meus Projetos",
    projetosSubtitulo:
      "Confira abaixo alguns dos trabalhos que desenvolvi utilizando HTML5, CSS3 e JavaScript.",
    filtroTodos: "Todos",
    filtroDashboard: "Dashboard",
    filtroLanding: "Landing Page",
    filtroEcommerce: "E-commerce",
    buscarProjetos: "Buscar projetos",
    buscarProjetosPlaceholder: "Buscar projetos...",
    projeto1Titulo: "Business Dashboard",
    projeto1Texto:
      "Painel corporativo com sidebar de navegação, cards de métricas e gráficos — organiza dados de negócio em uma visão única e escaneável.",
    projeto1Alt: "Prévia do Business Dashboard",
    projeto2Titulo: "SaaS Landing Page",
    projeto2Texto:
      "Landing page de produto com hero, seção de features, pricing e CTA — conduz o visitante da atenção à ação com hierarquia clara.",
    projeto2Alt: "Prévia da SaaS Landing Page",
    projeto3Titulo: "Modern E-commerce",
    projeto3Texto:
      "Loja virtual com grade de produtos, cards de item e página de produto — apresenta o catálogo de forma rápida de percorrer e comparar.",
    projeto3Alt: "Prévia do Modern E-commerce",
    projeto4Titulo: "Admin Dashboard",
    projeto4Texto:
      "Painel de gerenciamento com sidebar, cards informativos e interface responsiva — concentra controles e indicadores em um só lugar.",
    projeto4Alt: "Prévia do Admin Dashboard",
    acessarProjeto: "Acessar Projeto",
    projetosVazio: "Nenhum projeto encontrado. Tente outro termo ou limpe o filtro.",
    // Contato
    contatoTitulo: "Contato",
    contatoTexto: "Entre em contato comigo pelas redes sociais ou pelo formulário abaixo:",
    labelNome: "Nome",
    labelEmail: "E-mail",
    labelMensagem: "Mensagem",
    placeholderNome: "Ex.: Maria Silva",
    placeholderEmail: "Ex.: maria@email.com",
    placeholderMensagem: "Ex.: Olá, gostaria de conversar sobre um projeto.",
    honeypotLabel: "Deixe este campo em branco",
    honeytokenLabel: "Assunto",
    turnstileAria: "Verificação de segurança",
    enviarMensagem: "Enviar Mensagem",
    redesSociais: "Redes sociais",
    visitarGitHub: "Visitar perfil no GitHub",
    copiarEnderecoEmail: "Copiar endereço de e-mail",
    copiarEmail: "Copiar E-mail",
    // Rodapé
    footerDireitos: "Diovanny.dev - Todos os direitos reservados",
    voltarTopo: "Voltar ao topo da página",
    // Strings dinâmicas (JS)
    nomeObrigatorio: "Digite seu nome completo.",
    emailInvalido: "Digite um e-mail válido.",
    mensagemMinima: "Escreva uma mensagem com pelo menos 10 caracteres.",
    captchaFalhou:
      "Não foi possível carregar o verificador de segurança (captcha). Se você usa bloqueador de anúncios, desative-o e recarregue a página.",
    captchaPendente: "Complete o desafio de segurança antes de enviar.",
    enviando: "Enviando...",
    envioInativo:
      'O envio online não está ativo nesta hospedagem. Teste com "npm run dev:all" ou copie meu e-mail abaixo.',
    envioSucesso: "Mensagem enviada com sucesso! Em breve entrarei em contato.",
    envioLento: "O envio demorou demais. Verifique sua conexão e tente novamente.",
    envioFalha: "Não foi possível enviar. Verifique sua conexão e tente novamente.",
    copiado: "Copiado!",
    emailCopiado: "E-mail copiado com sucesso!",
    erroCopiar: "Erro ao copiar e-mail. Tente novamente.",
    // Mensagens do servidor (formulário)
    nomeCurto: "Informe seu nome completo.",
    nomeMax: "O nome deve ter no máximo 100 caracteres.",
    nomeControle: "O nome contém caracteres inválidos.",
    emailMax: "O e-mail deve ter no máximo 254 caracteres.",
    emailInvalidoServidor: "Informe um e-mail válido.",
    emailControle: "O e-mail contém caracteres inválidos.",
    mensagemMin: "A mensagem deve ter pelo menos 10 caracteres.",
    mensagemMax: "A mensagem deve ter no máximo 5.000 caracteres.",
    mensagemControle: "A mensagem contém caracteres inválidos.",
    limiteMensagem: "Muitas tentativas de envio. Aguarde alguns minutos.",
    contentType: "Content-Type deve ser application/json.",
    mensagemGrande: "Mensagem muito grande.",
    jsonInvalido: "JSON inválido.",
    servicoIndisponivel: "Serviço de contato indisponível.",
    sucessoEnvio: "Mensagem enviada com sucesso!",
    turnstileFalha: "Falha na verificação de segurança. Tente novamente.",
    envioFalhou500: "Não foi possível enviar a mensagem agora. Tente novamente em instantes.",
    origemNaoPermitida: "Origem não permitida.",
  },
  en: {
    titulo: "Diovanny Martins | Full-Stack Developer",
    descricao:
      "Portfolio of Diovanny Martins, a Full-Stack developer specialized in HTML5, CSS3, JavaScript and Node.js. Check out my projects and get in touch.",
    ogDescricao:
      "Portfolio of Diovanny Martins, a Full-Stack developer specialized in HTML5, CSS3, JavaScript and Node.js.",
    ogLocale: "en_US",
    navegacaoPrincipal: "Main navigation",
    pularParaConteudo: "Skip to main content",
    paginaInicial: "Diovanny.dev - Homepage",
    logoAlt: "Diovanny.dev logo",
    navHome: "Home",
    navSobre: "About",
    navTecnologias: "Tech",
    navProjetos: "Projects",
    navContato: "Contact",
    ativarTemaEscuro: "Enable dark theme",
    ativarTemaClaro: "Enable light theme",
    temaEscuro: "Dark theme",
    temaClaro: "Light theme",
    abrirMenu: "Open menu",
    fecharMenu: "Close menu",
    heroTitulo: "Full-Stack Developer",
    heroTexto:
      "Building modern, responsive and efficient web applications, from front-end to back-end.",
    verProjetos: "View Projects",
    heroImagemAlt: "Computer screen with the source code of a web application",
    sobreTitulo: "About me",
    sobreTexto:
      "Hi, I'm Diovanny, a Full-Stack Developer focused on building modern, responsive and functional web applications. I work from crafting intuitive interfaces to developing efficient, well-structured back-ends, using technologies like HTML, CSS, JavaScript and Node.js. I aim to combine a great user experience, organized code and solutions that can evolve with the project.",
    tecnologiasTitulo: "My Tech Stack",
    stackTab: "stack.ts",
    stackMeta: "• 6 technologies",
    projetosTitulo: "My Projects",
    projetosSubtitulo: "Below are some of the projects I built using HTML5, CSS3 and JavaScript.",
    filtroTodos: "All",
    filtroDashboard: "Dashboard",
    filtroLanding: "Landing Page",
    filtroEcommerce: "E-commerce",
    buscarProjetos: "Search projects",
    buscarProjetosPlaceholder: "Search projects...",
    projeto1Titulo: "Business Dashboard",
    projeto1Texto:
      "Corporate dashboard with a navigation sidebar, metric cards and charts — organizing business data into a single scannable view.",
    projeto1Alt: "Business Dashboard preview",
    projeto2Titulo: "SaaS Landing Page",
    projeto2Texto:
      "Product landing page with hero, features, pricing and CTA sections — guiding the visitor from attention to action with clear hierarchy.",
    projeto2Alt: "SaaS Landing Page preview",
    projeto3Titulo: "Modern E-commerce",
    projeto3Texto:
      "Online store with a product grid, item cards and product page — presenting the catalog in a way that's fast to browse and compare.",
    projeto3Alt: "Modern E-commerce preview",
    projeto4Titulo: "Admin Dashboard",
    projeto4Texto:
      "Management dashboard with sidebar, informative cards and responsive interface — keeping controls and metrics in one place.",
    projeto4Alt: "Admin Dashboard preview",
    acessarProjeto: "View Project",
    projetosVazio: "No projects found. Try another term or clear the filter.",
    contatoTitulo: "Contact",
    contatoTexto: "Get in touch with me through social media or the form below:",
    labelNome: "Name",
    labelEmail: "Email",
    labelMensagem: "Message",
    placeholderNome: "e.g. Maria Silva",
    placeholderEmail: "e.g. maria@email.com",
    placeholderMensagem: "e.g. Hi, I'd like to talk about a project.",
    honeypotLabel: "Leave this field blank",
    honeytokenLabel: "Subject",
    turnstileAria: "Security verification",
    enviarMensagem: "Send Message",
    redesSociais: "Social media",
    visitarGitHub: "Visit GitHub profile",
    copiarEnderecoEmail: "Copy email address",
    copiarEmail: "Copy Email",
    footerDireitos: "Diovanny.dev - All rights reserved",
    voltarTopo: "Back to top",
    nomeObrigatorio: "Enter your full name.",
    emailInvalido: "Enter a valid email address.",
    mensagemMinima: "Write a message with at least 10 characters.",
    captchaFalhou:
      "Could not load the security checker (captcha). If you use an ad blocker, disable it and reload the page.",
    captchaPendente: "Complete the security challenge before sending.",
    enviando: "Sending...",
    envioInativo:
      'Online submission is not active on this hosting. Try "npm run dev:all" or copy my email below.',
    envioSucesso: "Message sent successfully! I'll get back to you soon.",
    envioLento: "The submission took too long. Check your connection and try again.",
    envioFalha: "Could not send. Check your connection and try again.",
    copiado: "Copied!",
    emailCopiado: "Email copied successfully!",
    erroCopiar: "Failed to copy email. Try again.",
    nomeCurto: "Enter your full name.",
    nomeMax: "Name must be at most 100 characters.",
    nomeControle: "Name contains invalid characters.",
    emailMax: "Email must be at most 254 characters.",
    emailInvalidoServidor: "Enter a valid email address.",
    emailControle: "Email contains invalid characters.",
    mensagemMin: "Message must be at least 10 characters.",
    mensagemMax: "Message must be at most 5,000 characters.",
    mensagemControle: "Message contains invalid characters.",
    limiteMensagem: "Too many submission attempts. Wait a few minutes.",
    contentType: "Content-Type must be application/json.",
    mensagemGrande: "Message too large.",
    jsonInvalido: "Invalid JSON.",
    servicoIndisponivel: "Contact service unavailable.",
    sucessoEnvio: "Message sent successfully!",
    turnstileFalha: "Security verification failed. Try again.",
    envioFalhou500: "Could not send the message right now. Try again in a moment.",
    origemNaoPermitida: "Origin not allowed.",
  },
} as const;

// Escolhe o idioma a partir de um valor que comece com "en" (header x-lang,
// navigator.language, atributo lang). Qualquer outra coisa cai em pt.
export function idiomaPorPrefixo(valor: string | undefined | null): Idioma {
  return valor?.toLowerCase().startsWith("en") ? "en" : "pt";
}
