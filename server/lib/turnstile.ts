// Validação do token do Cloudflare Turnstile via siteverify.
// Funciona no Node e no Workers, pois usa apenas `fetch`.

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface OpcoesVerificacaoTurnstile {
  expectedHostnames?: string[];
  expectedAction?: string;
}

interface RespostaSiteverify {
  success?: unknown;
  hostname?: unknown;
  action?: unknown;
}

// O corpo do siteverify vem de uma API externa: só confia nele após
// confirmar que é um objeto (a validação de cada campo segue abaixo).
function ehObjeto(dados: unknown): dados is RespostaSiteverify {
  return typeof dados === "object" && dados !== null && !Array.isArray(dados);
}

export async function verificarTurnstile(
  token: string,
  secretKey: string | undefined,
  options: OpcoesVerificacaoTurnstile = {},
): Promise<boolean> {
  if (!token || !secretKey) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const resposta = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: secretKey, response: token }),
      signal: controller.signal,
    });

    if (!resposta.ok) return false;

    const dados: unknown = await resposta.json();
    if (!ehObjeto(dados)) return false;
    if (dados.success !== true) return false;

    const hostnames = options.expectedHostnames || [];
    if (hostnames.length && !hostnames.includes(String(dados.hostname).toLowerCase())) {
      return false;
    }

    if (options.expectedAction && dados.action !== options.expectedAction) return false;

    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
