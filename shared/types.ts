// Tipos compartilhados entre frontend, servidor Node e Cloudflare Pages Functions.
// Nenhum valor real de variável de ambiente ou secret deve aparecer aqui.

export interface AppEnv {
  PORT?: string;
  NODE_ENV?: string;
  CONTEXT?: string;
  CF_PAGES?: string;
  TRUST_PROXY?: string;
  FRONTEND_ORIGIN?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  EMAIL_DESTINO?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_HOSTNAMES?: string;
  TURNSTILE_ACTION?: string;
  LOG_EMAIL_FALLBACK?: string;
}

export interface AppConfig {
  isProduction: boolean;
  trustProxy: boolean;
  productionReady: boolean;
  allowedOrigins: string[];
  resend: {
    apiKey?: string;
    from?: string;
  };
  emailDestino?: string;
  turnstile: {
    secretKey?: string;
    expectedHostnames: string[];
    expectedAction: string;
  };
  logEmailFallback: boolean;
}

// Dados brutos do corpo do formulário (valores ainda não validados).
export interface ContatoPayload {
  nome?: unknown;
  email?: unknown;
  mensagem?: unknown;
  website?: unknown;
  turnstile?: unknown;
}

// Dados já normalizados e validados, prontos para o envio de e-mail.
export interface ContatoDados {
  nome: string;
  email: string;
  mensagem: string;
}

export interface ErrosContato {
  nome?: string;
  email?: string;
  mensagem?: string;
}

export interface ResultadoValidacao {
  valido: boolean;
  erros: ErrosContato;
  dados: ContatoDados;
}

export type RespostaContato =
  | { success: true; message: string }
  | { success: false; error: string }
  | { success: false; errors: ErrosContato };
