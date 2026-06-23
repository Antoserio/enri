import React, { useState } from "react";
import NavBar from "@/components/sections/NavBar";
import ScrollSpineScene from "@/components/three/ScrollSpineScene";
import ScrollOverlay from "@/components/sections/ScrollOverlay";
import MouseLightOverlay from "@/components/ui/MouseLightOverlay";
import VideoModal from "@/components/ui/VideoModal";
import AboutSection from "@/components/sections/AboutSection";
import FooterSection from "@/components/sections/FooterSection";
import ContactSignal from "@/components/sections/ContactSignal";

const PROJECTS = [
  {
    id: "resonance",
    title: "Resonance",
    category: "Interactive Installation",
    description: "An immersive audiovisual installation where sound becomes architecture. Real-time generative visuals respond to live performance, creating a symbiotic relationship between musician and machine.",
    year: "2026",
    image: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/4c8bf3335_generated_d2ed8adc.png",
    videoUrl: "https://media.base44.com/videos/public/6a3a567627ac27858d406cc1/1196f7580_generated_video.mp4",
  },
  {
    id: "void-architecture",
    title: "Void Architecture",
    category: "Brand Experience",
    description: "A spatial web experience for a contemporary art museum. Visitors navigate through digital galleries that mirror the physical building's brutalist geometry, discovering artworks as they travel through the virtual space.",
    year: "2025",
    image: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/b5daead46_generated_8fc62290.png",
    videoUrl: "https://media.base44.com/videos/public/6a3a567627ac27858d406cc1/dfa6cf8d7_generated_video.mp4",
  },
  {
    id: "liquid-identity",
    title: "Liquid Identity",
    category: "Visual Identity",
    description: "A generative visual identity system for an electronic music label. The logo is never static — it morphs in real-time based on the label's latest release, pulling audio data from streaming APIs to shape its form.",
    year: "2025",
    image: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/6fd18727e_generated_2dd253cc.png",
    videoUrl: "https://media.base44.com/videos/public/6a3a567627ac27858d406cc1/b31487dde_generated_video.mp4",
  },
  {
    id: "fracture",
    title: "Fracture",
    category: "Music Video",
    description: "A fully interactive music video where the viewer controls the camera through a shattering 3D environment. Each fragment contains a different visual narrative, creating a unique viewing experience on every play.",
    year: "2024",
    image: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/2bc55285f_generated_cd2021ea.png",
  },
  {
    id: "signal-noise",
    title: "Signal / Noise",
    category: "Data Visualization",
    description: "A real-time visualization platform that transforms live social media data into an evolving sonic landscape. Positive sentiment grows crystalline structures; negative sentiment erodes them.",
    year: "2024",
    image: "https://media.base44.com/images/public/6a3a567627ac27858d406cc1/4600c9ba8_generated_a00381c0.png",
  },
];

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="relative" style={{ background: "#F2F2F7" }}>
      <NavBar />

      {/* Scroll-driven 3D experience */}
      <div id="scroll-experience" style={{ height: "700vh" }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          <ScrollSpineScene projects={PROJECTS} onScreenClick={setSelectedProject} />
          <ScrollOverlay projects={PROJECTS} />
        </div>
      </div>

      {/* Mouse light effect — always visible */}
      <MouseLightOverlay />

      {/* Regular content after the experience */}
      <AboutSection />
      <FooterSection />
      <ContactSignal />

      {/* Video modal — opens when clicking a screen */}
      {selectedProject && (
        <VideoModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}