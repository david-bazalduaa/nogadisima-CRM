/**
 * NOGADÍSIMA — AMBIENT LIQUID CANVAS ENGINE
 * High-performance 60fps fluid gradient mesh with Poblano Forest Green & warm culinary tones
 */

(function initAmbientLiquidCanvas() {
  const canvas = document.getElementById('ambient-liquid-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width, height;
  let animationFrameId;

  // Fluid Orb definitions with phase, radius, speed and organic color stops
  const orbs = [
    {
      // Orb 1: Artisanal Poblano Forest Green
      baseX: 0.15, baseY: 0.22,
      radiusFactor: 0.44,
      speedX: 0.0006, speedY: 0.0008,
      phaseX: 0, phaseY: Math.PI / 3,
      colorStart: 'rgba(22, 56, 44, 0.28)',
      colorEnd: 'rgba(240, 247, 243, 0)'
    },
    {
      // Orb 2: Warm Cream / Bone Pearl
      baseX: 0.85, baseY: 0.18,
      radiusFactor: 0.48,
      speedX: 0.0007, speedY: 0.0005,
      phaseX: Math.PI / 2, phaseY: 0,
      colorStart: 'rgba(250, 247, 242, 0.85)',
      colorEnd: 'rgba(253, 251, 247, 0)'
    },
    {
      // Orb 3: Pomegranate Rose Blush
      baseX: 0.75, baseY: 0.65,
      radiusFactor: 0.38,
      speedX: 0.0005, speedY: 0.0007,
      phaseX: Math.PI, phaseY: Math.PI / 4,
      colorStart: 'rgba(247, 204, 211, 0.38)',
      colorEnd: 'rgba(252, 231, 235, 0)'
    },
    {
      // Orb 4: Warm Golden Amber Glow
      baseX: 0.30, baseY: 0.78,
      radiusFactor: 0.40,
      speedX: 0.0008, speedY: 0.0006,
      phaseX: Math.PI * 1.5, phaseY: Math.PI / 2,
      colorStart: 'rgba(251, 191, 36, 0.20)',
      colorEnd: 'rgba(254, 243, 199, 0)'
    },
    {
      // Orb 5: Soft Poblano Sage
      baseX: 0.50, baseY: 0.40,
      radiusFactor: 0.36,
      speedX: 0.0004, speedY: 0.0005,
      phaseX: Math.PI / 4, phaseY: Math.PI * 1.2,
      colorStart: 'rgba(192, 222, 211, 0.45)',
      colorEnd: 'rgba(225, 239, 234, 0)'
    }
  ];

  // Mouse Parallax Offset
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 50;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 50;
  }, { passive: true });

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  function render(time) {
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Organic soft background base
    ctx.fillStyle = '#F4F6F4';
    ctx.fillRect(0, 0, width, height);

    const minDim = Math.max(width, height);

    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];
      const cx = (orb.baseX * width) + (Math.sin(time * orb.speedX + orb.phaseX) * (width * 0.10)) + (mouseX * (0.8 + i * 0.2));
      const cy = (orb.baseY * height) + (Math.cos(time * orb.speedY + orb.phaseY) * (height * 0.10)) + (mouseY * (0.8 + i * 0.2));
      const r = orb.radiusFactor * minDim;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, orb.colorStart);
      grad.addColorStop(1, orb.colorEnd);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  animationFrameId = requestAnimationFrame(render);

  window.addEventListener('beforeunload', () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });
})();
