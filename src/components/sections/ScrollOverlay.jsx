import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MousePointerClick, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

function getScreenPositions(count) {
  return Array.from({ length: count }, (_, i) => 0.12 + (i / count) * 0.72);
}

function buildScrollRemap(projectCount, dwellFraction = 0.08) {
  const screenTs = getScreenPositions(projectCount);
  const totalDwell = screenTs.length * dwellFraction;
  const totalTravel = 1 - totalDwell - 0.04;
  const camPoints = [0, ...screenTs, 0.99];
  const distances = [];
  for (let i = 0; i < camPoints.length - 1; i++) {
    distances.push(camPoints[i + 1] - camPoints[i]);
  }
  const sumDistances = distances.reduce((a, b) => a + b, 0);
  const stops = [[0, 0]];
  let p = 0.02;
  for (let i = 1; i < camPoints.length; i++) {
    p += (distances[i - 1] / sumDistances) * totalTravel;
    stops.push([p, camPoints[i]]);
    if (i < camPoints.length - 1) {
      p += dwellFraction;
      stops.push([p, camPoints[i]]);
    }
  }
  const scale = 1 / stops[stops.length - 1][0];
  stops.forEach((s) => { s[0] *= scale; });
  return { stops, screenTs };
}

function remapProgress(progress, stops) {
  if (progress <= stops[0][0]) return stops[0][1];
  if (progress >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, t0] = stops[i];
    const [p1, t1] = stops[i + 1];
    if (progress >= p0 && progress <= p1) {
      const localT = (progress - p0) / (p1 - p0);
      const smooth = localT * localT * (3 - 2 * localT);
      return t0 + (t1 - t0) * smooth;
    }
  }
  return stops[stops.length - 1][1];
}

export default function ScrollOverlay({ projects }) {
  const [progress, setProgress] = useState(0);
  const { t } = useLanguage();
  const { stops, screenTs } = useMemo(
    () => buildScrollRemap(projects.length),
    [projects.length]
  );

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

  const camT = remapProgress(progress, stops);
  const showHero = camT < 0.02;
  const showEnd = camT > 0.96;

  let activeProject = null;
  let activeProjectIndex = 0;
  let activeOpacity = 0;
  if (!showHero && !showEnd) {
    projects.forEach((p, i) => {
      const screenT = screenTs[i];
      const dist = Math.abs(camT - screenT);
      const prox = Math.max(0, 1 - dist * 5);
      if (prox > 0.01) {
        const opacity = prox * prox * 0.9;
        if (opacity > activeOpacity) {
          activeOpacity = opacity;
          activeProject = p;
          activeProjectIndex = i;
        }
      }
    });
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {showHero && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-xs md:text-sm tracking-widest uppercase text-quartz/40 mb-4 font-body">
            {t.hero.tagline}
          </p>
          <h1
            className="font-display font-bold text-quartz leading-none"
            style={{ fontSize: "clamp(1.5rem, 8vw, 5rem)" }}
          >
            {t.hero.title1}
            <br />
            <span className="text-cobalt">{t.hero.title2}</span>
            <br />
            {t.hero.title3}
          </h1>
          <p
            className="mt-4 md:mt-6 text-sm md:text-lg text-quartz/40 font-body font-light max-w-xs md:max-w-xl px-4"
            style={{ lineHeight: 1.6 }}
          >
            {t.hero.subtitle}
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] md:text-xs tracking-widest uppercase text-quartz/30 font-body">
              {t.hero.scroll}
            </span>
            <ChevronDown className="w-4 h-4 text-quartz/30" />
          </motion.div>
        </motion.div>
      )}

      {activeProject && (
        <motion.div
          key={activeProject.id}
          style={{ opacity: activeOpacity }}
          className={`absolute bottom-16 md:bottom-24 ${activeProjectIndex % 2 === 0 ? 'left-12 md:left-24 text-left' : 'right-12 md:right-24 text-right'}`}
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
          <div className="mt-3 flex items-center gap-2 text-xs md:text-sm text-quartz/30 font-body">
            <MousePointerClick className="w-4 h-4" />
            <span>{t.hero.click}</span>
          </div>
        </motion.div>
      )}

      {showEnd && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-center text-center"
        >
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs tracking-widest uppercase text-quartz/40 font-body">{t.hero.continue}</p>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-6 h-6 text-quartz/40" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}