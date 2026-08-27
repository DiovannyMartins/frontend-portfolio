// Tipagem mínima da API pública do Cloudflare Turnstile usada pelo projeto.
// window.turnstile é opcional: o script pode não carregar (bloqueador/rede).
interface TurnstileRenderOptions {
  sitekey: string;
  action?: string;
  theme?: "auto" | "light" | "dark";
  appearance?: "always" | "execute" | "interaction-only";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId: string) => void;
}

interface Window {
  turnstile?: TurnstileApi;
}
