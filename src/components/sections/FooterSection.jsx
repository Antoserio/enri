import React from "react";

export default function FooterSection() {
  return (
    <footer className="relative py-16 md:py-24 border-t border-quartz/10" style={{ background: "#0A0A0B" }}>
      <div className="px-[5vw] md:px-[10vw]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="font-display font-bold text-xl text-quartz">Enri La Forêt</p>
            <p className="text-sm text-quartz/30 font-body mt-3 leading-relaxed">
              Espacio Premeditadamente Vacío — música electrónica experimental desde Madrid.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="!text-[11px] tracking-widest uppercase text-quartz/25 font-body mb-4">Navegar</p>
            <div className="space-y-3">
              <a href="#scroll-experience" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">Obra</a>
              <a href="#about" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">Sobre</a>
              <a href="https://enrilaforet.bandcamp.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">Bandcamp</a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="!text-[11px] tracking-widest uppercase text-quartz/25 font-body mb-4">Conectar</p>
            <div className="space-y-3">
              <a href="https://www.instagram.com/enrilaforet/" target="_blank" rel="noopener noreferrer" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">Instagram</a>
              <a href="https://enrilaforet.bandcamp.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">Bandcamp</a>
              <a href="https://enrilaforet.bandcamp.com/contact" target="_blank" rel="noopener noreferrer" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">Contacto</a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="!text-[11px] tracking-widest uppercase text-quartz/25 font-body mb-4">Info</p>
            <div className="space-y-3">
              <p className="text-sm text-quartz/25 font-body">Madrid, Spain</p>
              <p className="text-sm text-quartz/25 font-body">© 2026 · all rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}