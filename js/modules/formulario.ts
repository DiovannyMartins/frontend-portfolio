import { validarEmail } from "../../shared/validacao.ts";
import type { ErrosContato, RespostaContato } from "../../shared/types.ts";

type CampoEditavel = HTMLInputElement | HTMLTextAreaElement;

interface ConfiguracaoCampo {
  campo: CampoEditavel;
  erro: HTMLElement;
  validador: (valor: string) => boolean;
  msgErro: string;
}

type EstadoTurnstile = "carregando" | "ok" | "falha";

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function ehErrosContato(valor: unknown): valor is ErrosContato {
  if (!ehObjeto(valor)) return false;

  return ["nome", "email", "mensagem"].every((campo) => {
    const mensagem = valor[campo];
    return mensagem === undefined || typeof mensagem === "string";
  });
}

function ehRespostaContato(valor: unknown): valor is RespostaContato {
  if (!ehObjeto(valor)) return false;
  return (
    (valor.success === true && typeof valor.message === "string") ||
    (valor.success === false && typeof valor.error === "string") ||
    (valor.success === false && ehErrosContato(valor.errors))
  );
}

export function initFormulario() {
  const form = document.querySelector<HTMLFormElement>("#formContato");
  const feedbackForm = document.getElementById("feedbackForm");
  if (!form || !feedbackForm) return;

  const campoNome = document.querySelector<HTMLInputElement>("#nome");
  const campoEmail = document.querySelector<HTMLInputElement>("#email");
  const campoMensagem = document.querySelector<HTMLTextAreaElement>("#mensagem");
  const campoWebsite = document.querySelector<HTMLInputElement>("#website");
  const widgetTurnstile = document.getElementById("turnstile");

  // Cloudflare Turnstile: renderizado explicitamente para ter o widgetId
  // (permite resetar o token após cada tentativa de envio). A sitekey vem
  // do atributo data-sitekey no HTML — é pública, não é segredo.
  let turnstileId: string | null = null;
  let tokenTurnstile = "";
  // Estado do widget Turnstile: "carregando" (script ainda não carregou),
  // "ok" (renderizado) ou "falha" (bloqueado/rede/domínio não autorizado).
  let estadoTurnstile: EstadoTurnstile = "carregando";

  // Em produção o servidor exige o token do Turnstile; em dev/preview não.
  // Usado para mostrar uma mensagem clara quando o captcha não carrega
  // (bloqueador de anúncios, rede) em vez de falhar silenciosamente no servidor.
  // `import.meta.env.PROD` é fornecido pelo Vite (true no build, false no dev).
  // O código-fonte TypeScript passa sempre pelo Vite; apenas o `dist/` gerado
  // (JavaScript) pode ser servido como site estático. O `?.` só protege o
  // acesso caso o objeto `import.meta.env` não exista.
  const PRODUCAO = import.meta.env?.PROD ?? false;

  function renderizarTurnstile() {
    if (!widgetTurnstile || typeof window.turnstile === "undefined") {
      estadoTurnstile = "falha";
      return;
    }
    const sitekey = widgetTurnstile.dataset.sitekey;
    if (!sitekey) {
      estadoTurnstile = "falha";
      return;
    }

    try {
      turnstileId = window.turnstile.render(widgetTurnstile, {
        sitekey,
        theme: "auto",
        appearance: "always",
        action: widgetTurnstile.dataset.action || undefined,
        callback: (token) => {
          tokenTurnstile = token;
        },
        "expired-callback": () => {
          tokenTurnstile = "";
        },
        "error-callback": () => {
          tokenTurnstile = "";
          estadoTurnstile = "falha";
        },
      });

      estadoTurnstile = "ok";
    } catch {
      estadoTurnstile = "falha";
    }
  }

  // O script do Turnstile é carregado de forma síncrona no <head> e o objeto
  // window.turnstile ganha a API (render) gradualmente. Como o evento
  // "turnstile-loaded" pode disparar antes deste módulo rodar, usa-se um
  // polling leve até a API estar disponível (desiste após 10s). Se desistir
  // sem renderizar, estadoTurnstile vira "falha" e o submit avisa em produção.
  function tentarRenderizarTurnstile() {
    if (!PRODUCAO) {
      estadoTurnstile = "ok";
      return;
    }

    if (typeof window.turnstile?.render === "function") {
      renderizarTurnstile();
      return;
    }

    const timer = setInterval(() => {
      if (typeof window.turnstile?.render === "function") {
        clearInterval(timer);
        renderizarTurnstile();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(timer);
      if (estadoTurnstile === "carregando") {
        estadoTurnstile = "falha";
      }
    }, 10000);
  }

  tentarRenderizarTurnstile();

  // Única fonte de regras de validação: os listeners de "input" (validação em
  // tempo real) e o submit (validação completa) usam a mesma função avaliarCampo.
  const configuracaoBruta: Array<{
    campo: CampoEditavel | null;
    erro: HTMLElement | null;
    validador: (valor: string) => boolean;
    msgErro: string;
  }> = [
    {
      campo: campoNome,
      erro: document.getElementById("erroNome"),
      validador: (valor) => valor.length >= 3,
      msgErro: "Digite seu nome completo.",
    },
    {
      campo: campoEmail,
      erro: document.getElementById("erroEmail"),
      validador: (valor) => validarEmail(valor),
      msgErro: "Digite um e-mail válido.",
    },
    {
      campo: campoMensagem,
      erro: document.getElementById("erroMensagem"),
      validador: (valor) => valor.length >= 10,
      msgErro: "Escreva uma mensagem com pelo menos 10 caracteres.",
    },
  ];

  const CAMPOS: ConfiguracaoCampo[] = configuracaoBruta.filter(
    (item): item is ConfiguracaoCampo => item.campo !== null && item.erro !== null,
  );

  const FEEDBACK_DURACAO_MS = 5000;
  let feedbackTimer: number | undefined;

  function marcarErro(campo: CampoEditavel, elementoErro: HTMLElement, mensagem: string) {
    campo.classList.add("input--invalid");
    campo.classList.remove("input--valid");
    campo.setAttribute("aria-invalid", "true");
    elementoErro.textContent = mensagem;
  }

  function limparErro(campo: CampoEditavel, elementoErro: HTMLElement) {
    campo.classList.remove("input--invalid");
    campo.removeAttribute("aria-invalid");
    elementoErro.textContent = "";
  }

  function marcarValido(campo: CampoEditavel) {
    campo.classList.add("input--valid");
    campo.classList.remove("input--invalid");
    campo.setAttribute("aria-invalid", "false");
  }

  // Estratégia de UX: campo vazio = neutro (sem borda colorida), campo
  // preenchido e inválido = vermelho, campo preenchido e válido = verde.
  // Assim o usuário não vê erros antes mesmo de interagir com o campo.
  // No submit, `forcarErro` marca os campos obrigatórios vazios como erro.
  function avaliarCampo(
    { campo, erro, validador, msgErro }: ConfiguracaoCampo,
    { forcarErro = false }: { forcarErro?: boolean } = {},
  ): boolean {
    const valor = campo.value.trim();

    if (valor.length === 0) {
      if (forcarErro) {
        marcarErro(campo, erro, msgErro);
      } else {
        limparErro(campo, erro);
        campo.classList.remove("input--valid");
      }
      return false;
    }

    if (validador(valor)) {
      marcarValido(campo);
      limparErro(campo, erro);
      return true;
    }

    marcarErro(campo, erro, msgErro);
    return false;
  }

  CAMPOS.forEach(({ campo, erro, validador, msgErro }) => {
    campo.addEventListener("input", () => {
      avaliarCampo({ campo, erro, validador, msgErro });
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearTimeout(feedbackTimer);
    feedbackForm.textContent = "";
    feedbackForm.classList.remove("contact__feedback--error");

    const formValido = CAMPOS.every((item) => avaliarCampo(item, { forcarErro: true }));

    if (!formValido) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    // Turnstile: se o widget renderizou, exige o token resolvido. Se a
    // biblioteca falhou ao carregar (bloqueador/rede/domínio), em produção
    // avisa na hora em vez de enviar sem token e receber erro 400 do servidor.
    if (PRODUCAO && estadoTurnstile !== "ok") {
      feedbackForm.classList.add("contact__feedback--error");
      feedbackForm.textContent =
        "Não foi possível carregar o verificador de segurança (captcha). " +
        "Se você usa bloqueador de anúncios, desative-o e recarregue a página.";
      return;
    }

    if (PRODUCAO && !tokenTurnstile) {
      feedbackForm.classList.add("contact__feedback--error");
      feedbackForm.textContent = "Complete o desafio de segurança antes de enviar.";
      widgetTurnstile?.focus?.();
      return;
    }

    const botaoEnviar = form.querySelector<HTMLButtonElement>(".contact__submit");
    if (!botaoEnviar) return;
    const textoOriginal = botaoEnviar.textContent;
    botaoEnviar.disabled = true;
    form.setAttribute("aria-busy", "true");
    botaoEnviar.textContent = "Enviando...";

    const controller = new AbortController();
    const TIMEOUT_ENVIO_MS = 10000;
    const timerEnvio = setTimeout(() => controller.abort(), TIMEOUT_ENVIO_MS);

    try {
      // Checa se a API está ativa antes de enviar. Em hospedagem estática
      // sem backend não há API: avisa e evita o POST 405.
      const health = await fetch("/api/health", { signal: controller.signal });
      if (!health.ok) {
        feedbackForm.classList.add("contact__feedback--error");
        feedbackForm.textContent =
          'O envio online não está ativo nesta hospedagem. Teste com "npm run dev:all" ou copie meu e-mail abaixo.';
        return;
      }

      const resposta = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: campoNome?.value.trim() ?? "",
          email: campoEmail?.value.trim() ?? "",
          mensagem: campoMensagem?.value.trim() ?? "",
          website: campoWebsite?.value ?? "",
          turnstile: tokenTurnstile,
        }),
        signal: controller.signal,
      });

      const ehJson = resposta.headers.get("content-type")?.includes("application/json");
      const dados: unknown = ehJson
        ? await resposta.json().catch((erro) => {
            if (controller.signal.aborted) throw erro;
            return {};
          })
        : {};

      if (resposta.ok) {
        feedbackForm.textContent = "Mensagem enviada com sucesso! Em breve entrarei em contato.";
        form.reset();
        CAMPOS.forEach(({ campo }) => campo.classList.remove("input--valid"));
      } else if (ehJson && ehRespostaContato(dados) && "errors" in dados) {
        feedbackForm.classList.add("contact__feedback--error");
        feedbackForm.textContent = Object.values(dados.errors).join(" ");
      } else if (ehJson && ehRespostaContato(dados) && "error" in dados) {
        feedbackForm.classList.add("contact__feedback--error");
        feedbackForm.textContent = dados.error;
      } else {
        // Resposta não-JSON (404/405 do próprio servidor estático) significa
        // que o backend não está ativo nesta origem — ex.: hospedagem estática do dist sem Pages Functions.
        feedbackForm.classList.add("contact__feedback--error");
        feedbackForm.textContent =
          'O envio online não está ativo nesta hospedagem. Teste com "npm run dev:all" ou copie meu e-mail abaixo.';
      }
    } catch {
      if (controller.signal.aborted) {
        feedbackForm.classList.add("contact__feedback--error");
        feedbackForm.textContent =
          "O envio demorou demais. Verifique sua conexão e tente novamente.";
      } else {
        feedbackForm.classList.add("contact__feedback--error");
        feedbackForm.textContent =
          "Não foi possível enviar. Verifique sua conexão e tente novamente.";
      }
    } finally {
      clearTimeout(timerEnvio);
      botaoEnviar.disabled = false;
      form.removeAttribute("aria-busy");
      botaoEnviar.textContent = textoOriginal;

      // O token do Turnstile é de uso único: após cada tentativa (sucesso ou
      // erro) reseta o widget para gerar um token novo no próximo envio.
      if (turnstileId !== null && window.turnstile) {
        window.turnstile.reset(turnstileId);
      }
      tokenTurnstile = "";

      feedbackTimer = setTimeout(() => {
        feedbackForm.textContent = "";
      }, FEEDBACK_DURACAO_MS);
    }
  });
}
