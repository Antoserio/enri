import React, { useRef } from "react";
import { motion } from "framer-motion";
import HeroScene from "@/components/three/HeroScene";
import MagneticButton from "@/components/ui/MagneticButton";
import { ChevronDown } from "lucide-react";

export default function HeroSection({ onExplore }) {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ background: "#F2F2F7" }}
      aria-label="Hero — Studio Creative Works"
    >
      {/* 3D Scene */}
      <HeroScene containerRef={containerRef} />

      {/* Hidden a11y description */}
      <div className="sr-only" aria-live="polite">
        A rotating crystalline 3D geometric structure representing creative craft, surrounded by floating particles in a luminous void.
      </div>

      {/* Floating typography */}
      <div className="relative z-10 pointer-events-none text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-sm md:text-base tracking-widest uppercase text-obsidian/50 font-body mb-4"
        >
          Creative Studio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-obsidian leading-none"
          style={{ fontSize: "clamp(2.5rem, 8vw, 10rem)" }}
        >
          We Create
          <br />
          <span className="text-cobalt">Worlds</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-6 text-lg md:text-xl text-obsidian/60 font-body font-light max-w-xl mx-auto"
          style={{ lineHeight: 1.6 }}
        >
          Immersive digital experiences at the intersection of art, technology, and emotion.
        </motion.p>
      </div>

      {/* Pulse navigation button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <MagneticButton
          onClick={onExplore}
          className="w-14 h-14 rounded-full bg-obsidian/5 border border-obsidian/10 flex items-center justify-center hover:bg-cobalt hover:border-cobalt transition-colors duration-500 group focus:outline-none focus:ring-2 focus:ring-cobalt focus:ring-offset-2"
        >
          <ChevronDown className="w-5 h-5 text-obsidian/50 group-hover:text-white transition-colors" />
        </MagneticButton>
      </motion.div>
    </section>
  );
}