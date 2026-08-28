import { criarToast } from "./toast.ts";
import { temaAtual, EVENTO_TEMA } from "./tema.ts";
import { caminhoAsset, traduzir } from "../i18n.ts";

export function initCopiarEmail() {
  const btnCopiarEmail = document.querySelector<HTMLButtonElement>("#btnCopiarEmail");
  const textoCopiarEmail = document.getElementById("textoCopiarEmail");
  const iconEmail = document.querySelector<HTMLImageElement>("#iconEmail");

  if (!btnCopiarEmail || !textoCopiarEmail || !iconEmail) return;

  const FEEDBACK_DURACAO_MS = 2000;
  const textoOriginal = textoCopiarEmail.textContent;
  let feedbackTimer: number | undefined;
  // O ícone de envelope é o estado estável; o de check aparece só durante o
  // feedback de cópia. Este módulo é o único que escreve em #iconEmail.
  let exibindoCheck = false;

  function iconEnvelopeAtual() {
    return temaAtual() === "light"
      ? caminhoAsset("img/icon-envelope-preto.png")
      : caminhoAsset("img/icon-envelope-branco.png");
  }

  function iconCheckAtual() {
    return temaAtual() === "light"
      ? caminhoAsset("img/icon-check-preto.png")
      : caminhoAsset("img/icon-check-branco.png");
  }

  const atualizarIconEmail = () => {
    iconEmail.src = exibindoCheck ? iconCheckAtual() : iconEnvelopeAtual();
  };

  // Reage à troca de tema mantendo o estado atual (check durante feedback,
  // envelope fora dele). Ler o tema no momento do evento evita restaurações
  // com o ícone do tema antigo.
  document.addEventListener(EVENTO_TEMA, atualizarIconEmail);
  atualizarIconEmail();

  btnCopiarEmail.addEventListener("click", async () => {
    // data-email é sempre preenchido no HTML; o fallback só cobre o caso de
    // marcação quebrada sem passar undefined para o Clipboard API.
    const email = btnCopiarEmail.dataset.email ?? "";

    const mostrarSucesso = () => {
      textoCopiarEmail.textContent = traduzir("copiado");
      exibindoCheck = true;
      atualizarIconEmail();

      criarToast(traduzir("emailCopiado"));

      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => {
        textoCopiarEmail.textContent = textoOriginal;
        exibindoCheck = false;
        atualizarIconEmail();
      }, FEEDBACK_DURACAO_MS);
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        await copiarComFallback(email);
      }
      mostrarSucesso();
    } catch {
      try {
        await copiarComFallback(email);
        mostrarSucesso();
      } catch {
        criarToast(traduzir("erroCopiar"), false);
      }
    }
  });
}

function copiarComFallback(texto: string): Promise<void> {
  const area = document.createElement("textarea");
  area.value = texto;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);

  try {
    area.select();
    return document.execCommand("copy")
      ? Promise.resolve()
      : Promise.reject(new Error("Cópia não suportada"));
  } finally {
    area.remove();
  }
}
