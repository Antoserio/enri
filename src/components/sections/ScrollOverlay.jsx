import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointerClick, ChevronDown } from "lucide-react";

export default function ScrollOverlay({ projects }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const container = document.getElementById("scroll-experience");
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const total = container.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(1, Math.max(0, scrolled / total)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showHero = progress < 0.05;
  const showEnd = progress > 0.97;

  let activeProject = null;
  let activeOpacity = 0;
  if (!showHero && !showEnd) {
    projects.forEach((p, i) => {
      const screenT = 0.12 + (i / projects.length) * 0.72;
      const dist = Math.abs(progress - screenT);
      if (dist < 0.06) {
        const opacity = 1 - dist / 0.06;
        if (opacity > activeOpacity) {
          activeOpacity = opacity;
          activeProject = p;
        }
      }
    });
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Hero text */}
      <AnimatePresence>
        {showHero && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <p className="text-xs md:text-sm tracking-widest uppercase text-quartz/40 mb-4 font-body">
              Creative Studio
            </p>
            <h1
              className="font-display font-bold text-quartz leading-none"
              style={{ fontSize: "clamp(2.5rem, 8vw, 9rem)" }}
            >
              We Create
              <br />
              <span className="text-cobalt">Worlds</span>
            </h1>
            <p
              className="mt-6 text-base md:text-lg text-quartz/40 font-body font-light max-w-xl"
              style={{ lineHeight: 1.6 }}
            >
              Immersive digital experiences at the intersection of art, technology, and emotion.
            </p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-12 flex flex-col items-center gap-2"
            >
              <span className="text-[10px] md:text-xs tracking-widest uppercase text-quartz/30 font-body">
                Scroll to explore
              </span>
              <ChevronDown className="w-4 h-4 text-quartz/30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project title near each screen */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: activeOpacity, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-[10px] md:text-xs tracking-widest uppercase text-cobalt mb-2 font-body">
              {activeProject.category}
            </p>
            <h2
              className="font-display font-bold text-quartz"
              style={{ fontSize: "clamp(1.25rem, 3.5vw, 2.5rem)" }}
            >
              {activeProject.title}
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs md:text-sm text-quartz/30 font-body">
              <MousePointerClick className="w-4 h-4" />
              <span>Click to explore</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End text */}
      <AnimatePresence>
        {showEnd && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center text-center"
          >
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs tracking-widest uppercase text-quartz/40 font-body">Continue</p>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <ChevronDown className="w-6 h-6 text-quartz/40" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}