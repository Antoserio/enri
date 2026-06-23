import React, { useRef, useEffect } from "react";

export default function MouseLightOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Skip on touch devices — no cursor, saves battery
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let prevX = mouseX;
    let prevY = mouseY;
    const particles = [];
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", (e) => {
      if (e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Gentle fade — eraser trail
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "lighter";

      // Small, soft spotlight
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 90);
      gradient.addColorStop(0, "rgba(180, 180, 255, 0.06)");
      gradient.addColorStop(0.4, "rgba(120, 120, 255, 0.02)");
      gradient.addColorStop(1, "rgba(77, 77, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!reducedMotion) {
        const dx = mouseX - prevX;
        const dy = mouseY - prevY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 4) {
          // Very few, small, slow sparks
          if (Math.random() < 0.3) {
            particles.push({
              x: mouseX + (Math.random() - 0.5) * 6,
              y: mouseY + (Math.random() - 0.5) * 6,
              vx: (Math.random() - 0.5) * 0.4,
              vy: (Math.random() - 0.5) * 0.4 - 0.08,
              life: 1,
              size: Math.random() * 1.2 + 0.3,
            });
          }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.008;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(160, 160, 255, ${p.life * 0.3})`;
          ctx.fill();
        }
      }

      prevX = mouseX;
      prevY = mouseY;
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-30 hidden md:block"
      aria-hidden="true"
    />
  );
}