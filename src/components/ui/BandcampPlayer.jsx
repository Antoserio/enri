import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X, ExternalLink, Calendar, Tag, User, Disc } from "lucide-react";

export default function BandcampPlayer() {
  const [isOpen, setIsOpen] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 z-40 flex items-center gap-3 px-5 h-12 rounded-full glass-panel hover:border-cobalt/40 transition-all focus:outline-none focus:ring-2 focus:ring-cobalt group"
        aria-label={isOpen ? "Close audio player" : "Open audio player"}
      >
        <div className={`w-2 h-2 rounded-full transition-all ${isOpen ? "bg-cobalt animate-pulse" : "bg-quartz/30"}`} />
        <Music className={`w-4 h-4 transition-colors ${isOpen ? "text-cobalt" : "text-quartz/50 group-hover:text-quartz"}`} />
        <span className="text-xs font-body text-quartz/50 group-hover:text-quartz transition-colors hidden md:block">
          {isOpen ? "Now Playing" : "Espacio Premeditadamente Vacío"}
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
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${showInfo ? "bg-cobalt/20 text-cobalt" : "hover:bg-quartz/10 text-quartz/40 hover:text-quartz"}`}
                  aria-label="Toggle album info"
                >
                  <Disc className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-quartz/10 transition-colors text-quartz/40 hover:text-quartz"
                  aria-label="Close player"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bandcamp iframe — full album with tracklist */}
            <iframe
              src="https://bandcamp.com/EmbeddedPlayer/album=2297333929/size=large/bgcol=0a0a0b/linkcol=4d4dff/tracklist=true/transparent=true/"
              className="w-full"
              style={{ border: 0, height: showInfo ? 300 : 470 }}
              allow="autoplay; encrypted-media"
              title="Espacio Premeditadamente Vacío — Enri La Forêt"
            />

            {/* Info section */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-4 space-y-4 text-[11px] font-body text-quartz/40 border-t border-quartz/10">
                    <div>
                      <p className="flex items-center gap-1.5 text-quartz/60 mb-1.5 font-medium">
                        <User className="w-3 h-3" /> Enri La Forêt
                      </p>
                      <p className="leading-relaxed">
                        Músico de formación clásica residente en Madrid. Enfocado en la composición
                        musical electrónica, su campo de creación se basa en la búsqueda de lugares de
                        encuentro entre sonoridades múltiples y en la experimentación con otros lenguajes
                        —imagen, texto, voz o artes vivas— para construir dispositivos artísticos desde
                        los que manifestar narrativas disidentes.
                      </p>
                    </div>

                    <div>
                      <p className="flex items-center gap-1.5 text-quartz/60 mb-1.5 font-medium">
                        <Disc className="w-3 h-3" /> Sobre el álbum
                      </p>
                      <p className="leading-relaxed">
                        Primer álbum de Enri La Forêt. Nace de una propuesta sonora en formato Live/AV,
                        muy cercana a las artes vivas, en la que música, imagen de gran formato, poesía,
                        texto y voz conforman un dispositivo artístico expandido.
                      </p>
                      <p className="mt-2 leading-relaxed">
                        Invita a reflexionar críticamente sobre las violencias sistémicas y las
                        estructuras de poder, con la voluntad de abrir un espacio de pensamiento para
                        imaginar formas más conscientes y humanas de relacionarnos con nuestro presente.
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <p className="flex items-center gap-1.5 text-quartz/60 font-medium">
                        <Calendar className="w-3 h-3" /> Créditos
                      </p>
                      <ul className="space-y-0.5 leading-relaxed">
                        <li>• Música, composición e interpretación: Enri La Forêt</li>
                        <li>• Producción y arreglos: Enri La Forêt y Rubén Kielmannsegge</li>
                        <li>• Mezcla: Rubén Kielmannsegge</li>
                        <li>• Mastering: Carlos Koschitzky</li>
                        <li>• Diseño de arte: Raquel G. Ibáñez</li>
                      </ul>
                    </div>

                    <div>
                      <p className="flex items-center gap-1.5 text-quartz/60 mb-1.5 font-medium">
                        <Tag className="w-3 h-3" /> Tags
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {["electronic", "experimental", "ambient electronic", "contemporary classical", "techno", "Madrid"].map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-quartz/5 text-quartz/35 text-[10px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a
                      href="https://enrilaforet.bandcamp.com/album/espacio-premeditadamente-vac-o"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-cobalt/10 hover:bg-cobalt/20 text-cobalt text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> Ver en Bandcamp
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}