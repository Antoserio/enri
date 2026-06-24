import React, { useState, useCallback } from "react";
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
    id: "enri-portrait",
    title: "Enri La ForÃªt",
    category: "Compositora Â· Artista sonora",
    description: "Compositora, instrumentista y artista sonora. Trabaja en la intersecciÃ³n entre el sonido, la imagen y el cuerpo.",
    year: "2026",
    image: "/enri-2.jpg",
  },
  {
    id: "album-epv",
    title: "Espacio Premeditadamente VacÃ­o",
    category: "LP Â· Live/AV Â· 2026",
    description: "Primer Ã¡lbum en solitario. Un proyecto dual integrado por un Live/AV y un LP publicado en marzo de 2026 en digital y en vinilo con el sello Pinorama Records. La arquitectura sonora transiciona desde beats de techno industrial hasta armonÃ­as luminosas y texturas ambientales.",
    year: "2026",
    image: "/EPV_Portada-01.jpg",
    tracks: [
      { n: "1", title: "El muro",                    duration: "06:09", file: "/epv-1-el-muro.mp3" },
      { n: "2", title: "Bil'in",                      duration: "05:22", file: "/epv-2-bilin.mp3" },
      { n: "3", title: "Â¿Hasta cuÃ¡ndo?",             duration: "04:20", file: "/epv-3-hasta-cuando.mp3" },
      { n: "4", title: "Sumergirse en el naufragio", duration: "06:08", file: "/epv-4-sumergirse.mp3" },
      { n: "5", title: "La brecha",                   duration: "05:46", file: "/epv-5-la-brecha.mp3" },
    ],
  },
  {
    id: "esta-linea",
    title: "Esta lÃ­nea es un espacio recÃ­proco de intercambio",
    category: "Performance Â· Archivo Â· 2023",
    description: "Performance y archivo creado con Helena MariÃ±o. Toma su nombre de un fragmento de Permanente obra negra de Vivian Abenshushan. La cocina como espacio discursivo y de resistencia femenina durante el franquismo.",
    year: "2023",
    image: "/portada-elinea.png",
    link: "https://estalinea.es/",
    tracks: [
      { n: "1", title: "Dpto. de jardinerÃ­a",                          file: "/elinea-1-jardineria.mp3" },
      { n: "2", title: "Dpto. de colchones, almohadas, camas y sueÃ±os", file: "/elinea-2-colchones.mp3" },
      { n: "3", title: "Dpto. de viajes",                              file: "/elinea-3-viajes.mp3" },
      { n: "4", title: "Dpto. de artefactos analÃ³gicos",               file: "/elinea-4-artefactos.mp3" },
    ],
  },
  {
    id: "los-banistas",
    title: "Los baÃ±istas",
    category: "Performance sonora Â· 2022",
    description: "GrabaciÃ³n sonora de la performance basada en el poemario Los BaÃ±istas (Ed. RIL, 2022) de Helena MariÃ±o, realizada en el Espacio Cruce ContemporÃ¡neo de Madrid. Texto y voz: Helena MariÃ±o. MÃºsica: Enri La ForÃªt.",
    year: "2022",
    image: "/poesia-1.jpg",
  },
  {
    id: "capsulas-caixaforum",
    title: "CÃ¡psulas Sonoras Â· CaixaForum",
    category: "Encargo Â· 2024",
    description: "CÃ¡psulas sonoras creadas para el ciclo \"A la hora del tÃ© con Alicia\" de CaixaForum. Textos de Lewis Carroll. MÃºsica e interpretaciÃ³n: Enri La ForÃªt. Voz: Helena MariÃ±o.",
    year: "2024",
    image: "/portada-aiw.png",
    tracks: [
      { n: "1", title: "Â¿AÃºn no has resuelto el enigma? MatemÃ¡ticas y literatura", file: "/aiw-1.mp3" },
      { n: "2", title: "La hora de los sentidos",                                   file: "/aiw-2.mp3" },
      { n: "3", title: "El disparate. Placer y consuelo de lo absurdo",             file: "/aiw-3.mp3" },
      { n: "4", title: "Tiempo de rebeldes",                                        file: "/aiw-4.mp3" },
      { n: "5", title: "La hora de (algunas) cosas rebeldes",                       file: "/aiw-5.mp3" },
    ],
  },
  {
    id: "citas-sonoras-2025",
    title: "Citas Sonoras Â· Book Friday",
    category: "Encargo Â· 2024â€“2025",
    description: "Citas sonoras compuestas para el Book Friday de Madrid (2024 y 2025), organizado por la AsociaciÃ³n Cuesta de Moyano. MÃºsica: Enri La ForÃªt. Voz: Helena MariÃ±o.",
    year: "2025",
    image: "/portada-bf.png",
    tracks: [
      { n: "1", title: "Samantha Harvey Â· Un malestar indefinido", file: "/bf-1-samantha.mp3" },
      { n: "2", title: "Camila Sosa Villada Â· El viaje inÃºtil",    file: "/bf-2-camila.mp3" },
      { n: "3", title: "Silvina Ocampo Â· Transformation",          file: "/bf-3-silvina.mp3" },
    ],
  },
];

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeProject,   setActiveProject]   = useState(null);
  const [audioProject,    setAudioProject]     = useState(null); // null = default EPV
  const [playerOpen,      setPlayerOpen]       = useState(false);
  const { t } = useLanguage();

  const handleProjectClick = useCallback((project) => {
    if (project.tracks) {
      // Has audio â€” open player (EPV is default, others load their tracks)
      if (project.id !== "album-epv") setAudioProject(project);
      setPlayerOpen(true);
    } else {
      // No audio â€” show image modal
      setSelectedProject(project);
    }
  }, []);

  return (
    <div className="relative" style={{ background: "#0A0A0B" }}>
      <NavBar />

      <div className="relative h-screen overflow-hidden">
        <SpiralSlider
          projects={PROJECTS}
          onProjectClick={handleProjectClick}
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
            <span className="text-[#1A56DB]">{t.hero.title2}</span>
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
              <p className="text-[10px] md:text-xs tracking-widest uppercase text-[#1A56DB] font-body">
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
      <BandcampPlayer
        audioProject={audioProject}
        isOpen={playerOpen}
        onOpenChange={setPlayerOpen}
      />

      {selectedProject && (
        <VideoModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
