import React from "react";
import { Heart } from "lucide-react";
import SocialIcons from "@/components/ui/SocialIcons";
import { useLanguage } from "@/lib/LanguageContext";

export default function FooterSection() {
  const { t } = useLanguage();

  return (
    <footer className="relative py-16 md:py-24 border-t border-quartz/10" style={{ background: "#0A0A0B" }}>
      <div className="px-[5vw] md:px-[10vw]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-quartz/10">
          <div className="md:col-span-4">
            <p className="font-display font-bold text-xl text-quartz">Enri La Forêt</p>
            <p className="text-sm text-quartz/30 font-body mt-3 leading-relaxed">
              {t.footer.desc}
            </p>
            <SocialIcons className="mt-6" />
          </div>

          <div className="md:col-span-2">
            <p className="!text-[11px] tracking-widest uppercase text-quartz/25 font-body mb-4">{t.footer.navigate}</p>
            <div className="space-y-3">
              <a href="#scroll-experience" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">{t.footer.obra}</a>
              <a href="#about" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">{t.footer.about}</a>
              <a href="https://enrilaforet.bandcamp.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">{t.footer.bandcamp}</a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="!text-[11px] tracking-widest uppercase text-quartz/25 font-body mb-4">{t.footer.connect}</p>
            <div className="space-y-3">
              <a href="https://www.instagram.com/enrilaforet/" target="_blank" rel="noopener noreferrer" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">{t.footer.instagram}</a>
              <a href="https://enrilaforet.bandcamp.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">{t.footer.bandcamp}</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("open-contact")); }} className="block text-sm text-quartz/40 hover:text-cobalt transition-colors font-body">{t.footer.contact}</a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="!text-[11px] tracking-widest uppercase text-quartz/25 font-body mb-4">{t.footer.info}</p>
            <div className="space-y-3">
              <p className="text-sm text-quartz/25 font-body">{t.footer.location}</p>
              <p className="text-sm text-quartz/25 font-body">{t.footer.rights}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-quartz/25 font-body tracking-wide">
            {t.footer.bottomRights}
          </p>
          <a
            href="https://immerso.live"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-quartz/25 hover:text-cobalt transition-colors font-body tracking-wide"
          >
            {t.footer.powered} <Heart className="w-3 h-3 text-cobalt fill-cobalt" /> by IMMERSO.LIVE
          </a>
        </div>
      </div>
    </footer>
  );
}