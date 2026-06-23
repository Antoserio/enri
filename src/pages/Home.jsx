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
    id: "album-epv",
    title: "Espacio Premeditadamente Vacío",
    category: "LP · Live/AV · 2026",
    description: "Primer álbum en solitario. Un proyecto dual integrado por un Live/AV y un LP publicado en marzo de 2026 en digital y en vinilo con el sello Pinorama Records. La arquitectura sonora transiciona desde beats de techno industrial hasta armonías luminosas y texturas ambientales.",
    year: "2026",
    image: "/Foto Enri La Forêt 1.jpg",
  },
  {
    id: "esta-linea",
    title: "Esta línea es un espacio recíproco de intercambio",
    category: "Performance · Archivo · 2023",
    description: "Performance y archivo creado con Helena Mariño. Toma su nombre de un fragmento de Permanente obra negra de Vivian Abenshushan. La cocina como espacio discursivo y de resistencia femenina durante el franquismo.",
    year: "2023",
    image: "/Foto Enri La Forêt 3 (Live).jpg",
    link: "https://estalinea.es/",
  },
  {
    id: "los-banistas",
    title: "Los bañistas",
    category: "Performance sonora · 2022",
    description: "Grabación sonora de la performance basada en el poemario Los Bañistas (Ed. RIL, 2022) de Helena Mariño, realizada en el Espacio Cruce Contemporáneo de Madrid. Texto y voz: Helena Mariño. Música: Enri La Forêt.",
    year: "2022",
    image: "/Poesía o barbarie (Teatro del Barrio) 1.jpg",
  },
  {
    id: "capsulas-caixaforum",
    title: "Cápsulas Sonoras · CaixaForum",
    category: "Encargo · 2024",
    description: "Cápsulas sonoras creadas para el ciclo \"A la hora del té con Alicia\" de CaixaForum. Textos de Lewis Carroll. Música e interpretación: Enri La Forêt. Voz: Helena Mariño.",
    year: "2024",
    image: "/Poesía o Barbarie (Teatro del Barrio) 2.jpg",
  },
  {
    id: "citas-sonoras-2025",
    title: "Citas Sonoras · Book Friday",
    category: "Encargo · 2024–2025",
    description: "Citas sonoras compuestas para el Book Friday de Madrid (2024 y 2025), organizado por la Asociación Cuesta de Moyano. Música: Enri La Forêt. Voz: Helena Mariño.",
    year: "2025",
    image: "/Poesía o Barbarie (Teatro del Barrio) 3.jpg",
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