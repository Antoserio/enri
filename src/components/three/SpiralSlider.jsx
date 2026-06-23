import React, { useRef, useEffect } from "react";
import * as THREE from "three";

// ─── Helix & card constants ───────────────────────────────────────────────────
const R        = 3.0;    // helix radius
const PITCH    = 1.15;   // vertical gap between cards
const CARD_W   = 2.6;    // card width  (3D units)
const CARD_H   = 1.46;   // card height (≈ 16:9)
const SEGS_W   = 24;     // horizontal subdivisions (for bending)
const SEGS_H   = 14;     // vertical subdivisions
const MAX_BEND = 0.52;   // max centre-bulge depth
const BLUE     = 0x1A56DB;
const TWO_PI   = Math.PI * 2;

export default function SpiralSlider({ projects, onProjectClick, onActiveProject }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const N = projects.length;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // ── Scene & camera ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    // Slightly above-right → cards appear to cascade diagonally down-right
    camera.position.set(0.6, 1.4, 9);
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
    const pCount = 220;
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

    projects.forEach((proj, i) => {
      const geo = new THREE.PlaneGeometry(CARD_W, CARD_H, SEGS_W, SEGS_H);
      geos.push(geo);
      origPos.push(new Float32Array(geo.attributes.position.array));

      const mat = new THREE.MeshStandardMaterial({
        roughness: 0.3, metalness: 0.05,
        transparent: true, opacity: 1,
        side: THREE.DoubleSide,  // visible from both sides when curved
      });

      loader.load(proj.image, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        mat.map = tex;
        mat.needsUpdate = true;
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.project = proj;
      scene.add(mesh);
      cardMeshes.push(mesh);
    });

    // ── Scroll state ──────────────────────────────────────────────────────────
    let scrollAngle  = 0;
    let targetAngle  = 0;
    let pointerDown  = null;
    let lastFront    = -1;

    // Scroll / wheel
    const onWheel = (e) => { targetAngle += e.deltaY * 0.003; };

    // Touch
    let touchY0 = 0, touchA0 = 0;
    const onTouchStart = (e) => {
      touchY0 = e.touches[0].clientY;
      touchA0 = targetAngle;
    };
    const onTouchMove = (e) => {
      targetAngle = touchA0 - (e.touches[0].clientY - touchY0) * 0.005;
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

    window.addEventListener("wheel",       onWheel,       { passive: true });
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
        pos.setZ(v, bendAmt * (1 - t * t));     // local +Z = outward from helix
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

      // Slow auto-advance
      targetAngle += 0.004;

      // Smooth damp
      scrollAngle += (targetAngle - scrollAngle) * 0.06;

      // ── Place & bend cards ──
      const maxY      = (N / 2) * PITCH;
      let   frontIdx  = 0;
      let   minAngle  = Infinity;

      cardMeshes.forEach((mesh, i) => {
        const totalAngle = (i / N) * TWO_PI - scrollAngle;

        // Wrap to [–π, π] for y and bend calculation
        const normAngle = ((totalAngle + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;

        // Helix position
        const x = R * Math.sin(totalAngle);
        const z = R * Math.cos(totalAngle);
        const y = -(normAngle / Math.PI) * maxY;   // spirals: sides are high/low

        mesh.position.set(x, y, z);
        // Front face points outward from helix axis
        mesh.lookAt(0, y, 0);

        // Vertex bending (physical curve as card rounds the spiral)
        applyBend(geos[i], origPos[i], normAngle);

        // Opacity by frontness
        const frontness = (Math.cos(normAngle) + 1) / 2;
        mesh.material.opacity = 0.12 + 0.88 * frontness;

        // Track which card is at front
        if (Math.abs(normAngle) < minAngle) {
          minAngle = Math.abs(normAngle);
          frontIdx = i;
        }
      });

      if (frontIdx !== lastFront) {
        lastFront = frontIdx;
        onActiveProject?.(projects[frontIdx]);
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
      window.removeEventListener("wheel",   onWheel);
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
