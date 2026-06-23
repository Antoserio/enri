import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X, Play } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const ALBUM_ART = "https://f4.bcbits.com/img/a2297333929_10.jpg";

const TRACKS = [
  { n: "1", title: "El muro",                    duration: "06:09" },
  { n: "2", title: "Bil'in",                      duration: "05:22" },
  { n: "3", title: "¿Hasta cuándo?",             duration: "04:20" },
  { n: "4", title: "Sumergirse en el naufragio", duration: "06:08" },
  { n: "5", title: "La brecha",                   duration: "05:46" },
];

export default function BandcampPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 z-40 flex items-center gap-3 px-5 h-12 rounded-full glass-panel hover:border-cobalt/40 transition-all focus:outline-none focus:ring-2 focus:ring-cobalt group"
        aria-label={isOpen ? t.player.close : t.player.open}
      >
        <div className={`w-2 h-2 rounded-full transition-all ${isOpen ? "bg-cobalt animate-pulse" : "bg-quartz/30"}`} />
        <Music className={`w-4 h-4 transition-colors ${isOpen ? "text-cobalt" : "text-quartz/50 group-hover:text-quartz"}`} />
        <span className="text-xs font-body text-quartz/50 group-hover:text-quartz transition-colors hidden md:block">
          {isOpen ? t.player.playing : t.player.album}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 left-8 z-40 w-[360px] max-w-[calc(100vw-4rem)] rounded-2xl overflow-hidden glass-panel"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-quartz/10">
              <div className="min-w-0">
                <p className="text-xs font-display font-semibold text-quartz truncate">{t.player.album}</p>
                <p className="text-[10px] text-quartz/30 font-body truncate">Enri La Forêt · 2026</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-quartz/10 transition-colors text-quartz/40 hover:text-quartz shrink-0 ml-2"
                aria-label={t.player.close}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative">
              <img
                src={ALBUM_ART}
                alt="Espacio Premeditadamente Vacío — Enri La Forêt"
                className="w-full aspect-square object-cover"
              />
            </div>

            <div className="max-h-[200px] overflow-y-auto">
              {TRACKS.map((track) => (
                <div
                  key={track.n}
                  className="flex items-center gap-3 px-4 py-2"
                >
                  <span className="text-cobalt font-mono text-xs w-4 text-center">{track.n}</span>
                  <span className="text-sm text-quartz/60 font-body flex-1 truncate">{track.title}</span>
                  <span className="text-xs text-quartz/25 font-body">{track.duration}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}