import React, { useRef, useEffect } from "react";
import * as THREE from "three";

function getScreenPositions(count) {
  return Array.from({ length: count }, (_, i) => 0.12 + (i / count) * 0.72);
}

function buildScrollRemap(projectCount, dwellFraction = 0.08) {
  const screenTs = getScreenPositions(projectCount);
  const totalDwell = screenTs.length * dwellFraction;
  const totalTravel = 1 - totalDwell - 0.04;
  const camPoints = [0, ...screenTs, 0.99];
  const distances = [];
  for (let i = 0; i < camPoints.length - 1; i++) {
    distances.push(camPoints[i + 1] - camPoints[i]);
  }
  const sumDistances = distances.reduce((a, b) => a + b, 0);
  const stops = [[0, 0]];
  let p = 0.02;
  for (let i = 1; i < camPoints.length; i++) {
    p += (distances[i - 1] / sumDistances) * totalTravel;
    stops.push([p, camPoints[i]]);
    if (i < camPoints.length - 1) {
      p += dwellFraction;
      stops.push([p, camPoints[i]]);
    }
  }
  const scale = 1 / stops[stops.length - 1][0];
  stops.forEach((s) => { s[0] *= scale; });
  return { stops, screenTs };
}

function remapProgress(progress, stops) {
  if (progress <= stops[0][0]) return stops[0][1];
  if (progress >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, t0] = stops[i];
    const [p1, t1] = stops[i + 1];
    if (progress >= p0 && progress <= p1) {
      const localT = (progress - p0) / (p1 - p0);
      const smooth = localT * localT * (3 - 2 * localT);
      return t0 + (t1 - t0) * smooth;
    }
  }
  return stops[stops.length - 1][1];
}

export default function ScrollSpineScene({ projects, onScreenClick }) {
  const canvasRef = useRef(null);
  const scrollProgress = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const isPortrait = window.innerHeight > window.innerWidth;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0A0A0B, isMobile ? 8 : 10, isMobile ? 40 : 50);

    // Narrower FOV on portrait for a more controlled, orderly view
    const baseFov = isPortrait ? 60 : 65;
    const camera = new THREE.PerspectiveCamera(baseFov, window.innerWidth / window.innerHeight, 0.1, 200);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x0A0A0B, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // --- Spine Curve ---
    const curvePoints = isPortrait ? [
      new THREE.Vector3(0, 0, 3),
      new THREE.Vector3(0, 0, -8),
      new THREE.Vector3(1.5, 0.3, -20),
      new THREE.Vector3(-1.2, -0.3, -32),
      new THREE.Vector3(2, 0.5, -44),
      new THREE.Vector3(-1.5, -0.5, -56),
      new THREE.Vector3(0, 0, -68),
    ] : [
      new THREE.Vector3(0, 0, 3),
      new THREE.Vector3(0, 0, -8),
      new THREE.Vector3(3, 0.5, -20),
      new THREE.Vector3(-2.5, -0.5, -32),
      new THREE.Vector3(4, 1, -44),
      new THREE.Vector3(-3, -1, -56),
      new THREE.Vector3(0, 0, -68),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5);

    // Spine tube
    const tubeGeo = new THREE.TubeGeometry(curve, 300, 0.08, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x4D4DFF, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Mesh(tubeGeo, tubeMat));

    // Glow tube
    const glowGeo = new THREE.TubeGeometry(curve, 300, 0.3, 8, false);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x4D4DFF, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending });
    scene.add(new THREE.Mesh(glowGeo, glowMat));

    // Vertebrae
    const vertebrae = [];
    for (let i = 0; i < 45; i++) {
      const t = i / 45;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.015, 6, 16),
        new THREE.MeshBasicMaterial({ color: 0x4D4DFF, transparent: true, opacity: 0.2 })
      );
      ring.position.copy(point);
      ring.lookAt(point.clone().add(tangent));
      scene.add(ring);
      vertebrae.push(ring);
    }

    // --- Hero Object ---
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, 0, -6);

    const heroGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const heroMat = new THREE.MeshPhysicalMaterial({
      color: 0x4D4DFF, metalness: 0.2, roughness: 0.1,
      transmission: 0.8, thickness: 1.5, ior: 2.0, clearcoat: 1,
      clearcoatRoughness: 0.15, transparent: true, opacity: 0.9,
    });
    const heroMesh = new THREE.Mesh(heroGeo, heroMat);
    heroGroup.add(heroMesh);

    const heroWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.62, 1),
      new THREE.MeshBasicMaterial({ color: 0x6C6CFF, wireframe: true, transparent: true, opacity: 0.25 })
    );
    heroGroup.add(heroWire);
    scene.add(heroGroup);

    // --- Screens ---
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");
    const screens = [];
    const screenData = [];
    const tempObj = new THREE.Object3D();

    projects.forEach((project, i) => {
      // En móvil: posicionamiento vertical centrado simple
      // En desktop: curve complex con offset lateral
      let screenPos, defaultQuat;
      
      if (isMobile) {
        // Vertical centrado en el eje Z, distribuido a lo largo del scroll
        const zPos = -8 - (i / projects.length) * 50;
        screenPos = new THREE.Vector3(0, 0, zPos);
        defaultQuat = new THREE.Quaternion();
      } else {
        // Desktop: original curve logic
        const t = 0.12 + (i / projects.length) * 0.72;
        const point = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
        const side = i % 2 === 0 ? 1 : -1;
        const sideOffset = isPortrait ? 0.8 : 3.2;
        screenPos = point.clone().add(right.multiplyScalar(sideOffset * side));
        
        const tempGroup = new THREE.Group();
        tempGroup.position.copy(screenPos);
        tempGroup.lookAt(point);
        defaultQuat = tempGroup.quaternion.clone();
      }

      const group = new THREE.Group();
      group.position.copy(screenPos);
      if (!isMobile) {
        group.lookAt(isMobile ? new THREE.Vector3(0, 0, screenPos.z - 1) : curve.getPointAt(0.12 + (i / projects.length) * 0.72));
      }
      scene.add(group);

      // Screen plane - mucho más grande en móvil para ser protagonista
      const screenW = isMobile ? 2.2 : (isPortrait ? 0.12 : 3.0);
      const screenH = isMobile ? 3.2 : (isPortrait ? 0.18 : 1.7);
      const screenGeo = new THREE.PlaneGeometry(screenW, screenH);
      const texture = textureLoader.load(project.image);
      texture.colorSpace = THREE.SRGBColorSpace;
      const screenMat = new THREE.MeshBasicMaterial({
        map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0.4,
      });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.userData = { project, index: i };
      group.add(screen);
      screens.push(screen);

      // Frame glow
      const frameW = isPortrait ? 0.24 : 3.35;
      const frameH = isPortrait ? 0.26 : 1.95;
      const frameGeo = new THREE.PlaneGeometry(frameW, frameH);
      const frameMat = new THREE.MeshBasicMaterial({
        color: 0x4D4DFF, transparent: true, opacity: 0.05,
        blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.z = -0.02;
      group.add(frame);
      screen.userData.frame = frame;

      // Screen light
      const light = new THREE.PointLight(0x4D4DFF, 0.5, 8);
      light.position.set(0, 0, 1.5);
      group.add(light);

      const t = isMobile ? (i / projects.length) : (0.12 + (i / projects.length) * 0.72);
      screenData.push({ screen, frame, group, baseY: screenPos.y, t, index: i, defaultQuat });
    });

    // --- Scroll remap (dwell zones at each screen) ---
    const { stops } = buildScrollRemap(projects.length);

    // --- Particles ---
    const particleCount = 500;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 30;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pPositions[i * 3 + 2] = -Math.random() * 70;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x6C6CFF, size: 0.03, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Lights ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // --- Raycaster ---
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2(-10, -10);
    let isHovering = false;

    const onMouseMove = (e) => {
      mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObjects(screens);
      if (intersects.length > 0) {
        onScreenClick(intersects[0].object.userData.project);
      }
    };

    let touchStart = null;
    const onTouchStart = (e) => {
      if (e.touches[0]) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        mouseVec.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseVec.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };
    const onTouchEnd = (e) => {
      if (!touchStart) return;
      const touch = e.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      touchStart = null;
      // Only treat as tap (not scroll) if minimal movement
      if (Math.sqrt(dx * dx + dy * dy) < 10) {
        onClick();
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });

    // --- Scroll ---
    const onScroll = () => {
      const container = document.getElementById("scroll-experience");
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const total = container.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      scrollProgress.current = Math.min(1, Math.max(0, scrolled / total));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- Resize ---
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.fov = window.innerHeight > window.innerWidth ? 60 : 65;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // --- Animation ---
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      const progress = scrollProgress.current;

      // Camera follows curve with remapped progress (dwells at each screen)
      const camT = progress < 0.02 ? 0 : remapProgress(progress, stops);

      if (isMobile) {
        // En móvil: cámara simple que sigue linealmente el scroll
        camera.position.set(0, 0, 3);
        const targetZ = -8 - (progress * 50);
        camera.position.z = 3;
        camera.lookAt(0, 0, targetZ);
      } else {
        // Desktop: original complex curve logic
        if (progress < 0.02) {
          camera.position.set(0, 0, 2);
          camera.lookAt(0, 0, -6);
        } else {
          const camPos = curve.getPointAt(camT);
          const lookT = Math.min(0.999, camT + 0.04);
          let lookPos = curve.getPointAt(lookT);

          // Blend lookAt toward nearest screen to center it in view
          let maxProx = 0;
          let nearestScreenPos = null;
          screenData.forEach(({ group, t }) => {
            const d = Math.abs(camT - t);
            const prox = Math.max(0, 1 - d * 5);
            if (prox > maxProx) {
              maxProx = prox;
              nearestScreenPos = group.position;
            }
          });
          if (nearestScreenPos && maxProx > 0.1) {
            const blend = maxProx * maxProx * 0.9;
            lookPos = lookPos.clone().lerp(nearestScreenPos, blend);
            const posBlend = maxProx * maxProx * 0.35;
            const adjustedCamPos = camPos.clone().lerp(nearestScreenPos, posBlend);
            camera.position.copy(adjustedCamPos);
          } else {
            camera.position.copy(camPos);
          }
          camera.lookAt(lookPos);
        }
      }

      // Hero object
      const heroFade = Math.max(0, 1 - progress / 0.1);
      heroGroup.visible = heroFade > 0.01;
      if (heroGroup.visible) {
        if (!reducedMotion) {
          heroMesh.rotation.x += 0.003;
          heroMesh.rotation.y += 0.004;
          heroWire.rotation.x = heroMesh.rotation.x;
          heroWire.rotation.y = heroMesh.rotation.y;
          const scale = 1 + Math.sin(time * 0.5) * 0.03;
          heroMesh.scale.setScalar(scale);
          heroWire.scale.setScalar(scale);
        }
        heroMat.opacity = 0.9 * heroFade;
        heroWire.material.opacity = 0.25 * heroFade;
      }

      // Screens — face camera when near center
      if (!reducedMotion) {
        screenData.forEach(({ screen, frame, group, baseY, t, index, defaultQuat }) => {
          if (isMobile) {
            // En móvil: las imágenes son el protagonista, escala dramática
            const proximity = Math.max(0, 1 - Math.abs(progress - t) * 2.5);
            screen.material.opacity = 0.5 + proximity * 0.5;
            frame.material.opacity = 0.1 + proximity * 0.3;
            screen.scale.setScalar(0.85 + proximity * 0.4);  // Escala más dramática: de 0.85 a 1.25
          } else {
            // Desktop: original logic
            const dist = Math.abs(camT - t);
            const proximity = Math.max(0, 1 - dist * 5);

            tempObj.position.copy(group.position);
            tempObj.lookAt(camera.position);
            const cameraQuat = tempObj.quaternion.clone();
            const limitedProximity = Math.min(proximity, 0.35);
            group.quaternion.slerpQuaternions(defaultQuat, cameraQuat, limitedProximity);

            screen.material.opacity = 0.3 + proximity * 0.7;
            frame.material.opacity = 0.04 + proximity * 0.35;
            screen.scale.setScalar(1 + proximity * 0.12);
            group.position.y = baseY + Math.sin(time * 0.4 + index) * 0.06;
          }
        });

        particles.rotation.y = time * 0.01;

        vertebrae.forEach((ring, i) => {
          ring.material.opacity = 0.12 + Math.sin(time + i * 0.4) * 0.1;
        });
      }

      // Raycast for cursor
      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObjects(screens);
      const hovering = intersects.length > 0;
      if (hovering !== isHovering) {
        isHovering = hovering;
        canvas.style.cursor = hovering ? "pointer" : "default";
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      heroGeo.dispose();
      heroMat.dispose();
      heroWire.geometry.dispose();
      heroWire.material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      screens.forEach(s => {
        s.geometry.dispose();
        if (s.material.map) s.material.map.dispose();
        s.material.dispose();
        if (s.userData.frame) {
          s.userData.frame.geometry.dispose();
          s.userData.frame.material.dispose();
        }
      });
    };
  }, [projects, onScreenClick]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <div className="sr-only" aria-live="polite">
        Immersive 3D scroll experience. A crystalline structure transforms into a glowing spine
        through space. Project screens float along the path — click any screen to view the project video.
      </div>
    </>
  );
}