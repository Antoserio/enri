import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function SpiralSlider({ projects, onProjectClick, onActiveProject }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0A0A0B, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ── Center Ball ──────────────────────────────────────────────────────────
    const ballGeo = new THREE.IcosahedronGeometry(1.3, 1);
    const ballMat = new THREE.MeshPhysicalMaterial({
      color: 0x4D4DFF,
      metalness: 0.1, roughness: 0.05,
      transmission: 0.88, thickness: 1.5, ior: 2.4,
      clearcoat: 1, clearcoatRoughness: 0.1,
      transparent: true, opacity: 0.88,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    scene.add(ball);

    const wireGeo = new THREE.IcosahedronGeometry(1.32, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x6C6CFF, wireframe: true, transparent: true, opacity: 0.22,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // ── Helix Tube (rotates as a group) ────────────────────────────────────
    const helixGroup = new THREE.Group();
    scene.add(helixGroup);

    const R = isMobile ? 3 : 4;
    const H = 7;
    const TURNS = 1.5;

    const helixPts = [];
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      const a = t * TURNS * Math.PI * 2;
      helixPts.push(new THREE.Vector3(Math.cos(a) * R, (t - 0.5) * H, Math.sin(a) * R));
    }
    const curve = new THREE.CatmullRomCurve3(helixPts, false, "catmullrom", 0.5);

    const tubeGeo = new THREE.TubeGeometry(curve, 120, 0.04, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x4D4DFF, transparent: true, opacity: 0.5 });
    helixGroup.add(new THREE.Mesh(tubeGeo, tubeMat));

    const glowGeo = new THREE.TubeGeometry(curve, 120, 0.12, 8, false);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x4D4DFF, transparent: true, opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    helixGroup.add(new THREE.Mesh(glowGeo, glowMat));

    // Ring vertebrae
    for (let i = 0; i < 25; i++) {
      const t = i / 25;
      const pt = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.18, 0.018, 6, 16),
        new THREE.MeshBasicMaterial({ color: 0x6C6CFF, transparent: true, opacity: 0.2 }),
      );
      ring.position.copy(pt);
      ring.lookAt(pt.clone().add(tan));
      helixGroup.add(ring);
    }

    // ── Project Cards (world-space, billboard each frame) ──────────────────
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    const N = projects.length;
    const baseAngles = projects.map((_, i) => {
      const t = (i + 0.5) / N;
      return { baseAngle: t * TURNS * Math.PI * 2, y: (t - 0.5) * H };
    });

    const cardGroups = [];
    const screenMeshes = [];

    projects.forEach((project) => {
      const group = new THREE.Group();
      scene.add(group);
      cardGroups.push(group);

      const w = isMobile ? 1.4 : 1.8;
      const h = isMobile ? 0.9 : 1.1;

      const tex = textureLoader.load(project.image);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, opacity: 0.85 }),
      );
      mesh.userData = { project };
      group.add(mesh);
      screenMeshes.push(mesh);

      // Glow frame
      group.add(new THREE.Mesh(
        new THREE.PlaneGeometry(w + 0.14, h + 0.1),
        new THREE.MeshBasicMaterial({
          color: 0x4D4DFF, transparent: true, opacity: 0.2,
          blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        }),
      ));
    });

    // ── Particles ──────────────────────────────────────────────────────────
    const pCount = 350;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 22;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x6C6CFF, size: 0.025, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const particlePoints = new THREE.Points(pGeo, pMat);
    scene.add(particlePoints);

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const ptA = new THREE.PointLight(0x4D4DFF, 2.5, 18);
    ptA.position.set(-3, 3, 4);
    scene.add(ptA);
    const ptB = new THREE.PointLight(0xff3d00, 0.8, 12);
    ptB.position.set(4, -3, 2);
    scene.add(ptB);

    // ── Raycaster ─────────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-10, -10);
    const tempObj = new THREE.Object3D();

    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(screenMeshes);
      if (hits.length && onProjectClick) onProjectClick(hits[0].object.userData.project);
    };

    let touchStart = null;
    const onTouchStart = (e) => {
      if (e.touches[0]) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };
    const onTouchEnd = (e) => {
      if (!touchStart) return;
      const touch = e.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      touchStart = null;
      if (Math.sqrt(dx * dx + dy * dy) < 10) onClick();
    };

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });

    // ── Resize ─────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation ──────────────────────────────────────────────────────────
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ROT_SPEED = 0.14;
    let lastActiveIdx = -1;
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      const rotY = reducedMotion ? 0 : time * ROT_SPEED;

      helixGroup.rotation.y = rotY;

      let frontmostIdx = 0;
      let maxZ = -Infinity;

      baseAngles.forEach(({ baseAngle, y }, i) => {
        const a = baseAngle + rotY;
        const x = Math.cos(a) * R;
        const z = Math.sin(a) * R;

        const group = cardGroups[i];
        group.position.set(x, y, z);

        tempObj.position.copy(group.position);
        tempObj.lookAt(camera.position);
        group.quaternion.copy(tempObj.quaternion);

        // Track frontmost (highest z = closest to camera)
        if (z > maxZ) { maxZ = z; frontmostIdx = i; }

        // Fade/scale by front proximity
        const proximity = (z + R) / (2 * R);
        screenMeshes[i].material.opacity = 0.25 + proximity * 0.7;
        group.scale.setScalar(0.72 + proximity * 0.38);
      });

      if (frontmostIdx !== lastActiveIdx) {
        lastActiveIdx = frontmostIdx;
        onActiveProject && onActiveProject(projects[frontmostIdx]);
      }

      // Ball spin + breathe
      ball.rotation.x += 0.003;
      ball.rotation.y += 0.005;
      wire.rotation.x = ball.rotation.x;
      wire.rotation.y = ball.rotation.y;
      const s = 1 + Math.sin(time * 0.6) * 0.04;
      ball.scale.setScalar(s);
      wire.scale.setScalar(s);

      particlePoints.rotation.y = time * 0.018;
      particlePoints.rotation.x = time * 0.009;

      // Cursor
      raycaster.setFromCamera(mouse, camera);
      canvas.style.cursor = raycaster.intersectObjects(screenMeshes).length ? "pointer" : "default";

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
      ballGeo.dispose(); ballMat.dispose();
      wireGeo.dispose(); wireMat.dispose();
      tubeGeo.dispose(); tubeMat.dispose();
      glowGeo.dispose(); glowMat.dispose();
      pGeo.dispose(); pMat.dispose();
      screenMeshes.forEach(m => {
        m.geometry.dispose();
        if (m.material.map) m.material.map.dispose();
        m.material.dispose();
      });
    };
  }, [projects, onProjectClick, onActiveProject]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <div className="sr-only" aria-live="polite">
        Spiral 3D slider. Project cards orbit a crystalline sphere and cycle automatically.
        Click any card to view the project.
      </div>
    </>
  );
}
