// Anti-FOUC de idioma: redireciona para a preferência salva (localStorage
// "idioma") ou, na primeira visita de um navegador de verdade, para o idioma
// do navegador quando ele é inglês. Roda no <head> antes da renderização para
// evitar o "flash" do idioma errado.
//
// Crawlers que renderizam JS (Googlebot) reportam navigator.language en-US —
// se fossem redirecionados, o conteúdo EN seria indexado sob o canonical PT.
// Por isso o redirecionamento automático é ignorado para bots/automação; o
// default (/ em PT, /en/ em EN) é sempre o que o SEO vê.
(function () {
  function ehBot() {
    try {
      if (navigator.webdriver) return true;
      return /bot|crawl|spider|googlebot|bingbot|facebookexternalhit|twitterbot|yandex|slurp/i.test(
        navigator.userAgent,
      );
    } catch (_erro) {
      // Em caso de dúvida, trata como bot: não redireciona.
      return true;
    }
  }

  try {
    var paginaAtual = document.documentElement.lang.toLowerCase().startsWith("en") ? "/en/" : "/";
    var salvo = localStorage.getItem("idioma");

    if (salvo && salvo !== paginaAtual && location.pathname !== salvo) {
      location.replace(salvo + location.hash);
      return;
    }

    if (
      !salvo &&
      !ehBot() &&
      !paginaAtual.startsWith("/en") &&
      navigator.language.toLowerCase().startsWith("en")
    ) {
      location.replace("/en/" + location.hash);
    }
  } catch (_erro) {
    // Sem storage, segue no idioma da página atual.
  }
})();
