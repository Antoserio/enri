import React, { useRef, useEffect } from "react";
import * as THREE from "three";

// ─── Helix & card constants ───────────────────────────────────────────────────
const R        = 4.0;
const PITCH    = 0.78;
const CARD_W   = 2.4;
const CARD_H   = 1.35;
const SEGS_W   = 12;     // reduced from 24 — enough for bending, lighter GPU
const SEGS_H   = 6;      // reduced from 14
const MAX_BEND = 0.34;
const REPEAT   = 2;
const BLUE     = 0x1A56DB;
const TWO_PI   = Math.PI * 2;

export default function SpiralSlider({ projects, onProjectClick, onActiveProject }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const N     = projects.length;
    const TOTAL = N * REPEAT;   // total card slots in helix (15 for 5 projects)

    // ── Renderer ─────────────────────────────────────────────────────────────
    const mob = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({ antialias: !mob, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mob ? 1 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // ── Scene & camera ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(mob ? 0.4 : 0.8, mob ? 0.8 : 1.5, mob ? 13 : 9);
    camera.lookAt(0, 0, 0);

    // ── Lights ───────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    const keyLight = new THREE.DirectionalLight(0x88aaff, 1.8);
    keyLight.position.set(4, 8, 5);
    scene.add(keyLight);

    const bluePoint = new THREE.PointLight(BLUE, 3, 18);
    bluePoint.position.set(-3, 2, 3);
    scene.add(bluePoint);

    // Flash light for click effect
    const flashLight = new THREE.PointLight(0xffffff, 0, 12);
    scene.add(flashLight);
    let flashIntensity = 0;

    // ── Particles ─────────────────────────────────────────────────────────────
    const pCount = mob ? 60 : 120;
    const pPos   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 22;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: BLUE, size: 0.022, transparent: true, opacity: 0.28,
      blending: THREE.AdditiveBlending, sizeAttenuation: true,
    }));
    scene.add(particles);

    // ── Icosahedron sphere ────────────────────────────────────────────────────
    const sphGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const sphMat = new THREE.MeshPhysicalMaterial({
      color: BLUE, metalness: 0.05, roughness: 0.04,
      transmission: 0.93, thickness: 1.5, ior: 2.4,
      clearcoat: 1, clearcoatRoughness: 0.08,
      transparent: true, opacity: 0.88,
    });
    const sphere = new THREE.Mesh(sphGeo, sphMat);
    scene.add(sphere);

    const wireGeo = new THREE.IcosahedronGeometry(1.38, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: BLUE, wireframe: true, transparent: true, opacity: 0.14,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // ── Cards (subdivided PlaneGeometry for vertex bending) ───────────────────
    const loader     = new THREE.TextureLoader();
    const cardMeshes = [];
    const origPos    = [];  // original vertex positions per card
    const geos       = [];

    // Cache textures so repeated slots reuse the same texture object
    const texCache = {};
    const getTexture = (src) => {
      if (!texCache[src]) {
        const tex = loader.load(src);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        texCache[src] = tex;
      }
      return texCache[src];
    };

    for (let i = 0; i < TOTAL; i++) {
      const proj = projects[i % N];  // repeat projects cyclically

      const geo = new THREE.PlaneGeometry(CARD_W, CARD_H, SEGS_W, SEGS_H);
      geos.push(geo);
      origPos.push(new Float32Array(geo.attributes.position.array));

      const mat = new THREE.MeshStandardMaterial({
        map: getTexture(proj.image),
        roughness: 0.3, metalness: 0.05,
        transparent: true, opacity: 1,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.project = proj;
      scene.add(mesh);
      cardMeshes.push(mesh);
    }

    // ── Scroll state ──────────────────────────────────────────────────────────
    let scrollAngle  = 0;
    let targetAngle  = 0;
    let pointerDown  = null;
    let lastFront    = -1;

    // Wheel on the canvas — clamp deltaY so fast scroll can't skip cards past the wrap point.
    // No preventDefault: lets the page scroll normally while still rotating the spiral.
    const onWheel = (e) => {
      targetAngle -= Math.max(-60, Math.min(60, e.deltaY)) * 0.003;
    };

    // Touch
    let touchY0 = 0, touchA0 = 0;
    const onTouchStart = (e) => {
      touchY0 = e.touches[0].clientY;
      touchA0 = targetAngle;
    };
    const onTouchMove = (e) => {
      targetAngle = touchA0 + (e.touches[0].clientY - touchY0) * 0.005;
    };

    // Click detection (tap vs drag)
    const raycaster = new THREE.Raycaster();
    const onPointerDown = (e) => { pointerDown = { x: e.clientX, y: e.clientY }; };
    const onPointerUp   = (e) => {
      if (!pointerDown) return;
      const dx = e.clientX - pointerDown.x;
      const dy = e.clientY - pointerDown.y;
      pointerDown = null;
      if (Math.hypot(dx, dy) > 10) return;

      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hits = raycaster.intersectObjects(cardMeshes);
      if (hits.length) {
        const hit = hits[0];
        // Light flash at card position
        flashLight.position.copy(hit.object.position);
        flashIntensity = 7;
        onProjectClick?.(hit.object.userData.project);
      }
    };

    mount.addEventListener("wheel",        onWheel,       { passive: true });
    mount.addEventListener("touchstart",   onTouchStart,  { passive: true });
    mount.addEventListener("touchmove",    onTouchMove,   { passive: true });
    mount.addEventListener("pointerdown",  onPointerDown);
    mount.addEventListener("pointerup",    onPointerUp);

    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Per-card vertex bending ───────────────────────────────────────────────
    const applyBend = (geo, orig, normAngle) => {
      // bendAmt: 0 at front/back, 1 at sides (90°)
      const bendAmt = Math.abs(Math.sin(normAngle)) * MAX_BEND;
      const pos = geo.attributes.position;
      for (let v = 0; v < pos.count; v++) {
        const ox = orig[v * 3];
        const oy = orig[v * 3 + 1];
        // Parabolic Z-displacement: centre bulges out, edges stay flat
        const t = ox / (CARD_W * 0.5);          // –1 … +1
        pos.setX(v, ox);
        pos.setY(v, oy);
        pos.setZ(v, -bendAmt * (1 - t * t));    // negative = inward toward helix centre
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    };

    // ── RAF loop ──────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt      = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Very slow drift: right + down
      targetAngle -= 0.0006;

      // Smooth damp
      scrollAngle += (targetAngle - scrollAngle) * 0.06;

      // ── Place & bend cards ──
      const maxY      = (TOTAL / 2) * PITCH;
      let   frontIdx  = 0;
      let   minAngle  = Infinity;

      cardMeshes.forEach((mesh, i) => {
        const totalAngle = (i / TOTAL) * TWO_PI - scrollAngle;

        // Wrap to [–π, π] for y and bend calculation
        const normAngle = ((totalAngle + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;

        // Helix position
        const x = R * Math.sin(totalAngle);
        const z = R * Math.cos(totalAngle);
        const y = -(normAngle / Math.PI) * maxY;   // spirals: sides are high/low

        mesh.position.set(x, y, z);
        mesh.up.set(0, 1, 0);          // reset to world-up (no tilt)
        mesh.lookAt(0, y, 0);          // face outward from helix axis

        // Vertex bending (physical curve as card rounds the spiral)
        applyBend(geos[i], origPos[i], normAngle);

        // Smooth fade zone — no hard pop: full opacity 0→90°, fades to 0 by 130°, wrap at 180° invisible
        const absNorm = Math.abs(normAngle);
        const FADE_S  = Math.PI * 0.50;   // 90°  — start fading
        const FADE_E  = Math.PI * 0.72;   // 130° — fully transparent (wrap is at 180°)
        const fade    = 1 - Math.max(0, Math.min(1, (absNorm - FADE_S) / (FADE_E - FADE_S)));
        mesh.material.opacity = fade;
        mesh.visible = fade > 0.01;

        // Track which card is at front
        if (Math.abs(normAngle) < minAngle) {
          minAngle = Math.abs(normAngle);
          frontIdx = i;
        }
      });

      // Map slot index back to actual project
      const frontProject = projects[frontIdx % N];
      if (frontIdx !== lastFront) {
        lastFront = frontIdx;
        onActiveProject?.(frontProject);
      }

      // ── Sphere ──
      sphere.rotation.x += 0.0018;
      sphere.rotation.y += 0.003;
      wire.rotation.copy(sphere.rotation);
      const s = 1 + Math.sin(elapsed * 0.5) * 0.025;
      sphere.scale.setScalar(s);
      wire.scale.setScalar(s);

      // ── Particles slow drift ──
      particles.rotation.y = elapsed * 0.014;

      // ── Click flash decay ──
      if (flashIntensity > 0) {
        flashIntensity = Math.max(0, flashIntensity - dt * 9);
        flashLight.intensity = flashIntensity;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      mount.removeEventListener("wheel",    onWheel);
      window.removeEventListener("resize",  onResize);
      mount.removeEventListener("touchstart",  onTouchStart);
      mount.removeEventListener("touchmove",   onTouchMove);
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointerup",   onPointerUp);
      renderer.dispose();
      sphGeo.dispose(); sphMat.dispose();
      wireGeo.dispose(); wireMat.dispose();
      pGeo.dispose();
      cardMeshes.forEach(m => {
        m.geometry.dispose();
        if (m.material.map) m.material.map.dispose();
        m.material.dispose();
      });
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [projects, onProjectClick, onActiveProject]);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
