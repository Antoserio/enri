import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import EventsGeometry from "@/components/three/EventsGeometry";

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    setEvents([
      {
        id: 1,
        title: "Espacio Premeditadamente Vacío · Live/AV",
        date: "2026-05-23",
        location: "Casabanchel — Madrid",
        type: "live"
      },
      {
        id: 2,
        title: "Presentación álbum · Coloquio y escucha activa",
        date: "2026-04-24",
        location: "Espacio Montreal — Madrid",
        type: "presentacion"
      },
      {
        id: 3,
        title: "Espacio Premeditadamente Vacío · Estreno Live/AV",
        date: "2025-10-25",
        location: "Cruce Contemporáneo — Madrid",
        type: "live"
      },
    ]);
  }, []);

  const getEventColor = (type) => {
    const colors = {
      live: "text-cobalt",
      presentacion: "text-quartz/50",
    };
    return colors[type] || "text-cobalt";
  };

  return (
    <section id="eventos" className="relative min-h-screen py-24 px-6 md:px-12 bg-gradient-to-b from-obsidian via-obsidian/95 to-obsidian overflow-hidden">
      <EventsGeometry />
      <div className="max-w-6xl mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs md:text-sm tracking-widest uppercase text-cobalt mb-3 font-body">
            Conciertos
          </p>
          <h2 className="font-display font-bold text-quartz leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Directos & Presentaciones
          </h2>
        </motion.div>

        <div className="grid gap-4 md:gap-6">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group glass-panel p-5 md:p-6 hover:border-cobalt/40 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-body tracking-widest uppercase ${getEventColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-quartz text-lg md:text-xl mb-3 group-hover:text-cobalt transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-xs md:text-sm text-quartz/60 font-body">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cobalt" />
                      <span>{new Date(event.date).toLocaleDateString("es-ES", { month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cobalt" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-cobalt/10 flex items-center justify-center group-hover:bg-cobalt/20 transition-colors shrink-0">
                  <Calendar className="w-5 h-5 text-cobalt" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}