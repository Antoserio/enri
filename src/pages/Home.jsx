import React, { useState, useRef } from "react";
import NavBar from "@/components/sections/NavBar";
import HeroSection from "@/components/sections/HeroSection";
import ElasticGallery from "@/components/sections/ElasticGallery";
import AboutSection from "@/components/sections/AboutSection";
import ProjectDetail from "@/components/sections/ProjectDetail";
import ContactSignal from "@/components/sections/ContactSignal";
import FooterSection from "@/components/sections/FooterSection";

const PROJECTS = [
  {
    id: "resonance",
    title: "Resonance",
    category: "Interactive Installation",
    description: "An immersive audiovisual installation where sound becomes architecture. Real-time generative visuals respond to live performance, creating a symbiotic relationship between musician and machine.",
    role: "Creative Direction & Development",
    year: "2026",
    tech: "WebGL, Three.js, Web Audio API",
    image: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/4600c9ba8_generated_a00381c0.png",
    image2: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/b5daead46_generated_8fc62290.png",
    process: "We started by mapping frequency ranges to geometric forms. Each bass note triggers tectonic shifts in the 3D environment, while higher frequencies spawn particle systems that cascade through the space. The entire system runs at 60fps in a browser, streamed to a 4K projection mapped surface."
  },
  {
    id: "void-architecture",
    title: "Void Architecture",
    category: "Brand Experience",
    description: "A spatial web experience for a contemporary art museum. Visitors navigate through digital galleries that mirror the physical building's brutalist geometry, discovering artworks as they 'walk' through the virtual space.",
    role: "Design & Frontend Development",
    year: "2025",
    tech: "React, Three.js, GSAP, Blender",
    image: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/b79d7e359_generated_9a08e10c.png",
    image2: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/4600c9ba8_generated_a00381c0.png",
    process: "The museum's floor plan was laser-scanned and rebuilt in Blender as a low-poly approximation. We then developed a first-person navigation system with smooth transitions between gallery rooms, each containing interactive artwork descriptions and high-resolution zoom capabilities."
  },
  {
    id: "liquid-identity",
    title: "Liquid Identity",
    category: "Visual Identity",
    description: "A generative visual identity system for an electronic music label. The logo is never static — it morphs in real-time based on the label's latest release, pulling audio data from streaming APIs to shape its form.",
    role: "Generative Design & Systems",
    year: "2025",
    tech: "p5.js, Node.js, Spotify API",
    image: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/6fd18727e_generated_2dd253cc.png",
    image2: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/b79d7e359_generated_9a08e10c.png",
    process: "We developed a custom generative engine that takes audio features (tempo, energy, valence) from the Spotify API and translates them into visual parameters — controlling mesh deformation, color temperature, and particle density. Every time a new track drops, the identity evolves."
  },
  {
    id: "fracture",
    title: "Fracture",
    category: "Music Video",
    description: "A fully interactive music video where the viewer controls the camera through a shattering 3D environment. Each fragment of the scene contains a different visual narrative, creating a unique viewing experience on every play.",
    role: "Direction & Technical Production",
    year: "2024",
    tech: "WebGL, Three.js, Custom Shaders",
    image: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/2bc55285f_generated_cd2021ea.png",
    image2: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/6fd18727e_generated_2dd253cc.png",
    process: "The video was storyboarded in 4D — three spatial dimensions plus the timeline of destruction. We wrote custom GLSL shaders to handle the fracture physics in real-time, with each glass fragment acting as a portal to a pre-rendered narrative vignette. The result is cinema you can navigate."
  },
  {
    id: "signal-noise",
    title: "Signal / Noise",
    category: "Data Visualization",
    description: "A real-time visualization platform that transforms live social media data into an evolving sonic landscape. Positive sentiment grows crystalline structures; negative sentiment erodes them. The result is an ever-changing monument to the collective digital consciousness.",
    role: "Data Architecture & Creative Code",
    year: "2024",
    tech: "D3.js, Three.js, NLP API, Web Audio",
    image: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/b5daead46_generated_8fc62290.png",
    image2: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/2bc55285f_generated_cd2021ea.png",
    process: "We built a real-time NLP pipeline that classifies sentiment from a firehose of social data. Each data point is mapped to a 3D coordinate and assigned sonic properties — pitch, volume, timbre. The visualization grows organically, with beautiful crystalline formations representing hope and jagged erosions representing discord."
  }
];

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const workRef = useRef(null);

  const handleExplore = () => {
    const el = document.getElementById("work");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative" style={{ background: "#F2F2F7" }}>
      <NavBar />
      <HeroSection onExplore={handleExplore} />
      <ElasticGallery projects={PROJECTS} onSelectProject={setSelectedProject} />
      <AboutSection />
      <div id="contact" />
      <FooterSection />
      <ContactSignal />

      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}