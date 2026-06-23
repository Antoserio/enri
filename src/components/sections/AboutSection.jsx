import React from "react";
import { motion } from "framer-motion";
import { Calendar, Disc, User } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      className="relative py-24 md:py-40 border-t border-quartz/5"
      style={{ background: "#0A0A0B" }}
      aria-label="About Enri La Forêt"
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
            <p className="text-xs tracking-widest uppercase text-cobalt font-body">{t.about.label}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="md:col-span-9"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-8 mb-10">
              <img
                src="https://f4.bcbits.com/img/a2297333929_10.jpg"
                alt="Espacio Premeditadamente Vacío — portada"
                className="w-40 md:w-52 aspect-square object-cover rounded-sm shrink-0"
                style={{ boxShadow: "0 0 40px rgba(77,77,255,0.15)" }}
              />
              <h2
                className="font-display font-bold text-quartz leading-tight self-end"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)" }}
              >
                Espacio Premeditadamente Vacío
              </h2>
            </div>

            <div className="space-y-6 text-quartz/40 font-body font-light text-base md:text-lg max-w-3xl" style={{ lineHeight: 1.7 }}>
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>

            <div className="mt-12 pt-12 border-t border-quartz/10">
              <p className="flex items-center gap-2 text-xs tracking-widest uppercase text-cobalt font-body mb-4">
                <User className="w-3.5 h-3.5" /> {t.about.artistLabel}
              </p>
              <div className="space-y-4 text-quartz/40 font-body font-light text-base md:text-lg max-w-3xl" style={{ lineHeight: 1.7 }}>
                {t.about.bio.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-quartz/10">
              <p className="flex items-center gap-2 text-xs tracking-widest uppercase text-cobalt font-body mb-4">
                <Calendar className="w-3.5 h-3.5" /> {t.about.creditsLabel}
              </p>
              <p className="text-sm text-quartz/25 font-body mb-6">{t.about.released}</p>
              <ul className="space-y-2 text-quartz/40 font-body text-sm max-w-3xl" style={{ lineHeight: 1.6 }}>
                <li><span className="text-quartz/60">{t.about.music}</span> Enri La Forêt</li>
                <li><span className="text-quartz/60">{t.about.production}</span> Enri La Forêt y Rubén Kielmannsegge</li>
                <li><span className="text-quartz/60">{t.about.mix}</span> Rubén Kielmannsegge</li>
                <li><span className="text-quartz/60">{t.about.mastering}</span> Carlos Koschitzky</li>
                <li><span className="text-quartz/60">{t.about.art}</span> Raquel G. Ibáñez</li>
                <li><span className="text-quartz/60">{t.about.poem}</span> {t.about.poemDesc}</li>
              </ul>
            </div>

            <div className="mt-12 pt-12 border-t border-quartz/10">
              <p className="flex items-center gap-2 text-xs tracking-widest uppercase text-cobalt font-body mb-4">
                <Disc className="w-3.5 h-3.5" /> {t.about.tracklistLabel}
              </p>
              <ol className="space-y-3 max-w-2xl">
                {[
                  { n: "1", title: "El muro", duration: "06:09" },
                  { n: "2", title: "Bil'in", duration: "05:22" },
                  { n: "3", title: "¿Hasta cuándo?", duration: "04:20" },
                  { n: "4", title: "Sumergirse en el naufragio", duration: "06:08" },
                  { n: "5", title: "La brecha", duration: "05:46" },
                ].map((track, i) => (
                  <motion.li
                    key={track.n}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between py-2 border-b border-quartz/5"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-cobalt font-mono text-sm">{track.n}</span>
                      <span className="text-quartz/60 font-body">{track.title}</span>
                    </div>
                    <span className="text-quartz/25 font-body text-sm">{track.duration}</span>
                  </motion.li>
                ))}
              </ol>
            </div>

            <div className="mt-12 pt-12 border-t border-quartz/10">
              <p className="text-xs tracking-widest uppercase text-cobalt font-body mb-4">{t.about.tagsLabel}</p>
              <div className="flex flex-wrap gap-2">
                {["electronic", "experimental", "ambient electronic", "contemporary classical", "techno", "Madrid"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-quartz/5 text-quartz/40 text-xs font-body">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}