import React from "react";
import { motion } from "framer-motion";
import WorkSlice from "@/components/sections/WorkSlice";

export default function ElasticGallery({ projects, onSelectProject }) {
  return (
    <section
      id="work"
      className="relative py-24 md:py-32"
      style={{ background: "#F2F2F7" }}
      aria-label="Selected works"
    >
      {/* Section header */}
      <div className="px-[10vw] mb-16 md:mb-24">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-xs tracking-widest uppercase text-obsidian/40 font-body mb-3"
        >
          Selected Works
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-bold text-obsidian"
          style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
        >
          The Elastic Gallery
        </motion.h2>
      </div>

      {/* Work slices */}
      <div>
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <WorkSlice
              project={project}
              index={i}
              onSelect={onSelectProject}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}