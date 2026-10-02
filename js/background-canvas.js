/**
 * NOGADÍSIMA — HARDWARE-ACCELERATED AMBIENT MESH CONTROLLER
 * Zero-CPU Compositor-level Organic Culinary Ambient Mesh
 * Fully replaces heavy 60fps 2D canvas with hardware-accelerated CSS GPU layers
 */

(function initAmbientLiquidMesh() {
  const mesh = document.getElementById('ambient-liquid-bg');
  if (!mesh) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isMoving = false;
  let rafId = null;

  function onMouseMove(e) {
    // Normalize coordinates (-25px to +25px subtle range)
    mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 30;

    if (!isMoving) {
      isMoving = true;
      rafId = requestAnimationFrame(updateParallax);
    }
  }

  function updateParallax() {
    const dx = mouseX - currentX;
    const dy = mouseY - currentY;

    currentX += dx * 0.06;
    currentY += dy * 0.06;

    // Apply compositor-only transform
    mesh.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

    // Auto-sleep loop when movement delta approaches zero to conserve 100% CPU/GPU
    if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08) {
      rafId = requestAnimationFrame(updateParallax);
    } else {
      isMoving = false;
      rafId = null;
    }
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
  });
})();
