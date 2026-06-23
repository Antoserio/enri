import React, { useRef, useEffect, useCallback, useState } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP — CSS 3D carousel + Three.js sphere canvas
// ─────────────────────────────────────────────────────────────────────────────
const DEG_PER_SEC = 18;

function SpiralSliderDesktop({ projects, onProjectClick, onActiveProject }) {
  const canvasRef  = useRef(null);
  const trackRef   = useRef(null);
  const cardElsRef = useRef([]);
  const rotRef     = useRef(0);
  const rafIdRef   = useRef(null);
  const lastTsRef  = useRef(null);
  const dragRef    = useRef({ active: false, startX: 0, startRot: 0 });

  const [vw, setVw] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const radius = Math.min(vw * 0.40, 290);
  const persp  = radius * 3;
  const cardW  = Math.min(vw * 0.28, 210);
  const cardH  = cardW * 0.5625; // 16:9 landscape
  const yStep  = 20;
  const N      = projects.length;

  // Three.js sphere (transparent canvas behind CSS cards)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const geo = new THREE.IcosahedronGeometry(1.4, 1);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x4D4DFF, metalness: 0.1, roughness: 0.05,
      transmission: 0.92, thickness: 1.5, ior: 2.4,
      clearcoat: 1, clearcoatRoughness: 0.1, transparent: true, opacity: 0.85,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const wireGeo = new THREE.IcosahedronGeometry(1.43, 1);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x6C6CFF, wireframe: true, transparent: true, opacity: 0.18 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    const pCount = 180;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i*3] = (Math.random()-0.5)*12; pPos[i*3+1] = (Math.random()-0.5)*12; pPos[i*3+2] = (Math.random()-0.5)*8;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x4D4DFF, size: 0.015, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending })));
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const ptA = new THREE.PointLight(0x4D4DFF, 2.5, 12); ptA.position.set(-3, 2, 3); scene.add(ptA);
    const ptB = new THREE.PointLight(0xFF3D00, 0.8, 10); ptB.position.set(3, -2, 2); scene.add(ptB);

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
      geo.dispose(); mat.dispose(); wireGeo.dispose(); wireMat.dispose(); pGeo.dispose();
    };
  }, []);

  // CSS carousel RAF
  useEffect(() => {
    const tick = (ts) => {
      if (!dragRef.current.active) {
        const dt = lastTsRef.current == null ? 0 : (ts - lastTsRef.current) / 1000;
        lastTsRef.current = ts;
        rotRef.current += DEG_PER_SEC * dt;
      }
      if (trackRef.current) trackRef.current.style.transform = `rotateY(${-rotRef.current}deg)`;

      let frontIdx = 0, maxCos = -Infinity;
      for (let i = 0; i < N; i++) {
        const el = cardElsRef.current[i];
        if (!el) continue;
        const worldAngle = (((i / N) * 360 - rotRef.current) % 360 + 360) % 360;
        const cosA = Math.cos((worldAngle * Math.PI) / 180);
        const t = Math.max(0, cosA);
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

  const startDrag = useCallback((x) => {
    dragRef.current = { active: true, startX: x, startRot: rotRef.current };
    lastTsRef.current = null;
  }, []);
  const moveDrag = useCallback((x) => {
    if (!dragRef.current.active) return;
    rotRef.current = dragRef.current.startRot - (x - dragRef.current.startX) * 0.4;
  }, []);
  const endDrag = useCallback(() => {
    dragRef.current.active = false; lastTsRef.current = null;
  }, []);

  return (
    <div
      className="relative w-full h-full select-none overflow-hidden"
      style={{ background: "#0A0A0B", touchAction: "none" }}
      onMouseDown={e => startDrag(e.clientX)} onMouseMove={e => moveDrag(e.clientX)}
      onMouseUp={endDrag} onMouseLeave={endDrag}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", zIndex: 1 }} aria-hidden="true" />
      <div style={{ position: "absolute", inset: 0, perspective: `${persp}px`, zIndex: 2 }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 0, height: 0 }}>
          <div ref={trackRef} style={{ transformStyle: "preserve-3d", position: "relative", width: 0, height: 0 }}>
            {projects.map((project, i) => (
              <div
                key={project.id}
                ref={el => { cardElsRef.current[i] = el; }}
                onClick={() => onProjectClick?.(project)}
                style={{
                  position: "absolute", width: cardW, height: cardH,
                  top: -(cardH / 2), left: -(cardW / 2),
                  transform: `rotateY(${(i / N) * 360}deg) translateZ(${radius}px) translateY(${(i - (N-1)/2) * yStep}px)`,
                  cursor: "pointer", borderRadius: 8, overflow: "hidden",
                  backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                }}
              >
                <img src={project.image} alt={project.title} draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(77,77,255,0.5)", borderRadius: 8, boxShadow: "0 0 20px rgba(77,77,255,0.2)", pointerEvents: "none" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE — pure Three.js (reliable on all mobile browsers)
// ─────────────────────────────────────────────────────────────────────────────
const AUTO_SPEED = 0.22;

function SpiralSliderMobile({ projects, onProjectClick, onActiveProject }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x0A0A0B, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 100);
    camera.position.set(0, 0, 7);

    const N = projects.length;
    const R = 2.2, cardW = 1.6, cardH = 0.9, yStep = 0.15; // landscape 16:9

    // Sphere
    const sphGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const sphMat = new THREE.MeshPhysicalMaterial({
      color: 0x4D4DFF, metalness: 0.1, roughness: 0.05,
      transmission: 0.92, thickness: 1.5, ior: 2.4,
      clearcoat: 1, clearcoatRoughness: 0.1, transparent: true, opacity: 0.88,
    });
    const sphere = new THREE.Mesh(sphGeo, sphMat);
    scene.add(sphere);
    const wireGeo = new THREE.IcosahedronGeometry(1.22, 1);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x6C6CFF, wireframe: true, transparent: true, opacity: 0.2 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // Cards
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const cards = [];
    const baseAngles = projects.map((_, i) => (i / N) * Math.PI * 2);

    projects.forEach((project, i) => {
      const tex = loader.load(project.image);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(cardW, cardH),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 1 }),
      );
      mesh.userData = { project };
      scene.add(mesh);
      cards.push(mesh);
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(cardW + 0.12, cardH + 0.12),
        new THREE.MeshBasicMaterial({ color: 0x4D4DFF, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      scene.add(glow);
      cards.push(glow);
    });

    // Particles
    const pCount = 150;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i*3] = (Math.random()-0.5)*20; pPos[i*3+1] = (Math.random()-0.5)*14; pPos[i*3+2] = (Math.random()-0.5)*14;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x6C6CFF, size: 0.02, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const ptA = new THREE.PointLight(0x4D4DFF, 3, 15); ptA.position.set(-3, 3, 4); scene.add(ptA);
    const ptB = new THREE.PointLight(0xFF3D00, 0.8, 12); ptB.position.set(4, -3, 2); scene.add(ptB);

    let rotY = 0, dragging = false, dragStartX = 0, dragStartR = 0, tapPos = null, lastTs = performance.now(), lastFront = -1;
    const fwd = new THREE.Vector3(0, 0, 1);
    const dir = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const clickTargets = cards.filter((_, i) => i % 2 === 0);

    const hitTest = (nx, ny) => {
      raycaster.setFromCamera({ x: nx, y: ny }, camera);
      const hits = raycaster.intersectObjects(clickTargets);
      if (hits.length && onProjectClick) onProjectClick(hits[0].object.userData.project);
    };

    const onMouseDown  = e => { dragging = true; dragStartX = e.clientX; dragStartR = rotY; };
    const onMouseMove  = e => { if (dragging) rotY = dragStartR - (e.clientX - dragStartX) * 0.007; };
    const onMouseUp    = ()  => { dragging = false; };
    const onMouseClick = e  => hitTest((e.clientX/W)*2-1, -(e.clientY/H)*2+1);
    const onTouchStart = e  => { const t = e.touches[0]; tapPos = { x: t.clientX, y: t.clientY }; dragging = true; dragStartX = t.clientX; dragStartR = rotY; };
    const onTouchMove  = e  => { if (dragging) rotY = dragStartR - (e.touches[0].clientX - dragStartX) * 0.007; };
    const onTouchEnd   = e  => {
      dragging = false;
      if (!tapPos) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - tapPos.x, dy = t.clientY - tapPos.y;
      tapPos = null;
      if (Math.sqrt(dx*dx+dy*dy) < 12) hitTest((t.clientX/W)*2-1, -(t.clientY/H)*2+1);
    };

    canvas.addEventListener("mousedown",  onMouseDown);
    canvas.addEventListener("mousemove",  onMouseMove);
    canvas.addEventListener("mouseup",    onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);
    canvas.addEventListener("click",      onMouseClick);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove",  onTouchMove,  { passive: true });
    canvas.addEventListener("touchend",   onTouchEnd,   { passive: true });

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    let animId;
    const animate = (ts) => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      if (!dragging) rotY += AUTO_SPEED * dt;

      let frontIdx = 0, maxZ = -Infinity;
      for (let i = 0; i < N; i++) {
        const img  = cards[i * 2];
        const glow = cards[i * 2 + 1];
        const a = baseAngles[i] + rotY;
        const x = Math.sin(a) * R, z = Math.cos(a) * R, y = (i - (N-1)/2) * yStep;
        img.position.set(x, y, z);
        glow.position.set(x, y, z - 0.02);
        dir.copy(camera.position).sub(img.position).normalize();
        img.quaternion.setFromUnitVectors(fwd, dir);
        glow.quaternion.copy(img.quaternion);
        const prox = (z + R) / (2 * R);
        img.material.opacity = 0.15 + 0.85 * prox;
        if (z > maxZ) { maxZ = z; frontIdx = i; }
      }

      if (frontIdx !== lastFront) { lastFront = frontIdx; if (onActiveProject) onActiveProject(projects[frontIdx]); }

      const t = ts * 0.001;
      sphere.rotation.x += 0.002; sphere.rotation.y += 0.003;
      wire.rotation.x = sphere.rotation.x; wire.rotation.y = sphere.rotation.y;
      const s = 1 + Math.sin(t * 0.5) * 0.03;
      sphere.scale.setScalar(s); wire.scale.setScalar(s);
      particles.rotation.y = t * 0.018;
      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown", onMouseDown); canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp); canvas.removeEventListener("mouseleave", onMouseUp);
      canvas.removeEventListener("click", onMouseClick);
      canvas.removeEventListener("touchstart", onTouchStart); canvas.removeEventListener("touchmove", onTouchMove); canvas.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
      sphGeo.dispose(); sphMat.dispose(); wireGeo.dispose(); wireMat.dispose(); pGeo.dispose();
      cards.forEach(m => { m.geometry.dispose(); if (m.material.map) m.material.map.dispose(); m.material.dispose(); });
    };
  }, [projects, onProjectClick, onActiveProject]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER — picks the right renderer based on viewport width
// ─────────────────────────────────────────────────────────────────────────────
export default function SpiralSlider(props) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile
    ? <SpiralSliderMobile {...props} />
    : <SpiralSliderDesktop {...props} />;
}
