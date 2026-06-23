import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function EventsGeometry() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0A0A0B, 1);
    
    camera.position.z = 5;

    // Crear octahedro con estilo similar
    const geometry = new THREE.OctahedronGeometry(1.2, 2);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x6C6CFF,
      metalness: 0.3,
      roughness: 0.1,
      transmission: 0.7,
      thickness: 1.2,
      ior: 1.9,
      clearcoat: 0.9,
      clearcoatRoughness: 0.2,
      transparent: true,
      opacity: 0.85
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Wireframe overlay
    const wireGeometry = new THREE.OctahedronGeometry(1.22, 2);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x8888FF,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wireframe);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0x4D4DFF, 0.6);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Particles around geometry
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x4D4DFF,
      size: 0.05,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = Date.now() * 0.0003;

      mesh.rotation.x += 0.002;
      mesh.rotation.y += 0.003;
      mesh.rotation.z += 0.001;

      wireframe.rotation.x = mesh.rotation.x;
      wireframe.rotation.y = mesh.rotation.y;
      wireframe.rotation.z = mesh.rotation.z;

      particles.rotation.x = time;
      particles.rotation.y = time * 0.5;

      const scale = 1 + Math.sin(time * 0.8) * 0.05;
      mesh.scale.setScalar(scale);
      wireframe.scale.setScalar(scale);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 z-0"
      aria-hidden="true"
    />
  );
}