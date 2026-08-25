const TOKENS = ["const", "async", "=>", "{}", "[]", "await", "return", "import"];

export function initLivingEditor() {
  const canvas = document.getElementById("codeField");
  const hero = canvas?.closest(".hero");
  const context = canvas?.getContext("2d");

  if (!canvas || !hero || !context) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const pointer = { x: 0.5, y: 0.5, active: false };
  let palette = readPalette();
  let tokens = [];
  let animationFrame = 0;
  let visible = true;
  let width = 0;
  let height = 0;

  function readPalette() {
    const styles = getComputedStyle(hero);
    return {
      ink: styles.getPropertyValue("--text-primary").trim(),
      accent: styles.getPropertyValue("--focus-ring").trim(),
    };
  }

  function createTokens() {
    const amount = width < 720 ? 13 : 28;
    tokens = Array.from({ length: amount }, (_, index) => ({
      text: TOKENS[index % TOKENS.length],
      x: ((index * 173) % 997) / 997,
      y: ((index * 271 + 83) % 991) / 991,
      speed: 0.000012 + (index % 5) * 0.000004,
      phase: index * 0.73,
      alpha: 0.045 + (index % 4) * 0.018,
    }));
  }

  function resize() {
    const bounds = hero.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = Math.max(1, Math.round(bounds.width));
    height = Math.max(1, Math.round(bounds.height));
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    createTokens();
    draw(performance.now());
  }

  function draw(timestamp) {
    context.clearRect(0, 0, width, height);
    context.font = "500 13px ui-monospace, monospace";
    context.textBaseline = "middle";

    tokens.forEach((token, index) => {
      const travel = reducedMotion.matches ? 0 : timestamp * token.speed;
      const normalizedX = (token.x + travel) % 1.12;
      let x = normalizedX * width - width * 0.06;
      let y = token.y * height + Math.sin(timestamp * 0.00035 + token.phase) * 9;

      if (pointer.active && !coarsePointer.matches) {
        const dx = x - pointer.x * width;
        const dy = y - pointer.y * height;
        const distance = Math.hypot(dx, dy);
        if (distance < 180 && distance > 0) {
          const force = (180 - distance) / 180;
          x += (dx / distance) * force * 18;
          y += (dy / distance) * force * 18;
        }
      }

      context.globalAlpha = token.alpha;
      context.fillStyle = palette.ink;
      context.fillText(token.text, x, y);

      if (index % 4 === 0) {
        context.globalAlpha = token.alpha * 0.55;
        context.strokeStyle = palette.ink;
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(x + context.measureText(token.text).width + 10, y);
        context.lineTo(Math.min(width, x + 90), y);
        context.stroke();
      }
    });

    if (pointer.active && !coarsePointer.matches && !reducedMotion.matches) {
      const x = pointer.x * width;
      const y = pointer.y * height;
      const glow = context.createRadialGradient(x, y, 0, x, y, 84);
      glow.addColorStop(0, palette.accent);
      glow.addColorStop(1, "transparent");
      context.globalAlpha = 0.09;
      context.fillStyle = glow;
      context.fillRect(x - 84, y - 84, 168, 168);
      context.globalAlpha = 0.4;
      context.fillStyle = palette.accent;
      context.fillRect(x - 1, y - 10, 2, 20);
    }

    context.globalAlpha = 1;
  }

  function animate(timestamp) {
    draw(timestamp);
    animationFrame = requestAnimationFrame(animate);
  }

  function start() {
    cancelAnimationFrame(animationFrame);
    draw(performance.now());
    if (visible && !document.hidden && !reducedMotion.matches) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  function updatePointer(event) {
    const bounds = hero.getBoundingClientRect();
    pointer.x = (event.clientX - bounds.left) / bounds.width;
    pointer.y = (event.clientY - bounds.top) / bounds.height;
    pointer.active = true;
  }

  hero.addEventListener("pointermove", updatePointer, { passive: true });
  hero.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  new ResizeObserver(resize).observe(hero);
  new MutationObserver(() => {
    palette = readPalette();
    draw(performance.now());
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    start();
  }).observe(hero);

  document.addEventListener("visibilitychange", start);
  reducedMotion.addEventListener("change", start);
  resize();
  start();
}
