import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { Server } from "node:http";
import { serve } from "@hono/node-server";
import { getConnInfo } from "@hono/node-server/conninfo";
import criarApp, { type OpcoesCriarApp } from "./app.ts";
import { validarEmail } from "../shared/validacao.ts";
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
    const resposta = await postarContato(baseUrl, {
      nome: "Diovanny Martins",
      email: "teste@dominio.com",
      mensagem: "Mensagem com mais de dez caracteres.",
    });
    assert.equal(resposta.status, 200);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(corpo["success"], true);
  });

  it("rejeita e-mail inválido com 400 e erros por campo", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {
      nome: "Diovanny Martins",
      email: "nao-e-um-email",
      mensagem: "Mensagem válida aqui.",
    });
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(corpo["success"], false);
    assert.ok(campoErro(corpo, "email"));
  });

  it("ignora silenciosamente envio com honeypot preenchido", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {
      nome: "Diovanny Martins",
      email: "teste@dominio.com",
      mensagem: "Mensagem com mais de dez caracteres.",
      website: "http://spam.example.com",
    });
    assert.equal(resposta.status, 200);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(corpo["success"], true);
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
    const resposta = await postarContato(baseUrl, {
      nome: "Nome\nInjetado",
      email: "teste@dominio.com",
      mensagem: "Mensagem válida\u0000 aqui.",
    });
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.ok(campoErro(corpo, "nome"));
    assert.ok(campoErro(corpo, "mensagem"));
  });

  it("aceita mensagem com quebras de linha LF", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {
      nome: "Diovanny Martins",
      email: "teste@dominio.com",
      mensagem: "Primeira linha.\nSegunda linha.",
    });
    assert.equal(resposta.status, 200);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(corpo["success"], true);
  });

  it("aceita mensagem com quebras de linha CRLF", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {
      nome: "Diovanny Martins",
      email: "teste@dominio.com",
      mensagem: "Primeira linha.\r\nSegunda linha.",
    });
    assert.equal(resposta.status, 200);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(corpo["success"], true);
  });

  it("rejeita caractere de controle diferente de quebra de linha na mensagem", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {
      nome: "Diovanny Martins",
      email: "teste@dominio.com",
      mensagem: "Mensagem válida\tcom tabulação.",
    });
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.ok(campoErro(corpo, "mensagem"));
  });

  it("continua rejeitando caracteres de controle em nome e e-mail", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {
      nome: "Nome\rInjetado",
      email: "teste@dominio\u0000.com",
      mensagem: "Mensagem com mais de dez caracteres.",
    });
    assert.equal(resposta.status, 400);
    const corpo = await lerCorpoJson(resposta);
    assert.ok(campoErro(corpo, "nome"));
    assert.ok(campoErro(corpo, "email"));
  });

  it("rejeita nome e mensagem acima dos limites", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {
      nome: "N".repeat(101),
      email: "teste@dominio.com",
      mensagem: "M".repeat(5001),
    });
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
    const resposta = await postarContato(
      baseUrl,
      {
        nome: "Diovanny Martins",
        email: "teste@dominio.com",
        mensagem: "Mensagem com mais de dez caracteres.",
      },
      { Origin: origem },
    );
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
    const resposta = await postarContato(baseUrl, {
      nome: "Diovanny Martins",
      email: "teste@dominio.com",
      mensagem: "Mensagem com mais de dez caracteres.",
    });
    assert.equal(resposta.status, 200);
    const corpo = await lerCorpoJson(resposta);
    assert.equal(corpo["success"], true);
  });

  it("com secret key rejeita envio sem token do captcha", async () => {
    const restaurar = mockSiteverify({ success: true });
    try {
      const baseUrl = await iniciarServidor({ TURNSTILE_SECRET_KEY: "segredo" });
      const resposta = await postarContato(baseUrl, {
        nome: "Diovanny Martins",
        email: "teste@dominio.com",
        mensagem: "Mensagem com mais de dez caracteres.",
      });
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
    const corpo = {
      nome: "Diovanny Martins",
      email: "teste@dominio.com",
      mensagem: "Mensagem com mais de dez caracteres.",
    };

    for (let i = 0; i < 10; i++) {
      const resposta = await postarContato(baseUrl, corpo);
      assert.equal(resposta.status, 200, `envio ${i + 1} deveria passar`);
    }

    const excedido = await postarContato(baseUrl, corpo);
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
    const corpo = {
      nome: "Diovanny Martins",
      email: "teste@dominio.com",
      mensagem: "Mensagem com mais de dez caracteres.",
    };

    for (let i = 0; i < 12; i++) {
      const resposta = await postarContato(baseUrl, corpo);
      assert.equal(resposta.status, 200, `envio ${i + 1} deveria passar`);
    }

    assert.ok(chamadas >= 12, "o resolvedor injetado deveria ser consultado a cada envio");
  });
});
