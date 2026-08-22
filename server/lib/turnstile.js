// Validação do token do Cloudflare Turnstile via siteverify.
// Funciona no Node e no Workers, pois usa apenas `fetch`.

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verificarTurnstile(token, secretKey) {
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

    const dados = await resposta.json();
    return dados.success === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
