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
    if (Math.abs(dy) < 50 || dx > Math.abs(dy) * 0.7) return;
    goTo(dy > 0 ? current + 1 : current - 1);
  };

  const proj = projects[current];

  // Stop swipe detection from firing when touching the info area
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#0A0A0B" }}
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
            transition: "opacity 0.35s ease",
            pointerEvents: "none",
          }}
        >
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-full object-cover"
            style={{
              filter: p.id === "enri-portrait" ? "grayscale(1) brightness(0.7)" : "brightness(0.55)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(10,10,11,0.1) 0%, rgba(10,10,11,0) 30%, rgba(10,10,11,0.92) 100%)" }}
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
              position: "absolute", left: 0, right: 0, height: "2px",
              background: "rgba(26,86,219,0.9)",
              boxShadow: "0 0 12px 3px rgba(26,86,219,0.5)",
              animation: "scanLine 1.4s linear 0.1s forwards",
            }}
          />
          <style>{`
            @keyframes scanReveal { from { clip-path: inset(0 0 0% 0); } to { clip-path: inset(0 0 100% 0); } }
            @keyframes scanLine   { from { top: 0%; } to { top: 100%; } }
          `}</style>
        </div>
      )}

      {/* Info — isolated from swipe detection */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom, 2.5rem))" }}
        onTouchStart={stopPropagation}
        onTouchEnd={stopPropagation}
      >
        <div className="px-6">
          <p className="text-[10px] tracking-widest uppercase font-body mb-2" style={{ color: "#1A56DB" }}>
            {proj.category}
          </p>
          <h2
            className="font-display font-bold text-white leading-tight mb-6"
            style={{ fontSize: "clamp(1.3rem, 6.5vw, 2rem)" }}
          >
            {proj.title}
          </h2>

          <button
            onClick={() => onProjectClick(proj)}
            className="flex items-center gap-2 text-white/85 text-sm font-body"
            style={{
              padding: "12px 24px",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(10,10,11,0.4)",
              backdropFilter: "blur(8px)",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              minHeight: "48px",
            }}
          >
            {proj.tracks
              ? <><Music className="w-4 h-4 shrink-0" /><span>Escuchar</span></>
              : <><ExternalLink className="w-4 h-4 shrink-0" /><span>Ver</span></>
            }
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div
        className="absolute right-4 z-10 flex flex-col gap-2"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        {projects.map((_, i) => (
          <div
            key={i}
            style={{
              width: "5px",
              borderRadius: "9999px",
              height: i === current ? "22px" : "5px",
              background: i === current ? "#1A56DB" : "rgba(255,255,255,0.2)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
