import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { carregarConfig } from "./config.ts";

describe("carregarConfig", () => {
  it("em desenvolvimento, sem EMAIL_DESTINO, usa RESEND_FROM como destino", () => {
    const config = carregarConfig({ RESEND_FROM: "eu@dominio.com" });
    assert.equal(config.emailDestino, "eu@dominio.com");
  });

  it("em desenvolvimento, com EMAIL_DESTINO, usa o valor configurado", () => {
    const config = carregarConfig({
      EMAIL_DESTINO: "contato@dominio.com",
      RESEND_FROM: "eu@dominio.com",
    });
    assert.equal(config.emailDestino, "contato@dominio.com");
  });

  it("em produção, sem EMAIL_DESTINO, não usa fallback e fica não pronto", () => {
    const config = carregarConfig({ NODE_ENV: "production", RESEND_FROM: "eu@dominio.com" });
    assert.equal(config.emailDestino, undefined);
    assert.equal(config.productionReady, false);
  });

  it("em produção, com EMAIL_DESTINO, usa o valor configurado", () => {
    const config = carregarConfig({
      NODE_ENV: "production",
      EMAIL_DESTINO: "contato@dominio.com",
      RESEND_FROM: "eu@dominio.com",
    });
    assert.equal(config.emailDestino, "contato@dominio.com");
  });
});