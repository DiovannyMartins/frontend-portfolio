// Camadas extras de anti-spam do formulário, além do rate limit por IP
// (middleware em app.ts) e do honeypot `website`:
//
// - Limite por e-mail do remetente (3 / 15 min)
// - Dedupe de conteúdo (máx. 3 cópias do mesmo corpo por hora)
// - Cap global de entregas (20 / 15 min)
//
// Os contadores são em memória (best-effort, por isolate no Workers), como o
// rate limit por IP: reiniciam quando o isolate recicla. Sem timers — a
// limpeza de expirados é preguiçosa a cada incremento.

import { LIMITE_DEDUPE, LIMITE_EMAIL, LIMITE_GLOBAL } from "../../shared/anti-spam.ts";
import type { LimiteJanela } from "../../shared/anti-spam.ts";

interface RegistroJanela {
  hits: number;
  expiraEm: number;
}

// Contador de janela fixa por chave. A janela começa no primeiro incremento e
// expira após `janelaMs`; registros expirados são removidos preguiçosamente.
class ContadorJanela {
  private registros = new Map<string, RegistroJanela>();
  private readonly janelaMs: number;

  constructor(janelaMs: number) {
    this.janelaMs = janelaMs;
  }

  // Leitura sem efeito colateral (não cria nem incrementa o registro).
  consultar(chave: string): number {
    const atual = this.registros.get(chave);
    if (!atual || atual.expiraEm <= Date.now()) return 0;
    return atual.hits;
  }

  incrementar(chave: string): number {
    // Limpeza preguiçosa: varre só quando o mapa cresce, para não pagar O(n)
    // em toda requisição.
    if (this.registros.size > 1000) this.limparExpirados();

    const agora = Date.now();
    const atual = this.registros.get(chave);
    if (!atual || atual.expiraEm <= agora) {
      this.registros.set(chave, { hits: 1, expiraEm: agora + this.janelaMs });
      return 1;
    }
    atual.hits += 1;
    return atual.hits;
  }

  private limparExpirados(): void {
    const agora = Date.now();
    for (const [chave, registro] of this.registros) {
      if (registro.expiraEm <= agora) this.registros.delete(chave);
    }
  }
}

// Hash não criptográfico (FNV-1a) do corpo normalizado. Não é usado para
// segurança, apenas para agrupar conteúdos idênticos sem guardar o texto.
function hashNormalizado(valor: string): string {
  const normalizado = valor.trim().replace(/\s+/g, " ").toLowerCase();
  let hash = 0x811c9dc5;
  for (let i = 0; i < normalizado.length; i++) {
    hash ^= normalizado.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

function logarBloqueio(camada: string, chave: string): void {
  // Log estruturado por bloqueio: camada + chave do contador, nunca o conteúdo
  // da mensagem. `chave` é o mesmo prefixo usado pelo contador (ex.: email:...).
  console.warn(`[anti-spam] ${camada} bloqueado (chave: ${chave})`);
}

// Aplica o limite de uma camada: incrementa e libera se dentro do máximo;
// senão registra o bloqueio com a própria chave do contador.
function permitir(
  contador: ContadorJanela,
  chave: string,
  limite: LimiteJanela,
  camada: string,
): boolean {
  const hits = contador.incrementar(chave);
  if (hits <= limite.max) return true;
  logarBloqueio(camada, chave);
  return false;
}

export interface ContadoresAntiSpam {
  emailPermitido(email: string): boolean;
  conteudoPermitido(mensagem: string): boolean;
  globalPermitido(): boolean;
  registrarEntrega(): void;
}

export function criarContadoresAntiSpam(): ContadoresAntiSpam {
  const porEmail = new ContadorJanela(LIMITE_EMAIL.janelaMs);
  const porDedupe = new ContadorJanela(LIMITE_DEDUPE.janelaMs);
  const global = new ContadorJanela(LIMITE_GLOBAL.janelaMs);
  const CHAVE_GLOBAL = "global";

  return {
    // 3 mensagens / 15 min por e-mail do remetente. Só conta após a validação
    // (chamada com o e-mail já validado), então e-mails inválidos não poluem.
    emailPermitido(email) {
      return permitir(porEmail, `email:${email.toLowerCase()}`, LIMITE_EMAIL, "email");
    },
    // Máx. 3 cópias do mesmo conteúdo normalizado em 1h.
    conteudoPermitido(mensagem) {
      return permitir(porDedupe, `conteudo:${hashNormalizado(mensagem)}`, LIMITE_DEDUPE, "dedupe");
    },
    // Cap global de entregas por janela, somando todos os remetentes/IPs.
    // Consulta sem consumir quota; o contador só cresce em `registrarEntrega`,
    // ou seja, apenas entregas reais contam para o limite.
    globalPermitido() {
      const hits = global.consultar(CHAVE_GLOBAL);
      if (hits < LIMITE_GLOBAL.max) return true;
      logarBloqueio("global", CHAVE_GLOBAL);
      return false;
    },
    registrarEntrega() {
      global.incrementar(CHAVE_GLOBAL);
    },
  };
}
