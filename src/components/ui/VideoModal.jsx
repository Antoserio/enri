import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function VideoModal({ project, onClose }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(10, 10, 11, 0.96)" }}
        onClick={onClose}
      >
        {/* Close */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-6 right-6 md:top-10 md:right-10 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <MagneticButton
            onClick={onClose}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-obsidian transition-all text-white focus:outline-none focus:ring-2 focus:ring-cobalt"
            strength={0.2}
          >
            <X className="w-5 h-5" />
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Video or Ken Burns image */}
          {project.videoUrl ? (
            <video
              src={project.videoUrl}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-2xl shadow-2xl"
            />
          ) : (
            <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
              <motion.img
                src={project.image}
                alt={project.title}
                className="w-full"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1.15 }}
                transition={{ duration: 12, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
              />
            </div>
          )}

          {/* Project info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-end justify-between"
          >
            <div>
              <p className="text-xs tracking-widest uppercase text-cobalt mb-2">{project.category}</p>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white">{project.title}</h3>
              <p className="mt-2 text-sm text-white/40 max-w-xl" style={{ lineHeight: 1.6 }}>
                {project.description}
              </p>
            </div>
            <p className="text-sm text-white/30 hidden md:block ml-4 shrink-0">{project.year}</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}