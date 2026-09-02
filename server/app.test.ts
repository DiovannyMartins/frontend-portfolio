import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { Server } from "node:http";
import { serve } from "@hono/node-server";
import { getConnInfo } from "@hono/node-server/conninfo";
import criarApp, { type OpcoesCriarApp } from "./app.ts";
import { validarEmail } from "../shared/validacao.ts";
import { HONEYTOKEN_VALOR } from "../shared/anti-spam.ts";
import { HEADER_IDIOMA } from "../shared/i18n.ts";
import type { AppEnv } from "../shared/types.ts";

let servidor: Server | undefined;

async function iniciarServidor(env: AppEnv = {}, opcoes: OpcoesCriarApp = {}): Promise<string> {
  const instancia = serve({
    fetch: criarApp(env, {
      obterIpCliente: opcoes.obterIpCliente ?? ((contexto) => getConnInfo(contexto).remote.address),
    }).fetch,
    port: 0,
  });
  if (!(instancia instanceof Server)) {
    throw new Error("Esperava um servidor HTTP do Node.");
  }
  servidor = instancia;
  await new Promise<void>((resolve) => instancia.once("listening", resolve));
  const endereco = instancia.address();
  if (endereco === null || typeof endereco === "string") {
    throw new Error("Servidor não está ouvindo em um endereço TCP.");
  }
  return `http://127.0.0.1:${endereco.port}`;
}

afterEach(async () => {
  const atual = servidor;
  if (!atual) return;
  atual.closeAllConnections();
  await new Promise<void>((resolve) => atual.close(() => resolve()));
  servidor = undefined;
});

async function postarContato(
  baseUrl: string,
  body: unknown,
  extra: Record<string, string> = {},
): Promise<Response> {
  return fetch(`${baseUrl}/api/contato`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...extra },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

// Corpo de contato "de verdade", como o formulário envia com JS habilitado:
// inclui o honeytoken (assunto) e o fill-time acima do mínimo.
function corpoContatoValido(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    nome: "Diovanny Martins",
    email: "teste@dominio.com",
    mensagem: "Mensagem com mais de dez caracteres.",
    assunto: HONEYTOKEN_VALOR,
    fillTime: 5000,
    ...extra,
  };
}

// Conta chamadas a console.log: o envio em "modo log" (sem Resend) registra a
// mensagem no console. Permite distinguir envio real de sucesso simulado.
function espionarLog(): { obterChamadas: () => number; restaurar: () => void } {
  const original = console.log;
  let chamadas = 0;
  console.log = (..._args: unknown[]) => {
    chamadas += 1;
  };
  return {
    obterChamadas: () => chamadas,
    restaurar: () => {
      console.log = original;
    },
  };
}

type ObjetoJson = Record<string, unknown>;

function comoObjeto(valor: unknown): ObjetoJson | null {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor)) return null;
  return valor as ObjetoJson;
}

function campoErro(corpo: ObjetoJson, campo: string): unknown {
  const objetoErros = comoObjeto(corpo["errors"]);
  return objetoErros ? objetoErros[campo] : undefined;
}

async function lerCorpoJson(resposta: Response): Promise<ObjetoJson> {
  const corpo = comoObjeto(await resposta.json());
  if (corpo === null) {
    throw new Error(`Resposta não é um objeto JSON (status ${resposta.status}).`);
  }
  return corpo;
}

describe("validarEmail", () => {
  it("aceita e-mails válidos", () => {
    for (const email of [
      "user@dominio.com",
      "a.b@sub.dominio.org",
      "nome.sobrenome@gmail.com.br",
    ]) {
      assert.equal(validarEmail(email), true, `deveria aceitar ${email}`);
    }
  });

  it("rejeita e-mails inválidos", () => {
    for (const email of [
      "",
      "sem-arroba",
      "a@b", // sem domínio com TLD
      "a@b.c", // TLD de 1 caractere
      "user@dominio", // sem ponto no domínio
      "user@.com", // rótulo vazio
      "user@dominio.", // termina com ponto
      "user@dom..inio", // pontos consecutivos
      "us er@dominio.com", // espaço
      "@dominio.com", // parte local vazia
      "user@", // domínio vazio
      ".user@dominio.com", // local começa com ponto
      "user.@dominio.com", // local termina com ponto
      "user..name@dominio.com", // local com pontos consecutivos
    ]) {
      assert.equal(validarEmail(email), false, `deveria rejeitar "${email}"`);
    }
  });
});

describe("API", () => {
  it("sinaliza configuração incompleta em produção", async () => {
    const baseUrl = await iniciarServidor({ NODE_ENV: "production" });
    const resposta = await fetch(`${baseUrl}/api/health`);
    assert.equal(resposta.status, 503);
    assert.deepEqual(await lerCorpoJson(resposta), { ok: false });
  });

  it("health check responde 200", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await fetch(`${baseUrl}/api/health`);
    assert.equal(resposta.status, 200);
    assert.deepEqual(await lerCorpoJson(resposta), { ok: true });
  });

  it("envia contato válido em modo log", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, corpoContatoValido());
    assert.equal(resposta.status, 200);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(corpo["success"], true);
  });

  it("rejeita e-mail inválido com 400 e erros por campo", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, corpoContatoValido({ email: "nao-e-um-email" }));
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(corpo["success"], false);
    assert.ok(campoErro(corpo, "email"));
  });

  it("ignora silenciosamente envio com honeypot preenchido", async () => {
    const baseUrl = await iniciarServidor();
    const log = espionarLog();
    try {
      const resposta = await postarContato(
        baseUrl,
        corpoContatoValido({ website: "http://spam.example.com" }),
      );
      assert.equal(resposta.status, 200);
      const corpo = await lerCorpoJson(resposta);
      assert.equal(corpo["success"], true);
      assert.equal(log.obterChamadas(), 0, "não deveria enviar e-mail");
    } finally {
      log.restaurar();
    }
  });

  it("rejeita campos obrigatórios ausentes com 400", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {});
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.ok(campoErro(corpo, "nome"));
    assert.ok(campoErro(corpo, "email"));
    assert.ok(campoErro(corpo, "mensagem"));
  });

  it("rejeita JSON malformado com 400", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, "{ json invalido");
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(corpo["success"], false);
    assert.equal(corpo["error"], "JSON inválido.");
  });

  it("rejeita campos com tipos incorretos com 400", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {
      nome: 123,
      email: {},
      mensagem: [],
    });
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.ok(campoErro(corpo, "nome"));
    assert.ok(campoErro(corpo, "email"));
    assert.ok(campoErro(corpo, "mensagem"));
  });

  it("rejeita content-type diferente de JSON", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await fetch(`${baseUrl}/api/contato`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "texto",
    });
    assert.equal(resposta.status, 415);
  });

  it("rejeita campos com caracteres de controle", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(
      baseUrl,
      corpoContatoValido({
        nome: "Nome\nInjetado",
        mensagem: "Mensagem válida\u0000 aqui.",
      }),
    );
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.ok(campoErro(corpo, "nome"));
    assert.ok(campoErro(corpo, "mensagem"));
  });

  it("aceita mensagem com quebras de linha LF", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(
      baseUrl,
      corpoContatoValido({ mensagem: "Primeira linha.\nSegunda linha." }),
    );
    assert.equal(resposta.status, 200);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(corpo["success"], true);
  });

  it("aceita mensagem com quebras de linha CRLF", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(
      baseUrl,
      corpoContatoValido({ mensagem: "Primeira linha.\r\nSegunda linha." }),
    );
    assert.equal(resposta.status, 200);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(corpo["success"], true);
  });

  it("rejeita caractere de controle diferente de quebra de linha na mensagem", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(
      baseUrl,
      corpoContatoValido({ mensagem: "Mensagem válida\tcom tabulação." }),
    );
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.ok(campoErro(corpo, "mensagem"));
  });

  it("continua rejeitando caracteres de controle em nome e e-mail", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(
      baseUrl,
      corpoContatoValido({
        nome: "Nome\rInjetado",
        email: "teste@dominio\u0000.com",
      }),
    );
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.ok(campoErro(corpo, "nome"));
    assert.ok(campoErro(corpo, "email"));
  });

  it("rejeita nome e mensagem acima dos limites", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(
      baseUrl,
      corpoContatoValido({
        nome: "N".repeat(101),
        mensagem: "M".repeat(5001),
      }),
    );
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.match(String(campoErro(corpo, "nome")), /100/);
    assert.match(String(campoErro(corpo, "mensagem")), /5\.000/);
  });

  it("rejeita payload acima do limite com 413", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {
      nome: "Diovanny Martins",
      email: "teste@dominio.com",
      mensagem: "x".repeat(20 * 1024),
    });
    assert.equal(resposta.status, 413);
  });

  it("bloqueia origem não permitida com 403", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {}, { Origin: "https://site-malicioso.com" });
    assert.equal(resposta.status, 403);
  });

  it("permite origem configurada e devolve o header CORS", async () => {
    const baseUrl = await iniciarServidor();
    const origem = "http://localhost:5173";
    const resposta = await postarContato(baseUrl, corpoContatoValido(), { Origin: origem });
    assert.equal(resposta.status, 200);
    assert.equal(resposta.headers.get("access-control-allow-origin"), origem);
  });

  it("responde preflight OPTIONS com 204", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await fetch(`${baseUrl}/api/contato`, {
      method: "OPTIONS",
      headers: { Origin: "http://localhost:5173", "Access-Control-Request-Method": "POST" },
    });
    assert.equal(resposta.status, 204);
    assert.equal(resposta.headers.get("access-control-allow-origin"), "http://localhost:5173");
  });
});

describe("Turnstile", () => {
  const corpoValido = {
    nome: "Diovanny Martins",
    email: "teste@dominio.com",
    mensagem: "Mensagem com mais de dez caracteres.",
    assunto: HONEYTOKEN_VALOR,
    fillTime: 5000,
    turnstile: "token-teste",
  };

  // Substitui o fetch global para simular o siteverify da Cloudflare.
  function mockSiteverify({
    success,
    hostname,
    action,
  }: {
    success: boolean;
    hostname?: string;
    action?: string;
  }) {
    const fetchOriginal: typeof fetch = globalThis.fetch;
    globalThis.fetch = async (url, init) => {
      if (String(url).includes("turnstile/v0/siteverify")) {
        return new Response(JSON.stringify({ success, hostname, action }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return fetchOriginal(url, init);
    };
    return () => {
      globalThis.fetch = fetchOriginal;
    };
  }

  it("sem secret key configurada não exige captcha (modo dev)", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, corpoContatoValido());
    assert.equal(resposta.status, 200);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(corpo["success"], true);
  });

  it("com secret key rejeita envio sem token do captcha", async () => {
    const restaurar = mockSiteverify({ success: true });
    try {
      const baseUrl = await iniciarServidor({ TURNSTILE_SECRET_KEY: "segredo" });
      const resposta = await postarContato(baseUrl, corpoContatoValido());
      assert.equal(resposta.status, 400);
      const corpo = await lerCorpoJson(resposta);
      assert.equal(corpo["success"], false);
      assert.match(String(corpo["error"]), /segurança/i);
    } finally {
      restaurar();
    }
  });

  it("com secret key rejeita token inválido", async () => {
    const restaurar = mockSiteverify({ success: false });
    try {
      const baseUrl = await iniciarServidor({ TURNSTILE_SECRET_KEY: "segredo" });
      const resposta = await postarContato(baseUrl, corpoValido);
      assert.equal(resposta.status, 400);
      const corpo = await lerCorpoJson(resposta);
      assert.equal(corpo["success"], false);
    } finally {
      restaurar();
    }
  });

  it("com secret key aceita token válido", async () => {
    const restaurar = mockSiteverify({ success: true });
    try {
      const baseUrl = await iniciarServidor({ TURNSTILE_SECRET_KEY: "segredo" });
      const resposta = await postarContato(baseUrl, corpoValido);
      assert.equal(resposta.status, 200);
      const corpo = await lerCorpoJson(resposta);
      assert.equal(corpo["success"], true);
    } finally {
      restaurar();
    }
  });

  it("rejeita token válido para hostname diferente", async () => {
    const restaurar = mockSiteverify({ success: true, hostname: "outro.example.com" });
    try {
      const baseUrl = await iniciarServidor({
        TURNSTILE_SECRET_KEY: "segredo",
        TURNSTILE_HOSTNAMES: "diovanny.dev",
      });
      const resposta = await postarContato(baseUrl, corpoValido);
      assert.equal(resposta.status, 400);
    } finally {
      restaurar();
    }
  });
});

describe("rate limit", () => {
  it("retorna 429 após exceder o limite de envios por IP", async () => {
    const baseUrl = await iniciarServidor();

    for (let i = 0; i < 10; i++) {
      // E-mail e mensagem únicos: as camadas por e-mail e dedupe não podem
      // interferir no teste do limite por IP.
      const resposta = await postarContato(
        baseUrl,
        corpoContatoValido({
          email: `pessoa${i}@dominio.com`,
          mensagem: `Mensagem ${i} com conteúdo único para este teste.`,
        }),
      );
      assert.equal(resposta.status, 200, `envio ${i + 1} deveria passar`);
    }

    const excedido = await postarContato(baseUrl, corpoContatoValido());
    assert.equal(excedido.status, 429);
  });

  it("usa o resolvedor de IP injetado quando TRUST_PROXY está desativado", async () => {
    let chamadas = 0;
    const baseUrl = await iniciarServidor(
      { TRUST_PROXY: "false" },
      {
        // IP distinto por chamada: cada envio cai num bucket próprio.
        obterIpCliente: () => `ip-${chamadas++}`,
      },
    );

    for (let i = 0; i < 12; i++) {
      const resposta = await postarContato(
        baseUrl,
        corpoContatoValido({
          email: `pessoa${i}@dominio.com`,
          mensagem: `Mensagem ${i} com conteúdo único para este teste.`,
        }),
      );
      assert.equal(resposta.status, 200, `envio ${i + 1} deveria passar`);
    }

    assert.ok(chamadas >= 12, "o resolvedor injetado deveria ser consultado a cada envio");
  });
});

describe("anti-spam extra", () => {
  it("honeytoken ausente ou errado recebe sucesso simulado sem enviar e-mail", async () => {
    const baseUrl = await iniciarServidor();
    for (const extra of [{ assunto: undefined }, { assunto: "valor-errado" }]) {
      const log = espionarLog();
      try {
        const resposta = await postarContato(baseUrl, corpoContatoValido(extra));
        assert.equal(resposta.status, 200);
        assert.equal((await lerCorpoJson(resposta))["success"], true);
        assert.equal(log.obterChamadas(), 0, "não deveria enviar e-mail");
      } finally {
        log.restaurar();
      }
    }
  });

  it("envio rápido demais (fill-time < mínimo) recebe sucesso simulado", async () => {
    const baseUrl = await iniciarServidor();
    const log = espionarLog();
    try {
      const resposta = await postarContato(baseUrl, corpoContatoValido({ fillTime: 100 }));
      assert.equal(resposta.status, 200);
      assert.equal((await lerCorpoJson(resposta))["success"], true);
      assert.equal(log.obterChamadas(), 0, "não deveria enviar e-mail");
    } finally {
      log.restaurar();
    }
  });

  it("ausência de fill-time (JS desligado) não bloqueia o envio", async () => {
    const baseUrl = await iniciarServidor();
    const log = espionarLog();
    try {
      const resposta = await postarContato(baseUrl, corpoContatoValido({ fillTime: undefined }));
      assert.equal(resposta.status, 200);
      assert.ok(log.obterChamadas() >= 1, "deveria enviar de verdade");
    } finally {
      log.restaurar();
    }
  });

  it("bloqueia após 3 envios do mesmo e-mail em 15 minutos", async () => {
    const baseUrl = await iniciarServidor();
    for (let i = 0; i < 3; i++) {
      const resposta = await postarContato(
        baseUrl,
        corpoContatoValido({ mensagem: `Mensagem ${i} com conteúdo único.` }),
      );
      assert.equal(resposta.status, 200, `envio ${i + 1} deveria passar`);
    }
    const bloqueado = await postarContato(baseUrl, corpoContatoValido());
    assert.equal(bloqueado.status, 429);
  });

  it("bloqueia após 3 cópias do mesmo conteúdo em uma hora", async () => {
    const baseUrl = await iniciarServidor();
    for (let i = 0; i < 3; i++) {
      const resposta = await postarContato(
        baseUrl,
        corpoContatoValido({ email: `pessoa${i}@dominio.com` }),
      );
      assert.equal(resposta.status, 200, `envio ${i + 1} deveria passar`);
    }
    const bloqueado = await postarContato(
      baseUrl,
      corpoContatoValido({ email: "pessoa3@dominio.com" }),
    );
    assert.equal(bloqueado.status, 429);
  });

  it("bloqueia envio quando o cap global de entregas é atingido", async () => {
    let chamadas = 0;
    const baseUrl = await iniciarServidor(
      { TRUST_PROXY: "false" },
      { obterIpCliente: () => `ip-${chamadas++}` },
    );
    for (let i = 0; i < 20; i++) {
      const resposta = await postarContato(
        baseUrl,
        corpoContatoValido({
          email: `pessoa${i}@dominio.com`,
          mensagem: `Mensagem ${i} com conteúdo único para não acionar o dedupe.`,
        }),
      );
      assert.equal(resposta.status, 200, `envio ${i + 1} deveria passar`);
    }
    const bloqueado = await postarContato(
      baseUrl,
      corpoContatoValido({
        email: "pessoa20@dominio.com",
        mensagem: "Mensagem 20 com conteúdo único para não acionar o dedupe.",
      }),
    );
    assert.equal(bloqueado.status, 429);
  });

  it("não consome quota global quando o envio falha", async () => {
    // Primeira chamada ao Resend falha (500); as seguintes são entregas reais.
    const fetchOriginal: typeof globalThis.fetch = globalThis.fetch;
    let primeiraFalha = true;
    globalThis.fetch = async (url, init) => {
      if (new URL(String(url)).hostname === "api.resend.com") {
        if (primeiraFalha) {
          primeiraFalha = false;
          return new Response("erro", { status: 500 });
        }
        return new Response("ok", { status: 200 });
      }
      return fetchOriginal(url, init);
    };

    try {
      let chamadas = 0;
      const baseUrl = await iniciarServidor(
        {
          TRUST_PROXY: "false",
          RESEND_API_KEY: "re_teste",
          RESEND_FROM: "onboarding@resend.dev",
          EMAIL_DESTINO: "teste@dominio.com",
        },
        { obterIpCliente: () => `ip-${chamadas++}` },
      );

      const statuses: number[] = [];
      for (let i = 0; i < 21; i++) {
        const resposta = await postarContato(
          baseUrl,
          corpoContatoValido({
            email: `pessoa${i}@dominio.com`,
            mensagem: `Mensagem ${i} com conteúdo único para não acionar o dedupe.`,
          }),
        );
        statuses.push(resposta.status);
      }

      // A falha não conta como entrega: as 20 seguintes entregam e o cap
      // global (20/15min) nunca é excedido — nem na 21ª tentativa.
      assert.equal(statuses[0], 500, "primeira tentativa deveria falhar no Resend");
      assert.equal(statuses.length, 21);
      assert.equal(
        statuses[20],
        200,
        "21ª tentativa deveria passar porque a falha não consumiu quota",
      );
      assert.ok(
        statuses.every((status) => status !== 429),
        "nenhuma tentativa deveria ser bloqueada pelo cap global",
      );
    } finally {
      globalThis.fetch = fetchOriginal;
    }
  });

  it("desliga o formulário quando CONTATO_ENABLED=false", async () => {
    const baseUrl = await iniciarServidor({ CONTATO_ENABLED: "false" });
    const health = await fetch(`${baseUrl}/api/health`);
    assert.equal(health.status, 503);
    const resposta = await postarContato(baseUrl, corpoContatoValido());
    assert.equal(resposta.status, 503);
  });
});

describe("i18n do servidor", () => {
  it("responde as mensagens de validação em inglês quando x-lang: en", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, corpoContatoValido({ email: "nao-e-um-email" }), {
      [HEADER_IDIOMA]: "en",
    });
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(campoErro(corpo, "email"), "Enter a valid email address.");
  });

  it("mantém o padrão pt quando o header x-lang não é en", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, corpoContatoValido({ email: "nao-e-um-email" }));
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(campoErro(corpo, "email"), "Informe um e-mail válido.");
  });

  it("responde a mensagem de rate limit em inglês", async () => {
    const baseUrl = await iniciarServidor();
    for (let i = 0; i < 3; i++) {
      const resposta = await postarContato(
        baseUrl,
        corpoContatoValido({ mensagem: `Mensagem ${i} com conteúdo único.` }),
        { [HEADER_IDIOMA]: "en" },
      );
      assert.equal(resposta.status, 200, `envio ${i + 1} deveria passar`);
    }
    const bloqueado = await postarContato(baseUrl, corpoContatoValido(), { [HEADER_IDIOMA]: "en" });
    assert.equal(bloqueado.status, 429);
    const corpo = await lerCorpoJson(bloqueado);
    assert.equal(corpo["error"], "Too many submission attempts. Wait a few minutes.");
  });
});
