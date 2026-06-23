import React from "react";
import { motion } from "framer-motion";
import { Calendar, Disc, User } from "lucide-react";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-24 md:py-40 border-t border-quartz/5"
      style={{ background: "#0A0A0B" }}
      aria-label="Sobre Enri La Forêt"
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
            <p className="text-xs tracking-widest uppercase text-cobalt font-body">Sobre</p>
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
              Espacio Premeditadamente Vacío
            </h2>

            <div className="space-y-6 text-quartz/40 font-body font-light text-base md:text-lg max-w-3xl" style={{ lineHeight: 1.7 }}>
              <p>
                Es el primer álbum del músico y compositor Enri La Forêt. Nace de una propuesta
                sonora en formato Live/AV, muy cercana a las artes vivas, en la que música, imagen
                de gran formato, poesía, texto y voz conforman un dispositivo artístico expandido
                que culmina con la publicación de este LP.
              </p>
              <p>
                Su deseo es el de invitar a reflexionar de forma crítica acerca de las violencias
                sistémicas y las estructuras de poder a las que nos vemos sometidxs y atravesadxs
                como sociedad y como individuos. Y, sobre todo, existe la voluntad de abrir un
                espacio de pensamiento para imaginar formas más conscientes y humanas de
                relacionarnos con nuestro presente y nuestro futuro, dentro del contexto
                turbocapitalista actual.
              </p>
              <p>
                La arquitectura sonora de este álbum transiciona desde sonidos crudos y beats
                rotundos propios del techno industrial, hasta armonías luminosas generadas con
                sintetizadores, arpegiadores y voces corales, pasando por texturas ambientales
                creadas con pianos preparados y samples de voces. La textualidad y la poesía
                actúan como elementos vehiculares de esta propuesta y están muy presentes a lo
                largo de todo el álbum.
              </p>
            </div>

            {/* Bio del artista */}
            <div className="mt-12 pt-12 border-t border-quartz/10">
              <p className="flex items-center gap-2 text-xs tracking-widest uppercase text-cobalt font-body mb-4">
                <User className="w-3.5 h-3.5" /> El Artista
              </p>
              <p className="text-quartz/40 font-body font-light text-base md:text-lg max-w-3xl" style={{ lineHeight: 1.7 }}>
                Enri La Forêt es músico de formación clásica, residente en Madrid. Actualmente
                enfocado en la composición musical electrónica, su campo de creación se basa en la
                búsqueda de lugares de encuentro entre sonoridades múltiples y en la
                experimentación con otros lenguajes —imagen, texto, voz o artes vivas— para
                construir dispositivos artísticos desde los que manifestar narrativas disidentes.
              </p>
            </div>

            {/* Créditos */}
            <div className="mt-12 pt-12 border-t border-quartz/10">
              <p className="flex items-center gap-2 text-xs tracking-widest uppercase text-cobalt font-body mb-4">
                <Calendar className="w-3.5 h-3.5" /> Créditos
              </p>
              <p className="text-sm text-quartz/25 font-body mb-6">Lanzado el 20 de marzo de 2026</p>
              <ul className="space-y-2 text-quartz/40 font-body text-sm max-w-3xl" style={{ lineHeight: 1.6 }}>
                <li><span className="text-quartz/60">Música original, composición e interpretación:</span> Enri La Forêt</li>
                <li><span className="text-quartz/60">Producción y arreglos:</span> Enri La Forêt y Rubén Kielmannsegge</li>
                <li><span className="text-quartz/60">Mezcla:</span> Rubén Kielmannsegge</li>
                <li><span className="text-quartz/60">Mastering:</span> Carlos Koschitzky</li>
                <li><span className="text-quartz/60">Diseño de arte:</span> Raquel G. Ibáñez</li>
                <li><span className="text-quartz/60">Sumergirse en el naufragio:</span> Letra del poema homónimo de Adrienne Rich, traducido por Patricia Gonzalo de Jesús (Editorial Sexto Piso, 2021). Narrado por Helena Mariño.</li>
              </ul>
            </div>

            {/* Tracklist */}
            <div className="mt-12 pt-12 border-t border-quartz/10">
              <p className="flex items-center gap-2 text-xs tracking-widest uppercase text-cobalt font-body mb-4">
                <Disc className="w-3.5 h-3.5" /> Tracklist
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

            {/* Tags */}
            <div className="mt-12 pt-12 border-t border-quartz/10">
              <p className="text-xs tracking-widest uppercase text-cobalt font-body mb-4">Tags</p>
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