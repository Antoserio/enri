import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function WorkSlice({ project, index, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const sliceRef = useRef(null);

  return (
    <motion.div
      ref={sliceRef}
      className="relative group cursor-pointer overflow-hidden"
      style={{ height: isHovered ? "40vh" : "16vh", transition: "height 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      aria-label={`View project: ${project.title}`}
      onKeyDown={(e) => e.key === "Enter" && onSelect(project)}
    >
      {/* Background image — revealed on hover */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: isHovered ? 0.15 : 0, scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={project.image}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-[10vw]">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-baseline gap-6 md:gap-10">
            <span className="text-xs md:text-sm text-obsidian/30 font-mono tabular-nums w-8">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3
              className="font-display font-bold text-obsidian transition-colors duration-500 group-hover:text-cobalt"
              style={{ fontSize: "clamp(1.5rem, 4vw, 4rem)" }}
            >
              {project.title}
            </h3>
          </div>

          <div className="flex items-center gap-6">
            <motion.span
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.4 }}
              className="hidden md:block text-sm text-obsidian/50 font-body"
            >
              {project.category}
            </motion.span>
            <motion.div
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0, rotate: isHovered ? 0 : -45 }}
              transition={{ duration: 0.4 }}
            >
              <ArrowUpRight className="w-6 h-6 text-cobalt" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-[10vw] right-[10vw] h-px bg-obsidian/10" />

      {/* Hover accent line */}
      <motion.div
        className="absolute bottom-0 left-[10vw] h-px bg-cobalt"
        initial={false}
        animate={{ width: isHovered ? "80vw" : "0" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}