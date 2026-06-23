import React, { useRef, useEffect, useCallback, useState } from "react";
import * as THREE from "three";

const DEG_PER_SEC = 18;

export default function SpiralSlider({ projects, onProjectClick, onActiveProject }) {
  const canvasRef   = useRef(null);
  const trackRef    = useRef(null);
  const cardElsRef  = useRef([]);
  const rotRef      = useRef(0);
  const rafIdRef    = useRef(null);
  const lastTsRef   = useRef(null);
  const dragRef     = useRef({ active: false, startX: 0, startRot: 0 });

  // Reactive viewport — re-renders when screen size changes
  const [vw, setVw] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 375));
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = vw < 768;
  const radius   = Math.min(vw * 0.40, 290);
  const persp    = radius * 3;
  const cardW    = Math.min(vw * 0.25, 180);
  const cardH    = cardW * 1.45;
  const yStep    = isMobile ? 18 : 34;

  const N = projects.length;

  // ── Three.js sphere ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use window size directly — most reliable way to size the canvas
    const W = window.innerWidth;
    const H = window.innerHeight;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);   // sets both WebGL resolution AND canvas CSS size

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

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
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x6C6CFF, wireframe: true, transparent: true, opacity: 0.18,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // Particles
    const pCount = 180;
    const pPos   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 12;
      pPos[i*3+1] = (Math.random() - 0.5) * 12;
      pPos[i*3+2] = (Math.random() - 0.5) * 8;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x4D4DFF, size: 0.015, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(pGeo, pMat));

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const ptA = new THREE.PointLight(0x4D4DFF, 2.5, 12);
    ptA.position.set(-3, 2, 3); scene.add(ptA);
    const ptB = new THREE.PointLight(0xFF3D00, 0.8, 10);
    ptB.position.set(3, -2, 2); scene.add(ptB);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      mesh.rotation.x += 0.002; mesh.rotation.y += 0.003;
      wire.rotation.x = mesh.rotation.x; wire.rotation.y = mesh.rotation.y;
      const s = 1 + Math.sin(t * 0.5) * 0.03;
      mesh.scale.setScalar(s); wire.scale.setScalar(s);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose(); mat.dispose();
      wireGeo.dispose(); wireMat.dispose();
      pGeo.dispose(); pMat.dispose();
    };
  }, []);

  // ── CSS carousel RAF ──────────────────────────────────────────────────────
  useEffect(() => {
    const step = 360 / N;

    const tick = (ts) => {
      if (!dragRef.current.active) {
        const dt = lastTsRef.current == null ? 0 : (ts - lastTsRef.current) / 1000;
        lastTsRef.current = ts;
        rotRef.current += DEG_PER_SEC * dt;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `rotateY(${-rotRef.current}deg)`;
      }

      // Brightness + opacity falloff per card angle
      let frontIdx = 0;
      let maxCos   = -Infinity;

      for (let i = 0; i < N; i++) {
        const el = cardElsRef.current[i];
        if (!el) continue;
        const worldAngle = (((i / N) * 360 - rotRef.current) % 360 + 360) % 360;
        const cosA = Math.cos((worldAngle * Math.PI) / 180);
        const t    = Math.max(0, cosA);
        el.style.opacity = String(0.2 + 0.8 * t);
        el.style.filter  = `brightness(${0.25 + 0.75 * t})`;
        if (cosA > maxCos) { maxCos = cosA; frontIdx = i; }
      }

      if (onActiveProject) onActiveProject(projects[frontIdx]);

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafIdRef.current);
  }, [N, projects, onActiveProject]);

  // ── Drag ──────────────────────────────────────────────────────────────────
  const startDrag = useCallback((clientX) => {
    dragRef.current = { active: true, startX: clientX, startRot: rotRef.current };
    lastTsRef.current = null;
  }, []);

  const moveDrag = useCallback((clientX) => {
    if (!dragRef.current.active) return;
    rotRef.current = dragRef.current.startRot - (clientX - dragRef.current.startX) * 0.4;
  }, []);

  const endDrag = useCallback(() => {
    dragRef.current.active = false;
    lastTsRef.current = null;
  }, []);

  return (
    <div
      className="relative w-full h-full select-none overflow-hidden"
      style={{ background: "#0A0A0B", touchAction: "none" }}
      onMouseDown={e => startDrag(e.clientX)}
      onMouseMove={e => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={e => startDrag(e.touches[0].clientX)}
      onTouchMove={e => moveDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
    >
      {/* Three.js sphere canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          zIndex: 1, display: "block",
        }}
        aria-hidden="true"
      />

      {/*
        CSS 3D carousel — iOS Safari fix:
        do NOT use flexbox on the perspective container.
        Center the track with position absolute + left/top 50%.
      */}
      <div
        style={{
          position: "absolute", inset: 0,
          perspective: `${persp}px`,
          zIndex: 2,
        }}
      >
        {/* Centering wrapper — keeps rotation transform clean */}
        <div
          style={{
            position: "absolute",
            left: "50%", top: "50%",
            width: 0, height: 0,
          }}
        >
          <div
            ref={trackRef}
            style={{ transformStyle: "preserve-3d", position: "relative", width: 0, height: 0 }}
          >
            {projects.map((project, i) => {
              const angle = (i / N) * 360;
              const yOff  = (i - (N - 1) / 2) * yStep;

              return (
                <div
                  key={project.id}
                  ref={el => { cardElsRef.current[i] = el; }}
                  onClick={() => onProjectClick?.(project)}
                  style={{
                    position: "absolute",
                    width:  cardW,
                    height: cardH,
                    top:  -(cardH / 2),
                    left: -(cardW / 2),
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
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    border: "1px solid rgba(77,77,255,0.5)",
                    borderRadius: 8,
                    boxShadow: "0 0 20px rgba(77,77,255,0.2)",
                    pointerEvents: "none",
                  }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
