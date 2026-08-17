import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import criarApp from "./app.js";
import { validarEmail } from "../shared/validacao.js";

let servidor;

async function iniciarServidor() {
  servidor = criarApp().listen(0);
  await new Promise((resolve) => servidor.once("listening", resolve));
  return `http://127.0.0.1:${servidor.address().port}`;
}

afterEach(async () => {
  if (!servidor) return;
  servidor.closeAllConnections?.();
  await new Promise((resolve) => servidor.close(resolve));
  servidor = undefined;
});

async function postarContato(baseUrl, body, extra = {}) {
  return fetch(`${baseUrl}/api/contato`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...extra },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
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
  it("health check responde 200", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await fetch(`${baseUrl}/api/health`);
    assert.equal(resposta.status, 200);
    assert.deepEqual(await resposta.json(), { ok: true });
  });

  it("envia contato válido em modo log", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {
      nome: "Diovanny Martins",
      email: "teste@dominio.com",
      mensagem: "Mensagem com mais de dez caracteres.",
    });
    assert.equal(resposta.status, 200);
    const corpo = await resposta.json();
    assert.equal(corpo.success, true);
  });

  it("rejeita e-mail inválido com 400 e erros por campo", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {
      nome: "Diovanny Martins",
      email: "nao-e-um-email",
      mensagem: "Mensagem válida aqui.",
    });
    assert.equal(resposta.status, 400);
    const corpo = await resposta.json();
    assert.equal(corpo.success, false);
    assert.ok(corpo.errors.email);
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
    const corpo = await resposta.json();
    assert.equal(corpo.success, true);
  });

  it("rejeita campos obrigatórios ausentes com 400", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, {});
    assert.equal(resposta.status, 400);
    const corpo = await resposta.json();
    assert.ok(corpo.errors.nome);
    assert.ok(corpo.errors.email);
    assert.ok(corpo.errors.mensagem);
  });

  it("rejeita JSON malformado com 400", async () => {
    const baseUrl = await iniciarServidor();
    const resposta = await postarContato(baseUrl, "{ json invalido");
    assert.equal(resposta.status, 400);
    const corpo = await resposta.json();
    assert.equal(corpo.success, false);
    assert.equal(corpo.error, "JSON inválido.");
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
});
