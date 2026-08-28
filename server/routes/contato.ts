import { Hono } from "hono";
import { validarEmail } from "../../shared/validacao.ts";
import { FILL_TIME_MIN_MS, HONEYTOKEN_VALOR } from "../../shared/anti-spam.ts";
import { mensagensDoRequest } from "../lib/idioma.ts";
import { enviarEmail } from "../lib/email.ts";
import { verificarTurnstile } from "../lib/turnstile.ts";
import { criarContadoresAntiSpam } from "../lib/anti-spam.ts";
import type { AppConfig, ContatoPayload, ResultadoValidacao } from "../../shared/types.ts";
import type { Mensagens } from "../../shared/i18n.ts";

// Validação server-side: nunca confie apenas na validação do navegador.

function extrairTexto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

// Normaliza as quebras de linha para LF (\n): CRLF e CR viram LF.
function normalizarQuebrasLinha(valor: string): string {
  return valor.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function validar(payload: ContatoPayload, mensagens: Mensagens): ResultadoValidacao {
  const nome = extrairTexto(payload.nome);
  const email = extrairTexto(payload.email);
  const mensagem = normalizarQuebrasLinha(extrairTexto(payload.mensagem));
  const erros: ResultadoValidacao["erros"] = {};

  // Caracteres de controle (C0 + DEL) são rejeitados. Por padrão todos;
  // na mensagem, as quebras de linha LF (\n) e CR (\r) são permitidas.
  const possuiControle = (valor: string, permitirQuebrasLinha = false) =>
    [...valor].some((caractere) => {
      const codigo = caractere.codePointAt(0);
      if (codigo === undefined) return false;
      if (permitirQuebrasLinha && (codigo === 10 || codigo === 13)) return false;
      return codigo < 32 || codigo === 127;
    });

  if (typeof payload.nome !== "string" || nome.length < 3) {
    erros.nome = mensagens.nomeCurto;
  }
  if (nome.length > 100) erros.nome = mensagens.nomeMax;
  if (possuiControle(nome)) {
    erros.nome = mensagens.nomeControle;
  }
  if (typeof payload.email !== "string" || email.length > 254) {
    erros.email = mensagens.emailMax;
  } else if (!validarEmail(email)) {
    erros.email = mensagens.emailInvalidoServidor;
  }
  if (possuiControle(email)) erros.email = mensagens.emailControle;
  if (typeof payload.mensagem !== "string" || mensagem.length < 10) {
    erros.mensagem = mensagens.mensagemMin;
  }
  if (mensagem.length > 5000) erros.mensagem = mensagens.mensagemMax;
  if (possuiControle(mensagem, true)) {
    erros.mensagem = mensagens.mensagemControle;
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros,
    dados: { nome, email, mensagem },
  };
}

// Erro tipado para falhas de leitura/parse do corpo. O `code` permite
// distinguir, sem comparar strings soltas, o corpo grande do JSON inválido.
type CodigoErroCorpo = "CORPO_MUITO_GRANDE" | "JSON_INVALIDO";

class ErroCorpo extends Error {
  readonly code: CodigoErroCorpo;

  constructor(code: CodigoErroCorpo) {
    super(code);
    this.name = "ErroCorpo";
    this.code = code;
  }
}

// Lê o corpo da requisição em stream com um limite rígido de bytes.
// Retorna o valor já parseado como JSON (desconhecido) para o chamador.
async function lerJsonLimitado(request: Request, limite: number): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new ErroCorpo("JSON_INVALIDO");

  const partes: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const resultado = await reader.read();
    if (resultado.done) break;
    total += resultado.value.byteLength;
    if (total > limite) {
      await reader.cancel();
      throw new ErroCorpo("CORPO_MUITO_GRANDE");
    }
    partes.push(resultado.value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const parte of partes) {
    bytes.set(parte, offset);
    offset += parte.byteLength;
  }

  const conteudo: unknown = JSON.parse(new TextDecoder().decode(bytes));
  return conteudo;
}

export default function rotaContato(config: AppConfig) {
  const contadores = criarContadoresAntiSpam();
  const rota = new Hono();

  rota.post("/", async (c) => {
    // Mensagens no idioma do visitante (header x-lang), usadas por todas as
    // respostas abaixo. O 429 é genérico em todas as camadas de rate limit:
    // não revela qual bloqueou, evitando que o atacante calibre a defesa.
    const mensagens = mensagensDoRequest(c);
    const limiteCorpo = 16 * 1024;
    const contentType = c.req.header("content-type") || "";
    if (!contentType.toLowerCase().startsWith("application/json")) {
      return c.json({ success: false, error: mensagens.contentType }, 415);
    }

    const tamanho = Number(c.req.header("content-length") || 0);
    if (tamanho > limiteCorpo) {
      return c.json({ success: false, error: mensagens.mensagemGrande }, 413);
    }

    let body: unknown;
    try {
      body = await lerJsonLimitado(c.req.raw, limiteCorpo);
    } catch (erro) {
      if (erro instanceof ErroCorpo && erro.code === "CORPO_MUITO_GRANDE") {
        return c.json({ success: false, error: mensagens.mensagemGrande }, 413);
      }
      return c.json({ success: false, error: mensagens.jsonInvalido }, 400);
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return c.json({ success: false, error: mensagens.jsonInvalido }, 400);
    }

    if (!config.productionReady) {
      return c.json({ success: false, error: mensagens.servicoIndisponivel }, 503);
    }

    // O corpo já foi confirmado como objeto. ContatoPayload não é uma
    // garantia de formato: cada campo continua desconhecido até ser validado
    // por validar() logo abaixo.
    const payload: ContatoPayload = body;

    // Honeypot anti-spam: bot preencheu o campo invisível, então recebe sucesso
    // simulado sem enviar e-mail (não revela a armadilha nem gasta quota).
    if (payload.website) {
      return c.json({ success: true, message: mensagens.sucessoEnvio });
    }

    const { valido, erros, dados } = validar(payload, mensagens);

    if (!valido) {
      return c.json({ success: false, errors: erros }, 400);
    }

    // Honeytoken: o JS preenche este campo com um valor sentinela no load.
    // Bots que não executam JS deixam vazio (ou autopreenchem errado) e
    // recebem sucesso simulado, sem revelar a armadilha nem enviar e-mail.
    if (typeof payload.assunto !== "string" || payload.assunto !== HONEYTOKEN_VALOR) {
      return c.json({ success: true, message: mensagens.sucessoEnvio });
    }

    // Tempo mínimo de preenchimento: bots submetem em menos de 1s. A ausência
    // do campo (JS desligado) não bloqueia — só o valor rápido é rejeitado.
    const fillTime = typeof payload.fillTime === "number" ? payload.fillTime : undefined;
    if (fillTime !== undefined && fillTime < FILL_TIME_MIN_MS) {
      return c.json({ success: true, message: mensagens.sucessoEnvio });
    }

    // Limite por e-mail do remetente: conta só após a validação (e-mails
    // válidos). Dedupe de conteúdo e cap global cuidam dos demais volumes.
    if (!contadores.emailPermitido(dados.email)) {
      return c.json({ success: false, error: mensagens.limiteMensagem }, 429);
    }
    if (!contadores.conteudoPermitido(dados.mensagem)) {
      return c.json({ success: false, error: mensagens.limiteMensagem }, 429);
    }

    // Cloudflare Turnstile: valida o token quando a secret key está
    // configurada (produção). Sem ela, segue sem validar — útil em dev.
    if (config.turnstile.secretKey) {
      const token = typeof payload.turnstile === "string" ? payload.turnstile.trim() : "";
      const captchaValido = await verificarTurnstile(token, config.turnstile.secretKey, {
        expectedHostnames: config.turnstile.expectedHostnames,
        expectedAction: config.turnstile.expectedAction,
      });

      if (!captchaValido) {
        return c.json({ success: false, error: mensagens.turnstileFalha }, 400);
      }
    }

    // Cap global: no máximo N entregas por janela, somando todos os
    // remetentes/IPs. Checa sem consumir quota; só conta após o envio real.
    if (!contadores.globalPermitido()) {
      return c.json({ success: false, error: mensagens.limiteMensagem }, 429);
    }

    try {
      await enviarEmail(dados, config);
      contadores.registrarEntrega();
      return c.json({ success: true, message: mensagens.sucessoEnvio });
    } catch (erro) {
      console.error("Falha ao enviar e-mail:", erro);
      return c.json(
        {
          success: false,
          error: mensagens.envioFalhou500,
        },
        500,
      );
    }
  });

  return rota;
}
