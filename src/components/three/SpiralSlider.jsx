import React, { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

const CARDS_PER_SEC = 18; // seconds for a full rotation

export default function SpiralSlider({ projects, onProjectClick, onActiveProject }) {
  const canvasRef  = useRef(null);
  const trackRef   = useRef(null);
  const rotRef     = useRef(0);
  const rafIdRef   = useRef(null);
  const lastRef    = useRef(null);
  const dragRef    = useRef({ active: false, startX: 0, startRot: 0 });

  const N = projects.length;

  // ── Three.js sphere ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    // Icosahedron
    const geo = new THREE.IcosahedronGeometry(1.4, 1);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x4D4DFF, metalness: 0.1, roughness: 0.05,
      transmission: 0.92, thickness: 1.5, ior: 2.4,
      clearcoat: 1, clearcoatRoughness: 0.1,
      transparent: true, opacity: 0.85,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const wireGeo = new THREE.IcosahedronGeometry(1.43, 1);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x6C6CFF, wireframe: true, transparent: true, opacity: 0.18 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // Particles
    const pCount = 200;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x4D4DFF, size: 0.015, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const ptA = new THREE.PointLight(0x4D4DFF, 2.5, 12);
    ptA.position.set(-3, 2, 3);
    scene.add(ptA);
    const ptB = new THREE.PointLight(0xFF3D00, 0.8, 10);
    ptB.position.set(3, -2, 2);
    scene.add(ptB);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      mesh.rotation.x += 0.002;
      mesh.rotation.y += 0.003;
      wire.rotation.x = mesh.rotation.x;
      wire.rotation.y = mesh.rotation.y;
      const s = 1 + Math.sin(t * 0.5) * 0.03;
      mesh.scale.setScalar(s);
      wire.scale.setScalar(s);
      particles.rotation.y = t * 0.04;
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      renderer.dispose();
      geo.dispose(); mat.dispose();
      wireGeo.dispose(); wireMat.dispose();
      pGeo.dispose(); pMat.dispose();
    };
  }, []);

  // ── CSS carousel loop ─────────────────────────────────────────────────────
  useEffect(() => {
    const step = 360 / N;

    const tick = (ts) => {
      if (!dragRef.current.active) {
        const dt = lastRef.current == null ? 0 : (ts - lastRef.current) / 1000;
        lastRef.current = ts;
        rotRef.current += (360 / CARDS_PER_SEC) * dt;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `rotateY(${-rotRef.current}deg)`;
      }

      // Notify active project (front = closest to camera at angle ≈ rotRef)
      if (onActiveProject) {
        const norm = ((rotRef.current % 360) + 360) % 360;
        const idx = Math.round(norm / step) % N;
        onActiveProject(projects[idx]);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafIdRef.current);
  }, [N, projects, onActiveProject]);

  // ── Drag to rotate ────────────────────────────────────────────────────────
  const startDrag = useCallback((clientX) => {
    dragRef.current = { active: true, startX: clientX, startRot: rotRef.current };
    lastRef.current = null;
  }, []);

  const moveDrag = useCallback((clientX) => {
    if (!dragRef.current.active) return;
    const dx = clientX - dragRef.current.startX;
    rotRef.current = dragRef.current.startRot - dx * 0.35;
  }, []);

  const endDrag = useCallback(() => {
    dragRef.current.active = false;
    lastRef.current = null;
  }, []);

  // ── Responsive values ─────────────────────────────────────────────────────
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const radius   = isMobile ? 160 : 300; // px — translateZ
  const cardW    = isMobile ? 120 : 190; // px
  const cardH    = isMobile ? 165 : 265; // px
  const yStep    = isMobile ? 22  : 38;  // px — spiral vertical spread

  return (
    <div
      className="relative w-full h-full select-none"
      style={{ background: "#0A0A0B", touchAction: "none" }}
      onMouseDown={e => startDrag(e.clientX)}
      onMouseMove={e => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={e => startDrag(e.touches[0].clientX)}
      onTouchMove={e => moveDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
    >
      {/* Three.js sphere — behind everything */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      />

      {/* CSS 3D carousel */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "900px", zIndex: 2 }}
      >
        <div
          ref={trackRef}
          style={{ transformStyle: "preserve-3d", width: 0, height: 0, position: "relative" }}
        >
          {projects.map((project, i) => {
            const angle  = (i / N) * 360;
            const yOff   = (i - (N - 1) / 2) * yStep;

            return (
              <div
                key={project.id}
                onClick={() => onProjectClick?.(project)}
                style={{
                  position: "absolute",
                  width:  cardW,
                  height: cardH,
                  top:  -cardH / 2,
                  left: -cardW / 2,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${yOff}px)`,
                  cursor: "pointer",
                  borderRadius: 8,
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* Glow border */}
                <div style={{
                  position: "absolute", inset: 0,
                  border: "1px solid rgba(77,77,255,0.45)",
                  borderRadius: 8,
                  boxShadow: "0 0 24px rgba(77,77,255,0.25), inset 0 0 10px rgba(77,77,255,0.08)",
                  pointerEvents: "none",
                }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
