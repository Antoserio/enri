import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X, ExternalLink, Play, Disc } from "lucide-react";

const ALBUM_URL = "https://enrilaforet.bandcamp.com/album/espacio-premeditadamente-vac-o";
const ALBUM_ART = "https://f4.bcbits.com/img/a2297333929_10.jpg";

const TRACKS = [
  { n: "1", title: "El muro", duration: "06:09", url: "https://enrilaforet.bandcamp.com/track/el-muro" },
  { n: "2", title: "Bil'in", duration: "05:22", url: "https://enrilaforet.bandcamp.com/track/bil-in" },
  { n: "3", title: "¿Hasta cuándo?", duration: "04:20", url: "https://enrilaforet.bandcamp.com/track/hasta-cu-ndo" },
  { n: "4", title: "Sumergirse en el naufragio", duration: "06:08", url: "https://enrilaforet.bandcamp.com/track/sumergirse-en-el-naufragio" },
  { n: "5", title: "La brecha", duration: "05:46", url: "https://enrilaforet.bandcamp.com/track/la-brecha" },
];

export default function BandcampPlayer() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 z-40 flex items-center gap-3 px-5 h-12 rounded-full glass-panel hover:border-cobalt/40 transition-all focus:outline-none focus:ring-2 focus:ring-cobalt group"
        aria-label={isOpen ? "Cerrar reproductor" : "Abrir reproductor"}
      >
        <div className={`w-2 h-2 rounded-full transition-all ${isOpen ? "bg-cobalt animate-pulse" : "bg-quartz/30"}`} />
        <Music className={`w-4 h-4 transition-colors ${isOpen ? "text-cobalt" : "text-quartz/50 group-hover:text-quartz"}`} />
        <span className="text-xs font-body text-quartz/50 group-hover:text-quartz transition-colors hidden md:block">
          {isOpen ? "Reproduciendo" : "Espacio Premeditadamente Vacío"}
        </span>
      </motion.button>

      {/* Player panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 left-8 z-40 w-[360px] max-w-[calc(100vw-4rem)] rounded-2xl overflow-hidden glass-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-quartz/10">
              <div className="min-w-0">
                <p className="text-xs font-display font-semibold text-quartz truncate">Espacio Premeditadamente Vacío</p>
                <p className="text-[10px] text-quartz/30 font-body truncate">Enri La Forêt · 2026</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-quartz/10 transition-colors text-quartz/40 hover:text-quartz shrink-0 ml-2"
                aria-label="Cerrar reproductor"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Album art */}
            <a href={ALBUM_URL} target="_blank" rel="noopener noreferrer" className="block relative group">
              <img
                src={ALBUM_ART}
                alt="Espacio Premeditadamente Vacío — Enri La Forêt"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-obsidian/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-cobalt flex items-center justify-center">
                  <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                </div>
              </div>
            </a>

            {/* Tracklist */}
            <div className="max-h-[200px] overflow-y-auto">
              {TRACKS.map((track) => (
                <a
                  key={track.n}
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-quartz/5 transition-colors group"
                >
                  <span className="text-cobalt font-mono text-xs w-4 text-center">{track.n}</span>
                  <span className="text-sm text-quartz/60 group-hover:text-quartz transition-colors font-body flex-1 truncate">
                    {track.title}
                  </span>
                  <span className="text-xs text-quartz/25 font-body">{track.duration}</span>
                </a>
              ))}
            </div>

            {/* CTA */}
            <a
              href={ALBUM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-cobalt/10 hover:bg-cobalt/20 text-cobalt text-xs font-medium transition-colors border-t border-quartz/10"
            >
              <Disc className="w-3.5 h-3.5" />
              Escuchar en Bandcamp
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}