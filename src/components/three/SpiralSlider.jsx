import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const AUTO_SPEED = 0.22; // rad/s

export default function SpiralSlider({ projects, onProjectClick, onActiveProject }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const isMobile = W < 768;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x0A0A0B, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ── Camera ───────────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 65 : 55,
      W / H, 0.1, 100
    );
    camera.position.set(0, 0, isMobile ? 7 : 9);

    // ── Orbit config ─────────────────────────────────────────────────────────
    const N     = projects.length;
    const R     = isMobile ? 2.0 : 3.0;
    const cardW = isMobile ? 1.0 : 1.5;
    const cardH = cardW * 1.5;
    const yStep = isMobile ? 0.22 : 0.38;

    // ── Sphere ───────────────────────────────────────────────────────────────
    const sphGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const sphMat = new THREE.MeshPhysicalMaterial({
      color: 0x4D4DFF, metalness: 0.1, roughness: 0.05,
      transmission: 0.92, thickness: 1.5, ior: 2.4,
      clearcoat: 1, clearcoatRoughness: 0.1,
      transparent: true, opacity: 0.88,
    });
    const sphere = new THREE.Mesh(sphGeo, sphMat);
    scene.add(sphere);

    const wireGeo = new THREE.IcosahedronGeometry(1.22, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x6C6CFF, wireframe: true, transparent: true, opacity: 0.2,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // ── Cards ─────────────────────────────────────────────────────────────────
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

      // Additive glow border
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(cardW + 0.12, cardH + 0.12),
        new THREE.MeshBasicMaterial({
          color: 0x4D4DFF, transparent: true, opacity: 0.22,
          blending: THREE.AdditiveBlending, depthWrite: false,
        }),
      );
      scene.add(glow);
      cards.push(glow);
    });

    // ── Particles ─────────────────────────────────────────────────────────────
    const pCount = isMobile ? 150 : 280;
    const pPos   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 22;
      pPos[i*3+1] = (Math.random() - 0.5) * 14;
      pPos[i*3+2] = (Math.random() - 0.5) * 14;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0x6C6CFF, size: 0.02, transparent: true, opacity: 0.28,
      blending: THREE.AdditiveBlending, sizeAttenuation: true,
    }));
    scene.add(particles);

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const ptA = new THREE.PointLight(0x4D4DFF, 3, 15);
    ptA.position.set(-3, 3, 4); scene.add(ptA);
    const ptB = new THREE.PointLight(0xFF3D00, 0.8, 12);
    ptB.position.set(4, -3, 2); scene.add(ptB);

    // ── Input state ───────────────────────────────────────────────────────────
    let rotY       = 0;
    let dragging   = false;
    let dragStartX = 0;
    let dragStartR = 0;
    let tapPos     = null;
    let lastTs     = performance.now();
    let lastFront  = -1;

    const fwd = new THREE.Vector3(0, 0, 1); // reusable
    const dir = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

    // only the image cards (even indices) are clickable
    const clickTargets = cards.filter((_, i) => i % 2 === 0);

    const hitTest = (nx, ny) => {
      raycaster.setFromCamera({ x: nx, y: ny }, camera);
      const hits = raycaster.intersectObjects(clickTargets);
      if (hits.length && onProjectClick) onProjectClick(hits[0].object.userData.project);
    };

    // Mouse
    const onMouseDown = (e) => { dragging = true; dragStartX = e.clientX; dragStartR = rotY; };
    const onMouseMove = (e) => { if (dragging) rotY = dragStartR - (e.clientX - dragStartX) * 0.007; };
    const onMouseUp   = ()  => { dragging = false; };
    const onMouseClick = (e) => {
      const nx =  (e.clientX / W) * 2 - 1;
      const ny = -(e.clientY / H) * 2 + 1;
      hitTest(nx, ny);
    };

    // Touch
    const onTouchStart = (e) => {
      const t = e.touches[0];
      tapPos = { x: t.clientX, y: t.clientY };
      dragging = true; dragStartX = t.clientX; dragStartR = rotY;
    };
    const onTouchMove = (e) => {
      if (dragging) rotY = dragStartR - (e.touches[0].clientX - dragStartX) * 0.007;
    };
    const onTouchEnd = (e) => {
      dragging = false;
      if (!tapPos) return;
      const t  = e.changedTouches[0];
      const dx = t.clientX - tapPos.x;
      const dy = t.clientY - tapPos.y;
      tapPos = null;
      if (Math.sqrt(dx*dx + dy*dy) < 12) {
        hitTest((t.clientX / W) * 2 - 1, -(t.clientY / H) * 2 + 1);
      }
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
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // ── Animation ─────────────────────────────────────────────────────────────
    let animId;

    const animate = (ts) => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;

      if (!dragging) rotY += AUTO_SPEED * dt;

      // Update cards (pairs: image + glow)
      let frontIdx = 0;
      let maxZ     = -Infinity;

      for (let i = 0; i < N; i++) {
        const img  = cards[i * 2];
        const glow = cards[i * 2 + 1];

        const a = baseAngles[i] + rotY;
        const x = Math.sin(a) * R;
        const z = Math.cos(a) * R;
        const y = (i - (N - 1) / 2) * yStep;

        img.position.set(x, y, z);
        glow.position.set(x, y, z - 0.02);

        // Billboard toward camera
        dir.copy(camera.position).sub(img.position).normalize();
        img.quaternion.setFromUnitVectors(fwd, dir);
        glow.quaternion.copy(img.quaternion);

        // Depth opacity
        const prox = (z + R) / (2 * R);
        img.material.opacity = 0.15 + 0.85 * prox;

        if (z > maxZ) { maxZ = z; frontIdx = i; }
      }

      if (frontIdx !== lastFront) {
        lastFront = frontIdx;
        if (onActiveProject) onActiveProject(projects[frontIdx]);
      }

      // Sphere
      const t = ts * 0.001;
      sphere.rotation.x += 0.002; sphere.rotation.y += 0.003;
      wire.rotation.x    = sphere.rotation.x;
      wire.rotation.y    = sphere.rotation.y;
      const s = 1 + Math.sin(t * 0.5) * 0.03;
      sphere.scale.setScalar(s); wire.scale.setScalar(s);

      particles.rotation.y = t * 0.018;

      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown",  onMouseDown);
      canvas.removeEventListener("mousemove",  onMouseMove);
      canvas.removeEventListener("mouseup",    onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      canvas.removeEventListener("click",      onMouseClick);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove",  onTouchMove);
      canvas.removeEventListener("touchend",   onTouchEnd);
      renderer.dispose();
      sphGeo.dispose(); sphMat.dispose();
      wireGeo.dispose(); wireMat.dispose();
      pGeo.dispose();
      cards.forEach(m => {
        m.geometry.dispose();
        if (m.material.map) m.material.map.dispose();
        m.material.dispose();
      });
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
