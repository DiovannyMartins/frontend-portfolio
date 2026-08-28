// Constantes das camadas de anti-spam do formulário de contato compartilhadas
// entre o frontend (js/) e o backend (server/). Estes valores são sentinelas
// públicos — aparecem no JavaScript do navegador e não são segredos.

// Honeytoken: campo escondido preenchido pelo JS no load. O servidor só aceita
// este valor exato; bots que não executam JS deixam o campo vazio (ou o
// autopreenchem com outro valor) e recebem sucesso simulado.
export const HONEYTOKEN_VALOR = "diovanny-portfolio";

// Tempo mínimo (ms) entre o render do formulário e o submit. A ausência do
// campo (JS desligado) não bloqueia — só o valor rápido é rejeitado.
export const FILL_TIME_MIN_MS = 3000;

// Limites das camadas de rate limit por chave. O par (janela, máximo) viaja
// junto: cada camada é um limite com uma janela de tempo.
export interface LimiteJanela {
  janelaMs: number;
  max: number;
}

export const LIMITE_EMAIL: LimiteJanela = { janelaMs: 15 * 60 * 1000, max: 3 };
export const LIMITE_DEDUPE: LimiteJanela = { janelaMs: 60 * 60 * 1000, max: 3 };
export const LIMITE_GLOBAL: LimiteJanela = { janelaMs: 15 * 60 * 1000, max: 20 };
