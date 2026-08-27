// Validação de e-mail compartilhada entre frontend e backend.
// Fonte única de verdade: mantenha as regras apenas aqui.
export function validarEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;

  const valor = email.trim();
  if (valor.length === 0 || valor.length > 254) return false;
  if (/\s/.test(valor)) return false;

  const partes = valor.split("@");
  if (partes.length !== 2) return false;

  const [local, dominio] = partes;
  if (!local || !dominio) return false;

  // Parte local: sem ponto no início/fim nem pontos consecutivos.
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;

  const rotulos = dominio.split(".");
  if (rotulos.length < 2) return false;

  // O último rótulo é o TLD; exigir pelo menos 2 caracteres rejeita "a@b.c".
  if (rotulos[rotulos.length - 1].length < 2) return false;

  // Rótulos: 1 a 63 caracteres, alfanuméricos com hífens internos.
  return rotulos.every((rotulo) => {
    if (rotulo.length === 0 || rotulo.length > 63) return false;
    return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i.test(rotulo);
  });
}
