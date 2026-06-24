import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, ExternalLink } from "lucide-react";

export default function MobileSlider({ projects, onProjectClick }) {
  const [current, setCurrent]     = useState(0);
  const [scanned, setScanned]     = useState(false);
  const [transitioning, setTrans] = useState(false);
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);

  // Scan reveal on mount
  useEffect(() => {
    const t = setTimeout(() => setScanned(true), 1600);
    return () => clearTimeout(t);
  }, []);

  const goTo = (next) => {
    if (transitioning) return;
    const clamped = Math.max(0, Math.min(projects.length - 1, next));
    if (clamped === current) return;
    setTrans(true);
    setCurrent(clamped);
    setTimeout(() => setTrans(false), 500);
  };

  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    const dx = Math.abs(touchStartX.current - e.changedTouches[0].clientX);
    if (Math.abs(dy) < 40 || dx > Math.abs(dy)) return; // too short or horizontal
    goTo(dy > 0 ? current + 1 : current - 1);
    touchStartY.current = null;
  };

  const proj = projects[current];
  const isFirst = current === 0;

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#0A0A0B" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={proj.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img
            src={proj.image}
            alt={proj.title}
            className="w-full h-full object-cover"
            style={{
              filter: isFirst ? "grayscale(1) brightness(0.75)" : "brightness(0.65)",
            }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(10,10,11,0.2) 0%, rgba(10,10,11,0) 40%, rgba(10,10,11,0.85) 100%)" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Scan line reveal on first load */}
      {!scanned && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ background: "#0A0A0B" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          animate={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.4, ease: "linear", delay: 0.1 }}
        >
          {/* scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px"
            style={{ background: "rgba(26,86,219,0.9)", boxShadow: "0 0 12px 2px rgba(26,86,219,0.6)" }}
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.4, ease: "linear", delay: 0.1 }}
          />
        </motion.div>
      )}

      {/* Project info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={proj.id + "-info"}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="absolute bottom-0 left-0 right-0 px-6 pb-10 z-10"
        >
          <p className="text-[10px] tracking-widest uppercase text-[#1A56DB] font-body mb-2">
            {proj.category}
          </p>
          <h2
            className="font-display font-bold text-white leading-tight mb-5"
            style={{ fontSize: "clamp(1.4rem, 7vw, 2.2rem)" }}
          >
            {proj.title}
          </h2>

          {/* Action button */}
          <button
            onClick={() => onProjectClick(proj)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white/80 text-sm font-body backdrop-blur-sm active:scale-95 transition-transform"
          >
            {proj.tracks
              ? <><Music className="w-3.5 h-3.5" /> <span>Escuchar</span></>
              : <><ExternalLink className="w-3.5 h-3.5" /> <span>Ver</span></>
            }
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="w-1.5 rounded-full transition-all duration-300"
            style={{
              height: i === current ? "20px" : "6px",
              background: i === current ? "#1A56DB" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
