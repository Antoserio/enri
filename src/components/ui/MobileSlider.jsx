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

  const onSwipeStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };
  const onSwipeEnd = (e) => {
    if (touchStartY.current === null) return;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    const dx = Math.abs(touchStartX.current - e.changedTouches[0].clientX);
    touchStartY.current = null;
    if (Math.abs(dy) < 50 || dx > Math.abs(dy) * 0.7) return;
    goTo(dy > 0 ? current + 1 : current - 1);
  };

  const proj = projects[current];

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100dvh", background: "#0A0A0B", overflow: "hidden" }}
      onTouchStart={onSwipeStart}
      onTouchEnd={onSwipeEnd}
    >
      {/* Images */}
      {projects.map((p, i) => (
        <div key={p.id} style={{
          position: "absolute", inset: 0,
          opacity: i === current ? 1 : 0,
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
        }}>
          <img src={p.image} alt={p.title} style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: p.id === "enri-portrait" ? "grayscale(1) brightness(0.7)" : "brightness(0.55)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(10,10,11,0.05) 0%, rgba(10,10,11,0) 25%, rgba(10,10,11,0.95) 75%, rgba(10,10,11,1) 100%)",
          }} />
        </div>
      ))}

      {/* Scan reveal */}
      {!scanned && (
        <div style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0, background: "#0A0A0B",
            animation: "scanReveal 1.4s linear 0.1s forwards",
          }} />
          <div style={{
            position: "absolute", left: 0, right: 0, height: "2px",
            background: "rgba(26,86,219,0.9)",
            boxShadow: "0 0 14px 4px rgba(26,86,219,0.5)",
            animation: "scanLine 1.4s linear 0.1s forwards",
          }} />
          <style>{`
            @keyframes scanReveal { from{clip-path:inset(0 0 0% 0)} to{clip-path:inset(0 0 100% 0)} }
            @keyframes scanLine   { from{top:0%} to{top:100%} }
          `}</style>
        </div>
      )}

      {/* Info — fixed 30% from bottom, NOT touching the edge */}
      <div
        style={{ position: "absolute", left: 0, right: 0, bottom: "22%", padding: "0 28px", zIndex: 10 }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <p style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#1A56DB", fontFamily: "inherit", marginBottom: "10px" }}>
          {proj.category}
        </p>
        <h2 style={{ fontSize: "clamp(1.3rem, 6.5vw, 2rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "24px" }}>
          {proj.title}
        </h2>
        <button
          onClick={(e) => { e.stopPropagation(); onProjectClick(proj); }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 28px", borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(10,10,11,0.6)",
            backdropFilter: "blur(12px)",
            color: "rgba(255,255,255,0.9)", fontSize: "14px",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
            cursor: "pointer",
            minWidth: "130px", minHeight: "52px",
          }}
        >
          {proj.tracks
            ? <><Music style={{ width: 16, height: 16, flexShrink: 0 }} /><span>Escuchar</span></>
            : <><ExternalLink style={{ width: 16, height: 16, flexShrink: 0 }} /><span>Ver</span></>
          }
        </button>
      </div>

      {/* Dots */}
      <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10, display: "flex", flexDirection: "column", gap: 8 }}>
        {projects.map((_, i) => (
          <div key={i} style={{
            width: 5, borderRadius: 9999,
            height: i === current ? 22 : 5,
            background: i === current ? "#1A56DB" : "rgba(255,255,255,0.2)",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>
    </div>
  );
}
