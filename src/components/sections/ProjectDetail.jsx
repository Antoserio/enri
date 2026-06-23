import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ProjectDetail({ project, onClose }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={project.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: "#F2F2F7" }}
      >
        {/* Close / Back */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] md:px-[10vw] py-6 glass-panel"
        >
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-obsidian/60 hover:text-obsidian transition-colors focus:outline-none focus:ring-2 focus:ring-cobalt rounded-md px-2 py-1"
            aria-label="Go back to works"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <MagneticButton
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-obsidian/10 flex items-center justify-center hover:bg-obsidian hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-cobalt"
            strength={0.2}
          >
            <X className="w-4 h-4" />
          </MagneticButton>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[70vh] md:h-[85vh] overflow-hidden mt-16"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Project info */}
        <div className="px-[5vw] md:px-[10vw] py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            {/* Left — Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="md:col-span-7"
            >
              <p className="text-xs tracking-widest uppercase text-cobalt font-body mb-4">
                {project.category}
              </p>
              <h1
                className="font-display font-bold text-obsidian leading-tight"
                style={{ fontSize: "clamp(2rem, 5vw, 5rem)" }}
              >
                {project.title}
              </h1>
              <p className="mt-8 text-lg text-obsidian/60 font-body font-light leading-relaxed max-w-2xl">
                {project.description}
              </p>
            </motion.div>

            {/* Right — Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="md:col-span-5"
            >
              <div className="space-y-8 pt-2">
                <div>
                  <p className="text-xs tracking-widest uppercase text-obsidian/30 font-body mb-2">Role</p>
                  <p className="text-base text-obsidian font-body">{project.role}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-obsidian/30 font-body mb-2">Year</p>
                  <p className="text-base text-obsidian font-body">{project.year}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-obsidian/30 font-body mb-2">Technology</p>
                  <p className="text-base text-obsidian font-body">{project.tech}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Technical Breakout */}
        <div className="px-[5vw] md:px-[10vw] pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-obsidian rounded-2xl p-8 md:p-16 text-white"
          >
            <p className="text-xs tracking-widest uppercase text-cobalt mb-6">Technical Breakout</p>
            <h3 className="font-display font-bold text-2xl md:text-3xl mb-6">The Process</h3>
            <p className="text-white/60 font-body font-light leading-relaxed text-base md:text-lg max-w-3xl">
              {project.process}
            </p>
          </motion.div>
        </div>

        {/* Gallery secondary image */}
        {project.image2 && (
          <div className="px-[5vw] md:px-[10vw] pb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl overflow-hidden"
            >
              <img
                src={project.image2}
                alt={`${project.title} detail`}
                className="w-full h-[50vh] md:h-[70vh] object-cover"
              />
            </motion.div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}