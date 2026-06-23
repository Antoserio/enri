import React from "react";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-24 md:py-40 border-t border-quartz/5"
      style={{ background: "#0A0A0B" }}
      aria-label="About the studio"
    >
      <div className="px-[5vw] md:px-[10vw]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="md:col-span-3"
          >
            <p className="text-xs tracking-widest uppercase text-cobalt font-body">About</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="md:col-span-9"
          >
            <h2
              className="font-display font-bold text-quartz leading-tight mb-10"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)" }}
            >
              We build immersive digital experiences that blur the line between art and technology.
            </h2>
            <p className="text-quartz/40 font-body font-light text-lg leading-relaxed max-w-3xl" style={{ lineHeight: 1.6 }}>
              Our studio works at the frontier of creative technology — crafting interactive
              installations, award-winning web experiences, and visual identities for artists,
              brands, and cultural institutions. Every project is an experiment in pushing
              what's possible in a browser.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-quartz/10">
              {[
                { value: "47+", label: "Projects" },
                { value: "12", label: "Awards" },
                { value: "8", label: "Years" },
                { value: "∞", label: "Ambition" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                >
                  <p className="font-display font-bold text-3xl md:text-4xl text-quartz">{stat.value}</p>
                  <p className="text-sm text-quartz/25 font-body mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}