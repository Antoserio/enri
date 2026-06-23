import React from "react";

export default function FooterSection() {
  return (
    <footer className="relative py-16 md:py-24 border-t border-quartz/10" style={{ background: "#0A0A0B" }}>
      <div className="px-[5vw] md:px-[10vw]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="font-display font-bold text-xl text-quartz">Studio</p>
            <p className="text-sm text-quartz/30 font-body mt-3 leading-relaxed">
              Immersive digital experiences at the intersection of art, technology, and emotion.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="!text-[11px] tracking-widest uppercase text-quartz/25 font-body mb-4">Navigate</p>
            <div className="space-y-3">
              <a href="#scroll-experience" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">Work</a>
              <a href="#about" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">About</a>
              <a href="mailto:hello@studio.com" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">Contact</a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="!text-[11px] tracking-widest uppercase text-quartz/25 font-body mb-4">Connect</p>
            <div className="space-y-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">Twitter / X</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">LinkedIn</a>
              <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">Vimeo</a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="!text-[11px] tracking-widest uppercase text-quartz/25 font-body mb-4">Info</p>
            <div className="space-y-3">
              <a href="mailto:hello@studio.com" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">hello@studio.com</a>
              <p className="text-sm text-quartz/25 font-body">Madrid, Spain</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-quartz/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-quartz/20 font-body">© 2026 Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-xs text-quartz/20 hover:text-quartz transition-colors font-body">Privacy Policy</a>
            <a href="/terms" className="text-xs text-quartz/20 hover:text-quartz transition-colors font-body">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}