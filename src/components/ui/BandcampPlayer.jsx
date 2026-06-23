import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X } from "lucide-react";

export default function BandcampPlayer() {
  const [isOpen, setIsOpen] = useState(false);

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
          {isOpen ? "Now Playing" : "La Brecha"}
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
            className="fixed bottom-24 left-8 z-40 w-[320px] max-w-[calc(100vw-4rem)] rounded-2xl overflow-hidden glass-panel"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-quartz/10">
              <div>
                <p className="text-xs font-display font-semibold text-quartz">La Brecha</p>
                <p className="text-[10px] text-quartz/30 font-body">Enri La Forêt</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-quartz/10 transition-colors text-quartz/40 hover:text-quartz"
                aria-label="Close player"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <iframe
              src="https://bandcamp.com/EmbeddedPlayer/album=2297333929/size=small/bgcol=0A0A0B/linkcol=4D4DFF/tracklist=false/t=4/transparent=true/"
              seamless
              className="w-full"
              style={{ border: 0, height: 120 }}
              title="La Brecha — Enri La Forêt"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}