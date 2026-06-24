import React, { useState, useRef, useEffect } from "react";
import { Music, ExternalLink } from "lucide-react";

export default function MobileSlider({ projects, onProjectClick }) {
  const [current, setCurrent] = useState(0);
  const [scanned, setScanned] = useState(false);
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);
  const lockRef     = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setScanned(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const goTo = (next) => {
    if (lockRef.current) return;
    const clamped = Math.max(0, Math.min(projects.length - 1, next));
    if (clamped === current) return;
    lockRef.current = true;
    setCurrent(clamped);
    setTimeout(() => { lockRef.current = false; }, 350);
  };

  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    const dx = Math.abs(touchStartX.current - e.changedTouches[0].clientX);
    touchStartY.current = null;
    if (Math.abs(dy) < 45 || dx > Math.abs(dy) * 0.8) return;
    goTo(dy > 0 ? current + 1 : current - 1);
  };

  const proj = projects[current];

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#0A0A0B", touchAction: "pan-x" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Images — all stacked, only current visible */}
      {projects.map((p, i) => (
        <div
          key={p.id}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: i === current ? "auto" : "none",
          }}
        >
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-full object-cover"
            style={{
              filter: p.id === "enri-portrait" ? "grayscale(1) brightness(0.75)" : "brightness(0.6)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(10,10,11,0.1) 0%, rgba(10,10,11,0) 35%, rgba(10,10,11,0.9) 100%)" }}
          />
        </div>
      ))}

      {/* Scan reveal on first load */}
      {!scanned && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: "#0A0A0B",
              animation: "scanReveal 1.4s linear 0.1s forwards",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "2px",
              background: "rgba(26,86,219,0.9)",
              boxShadow: "0 0 12px 3px rgba(26,86,219,0.5)",
              animation: "scanLine 1.4s linear 0.1s forwards",
            }}
          />
          <style>{`
            @keyframes scanReveal {
              from { clip-path: inset(0 0 0% 0); }
              to   { clip-path: inset(0 0 100% 0); }
            }
            @keyframes scanLine {
              from { top: 0%; }
              to   { top: 100%; }
            }
          `}</style>
        </div>
      )}

      {/* Info — fades instantly */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 pb-10 z-10"
        style={{ transition: "opacity 0.2s ease" }}
      >
        <p
          key={proj.id + "-cat"}
          className="text-[10px] tracking-widest uppercase font-body mb-2"
          style={{ color: "#1A56DB" }}
        >
          {proj.category}
        </p>
        <h2
          key={proj.id + "-title"}
          className="font-display font-bold text-white leading-tight mb-5"
          style={{ fontSize: "clamp(1.4rem, 7vw, 2.2rem)" }}
        >
          {proj.title}
        </h2>

        <button
          onPointerDown={() => onProjectClick(proj)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white/80 text-sm font-body active:scale-95"
          style={{
            border: "1px solid rgba(255,255,255,0.2)",
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            transition: "transform 0.1s ease",
          }}
        >
          {proj.tracks
            ? <><Music className="w-3.5 h-3.5" /><span>Escuchar</span></>
            : <><ExternalLink className="w-3.5 h-3.5" /><span>Ver</span></>
          }
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute right-4 top-1/2 z-10 flex flex-col gap-2" style={{ transform: "translateY(-50%)" }}>
        {projects.map((_, i) => (
          <div
            key={i}
            style={{
              width: "6px",
              borderRadius: "9999px",
              height: i === current ? "20px" : "6px",
              background: i === current ? "#1A56DB" : "rgba(255,255,255,0.25)",
              transition: "height 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
