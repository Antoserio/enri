import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import NavBar from "@/components/sections/NavBar";
import SpiralSlider from "@/components/three/SpiralSlider";
import MouseLightOverlay from "@/components/ui/MouseLightOverlay";
import VideoModal from "@/components/ui/VideoModal";
import BandcampPlayer from "@/components/ui/BandcampPlayer";
import AboutSection from "@/components/sections/AboutSection";
import EventsSection from "@/components/sections/EventsSection";
import FooterSection from "@/components/sections/FooterSection";
import ContactSignal from "@/components/sections/ContactSignal";
import { useLanguage } from "@/lib/LanguageContext";

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
  const [activeProject, setActiveProject] = useState(null);
  const { t } = useLanguage();

  return (
    <div className="relative" style={{ background: "#0A0A0B" }}>
      <NavBar />

      <div className="relative h-screen overflow-hidden">
        <SpiralSlider
          projects={PROJECTS}
          onProjectClick={setSelectedProject}
          onActiveProject={setActiveProject}
        />

        {/* Hero text */}
        <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-20 md:pt-24 pointer-events-none z-10">
          <p className="text-[10px] md:text-xs tracking-widest uppercase text-white/30 mb-3 font-body">
            {t.hero.tagline}
          </p>
          <h1
            className="font-display font-bold text-white leading-none text-center"
            style={{ fontSize: "clamp(1.4rem, 5vw, 3.5rem)" }}
          >
            {t.hero.title1}
            <br />
            <span className="text-[#4D4DFF]">{t.hero.title2}</span>
            <br />
            {t.hero.title3}
          </h1>
        </div>

        {/* Active project info */}
        <AnimatePresence mode="wait">
          {activeProject && (
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="absolute bottom-8 md:bottom-10 left-0 right-0 flex flex-col items-center pointer-events-none z-10"
            >
              <p className="text-[10px] md:text-xs tracking-widest uppercase text-[#4D4DFF] font-body">
                {activeProject.category}
              </p>
              <h2
                className="font-display text-white font-light mt-1"
                style={{ fontSize: "clamp(1rem, 3vw, 1.6rem)" }}
              >
                {activeProject.title}
              </h2>
              <div className="flex items-center gap-1.5 mt-2 text-white/25 text-[10px] md:text-xs font-body">
                <MousePointerClick className="w-3 h-3" />
                <span>{t.hero.click}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MouseLightOverlay />
      <AboutSection />
      <EventsSection />
      <FooterSection />
      <ContactSignal />
      <BandcampPlayer />

      {selectedProject && (
        <VideoModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}