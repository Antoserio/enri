import React from "react";
import { motion } from "framer-motion";

export default function FooterSection() {
  return (
    <footer className="relative py-16 md:py-24 border-t border-obsidian/10" style={{ background: "#F2F2F7" }}>
      <div className="px-[5vw] md:px-[10vw]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <p className="font-display font-bold text-xl text-obsidian">Studio</p>
            <p className="text-sm text-obsidian/40 font-body mt-3 leading-relaxed">
              Immersive digital experiences at the intersection of art, technology, and emotion.
            </p>
          </div>

          {/* Nav */}
          <div className="md:col-span-2">
            <p className="text-xs tracking-widest uppercase text-obsidian/30 font-body mb-4">Navigate</p>
            <div className="space-y-3">
              <a href="#work" className="block text-sm text-obsidian/60 hover:text-cobalt transition-colors font-body">Work</a>
              <a href="#about" className="block text-sm text-obsidian/60 hover:text-cobalt transition-colors font-body">About</a>
              <a href="#contact" className="block text-sm text-obsidian/60 hover:text-cobalt transition-colors font-body">Contact</a>
            </div>
          </div>

          {/* Social */}
          <div className="md:col-span-3">
            <p className="text-xs tracking-widest uppercase text-obsidian/30 font-body mb-4">Connect</p>
            <div className="space-y-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-obsidian/60 hover:text-cobalt transition-colors font-body">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-obsidian/60 hover:text-cobalt transition-colors font-body">Twitter / X</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-obsidian/60 hover:text-cobalt transition-colors font-body">LinkedIn</a>
              <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-obsidian/60 hover:text-cobalt transition-colors font-body">Vimeo</a>
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-3">
            <p className="text-xs tracking-widest uppercase text-obsidian/30 font-body mb-4">Info</p>
            <div className="space-y-3">
              <a href="mailto:hello@studio.com" className="block text-sm text-obsidian/60 hover:text-cobalt transition-colors font-body">hello@studio.com</a>
              <p className="text-sm text-obsidian/40 font-body">Madrid, Spain</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-obsidian/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-obsidian/30 font-body">© 2026 Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-xs text-obsidian/30 hover:text-obsidian transition-colors font-body">Privacy Policy</a>
            <a href="/terms" className="text-xs text-obsidian/30 hover:text-obsidian transition-colors font-body">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}