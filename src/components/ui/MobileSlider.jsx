import React, { useState, useRef, useEffect } from "react";
import { Music, ExternalLink, ChevronDown } from "lucide-react";

export default function MobileSlider({ projects, onProjectClick }) {
  const [current, setCurrent] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const swipe = useRef({ y: null, x: null, moved: false });
  const busy  = useRef(false);
  const isLast = current === projects.length - 1;

  useEffect(() => {
    const t = setTimeout(() => setScanned(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  const goTo = (n) => {
    if (busy.current) return;
    const next = Math.max(0, Math.min(projects.length - 1, n));
    if (next === current) return;
    busy.current = true;
    setCurrent(next);
    setAtEnd(false);
    setTimeout(() => { busy.current = false; }, 400);
  };

  const handleTouchStart = (e) => {
    swipe.current = { y: e.touches[0].clientY, x: e.touches[0].clientX, moved: false };
  };
  const handleTouchMove = (e) => {
    if (!swipe.current.y) return;
    const dy = Math.abs(e.touches[0].clientY - swipe.current.y);
    const dx = Math.abs(e.touches[0].clientX - swipe.current.x);
    if (dy > 10 || dx > 10) swipe.current.moved = true;
  };
  const handleTouchEnd = (e) => {
    if (!swipe.current.y || !swipe.current.moved) { swipe.current = { y: null, x: null, moved: false }; return; }
    const dy = swipe.current.y - e.changedTouches[0].clientY;
    const dx = Math.abs(swipe.current.x - e.changedTouches[0].clientX);
    swipe.current = { y: null, x: null, moved: false };
    if (Math.abs(dy) < 40 || dx > Math.abs(dy)) return;

    if (dy > 0) {
      // swiping up (next)
      if (isLast) {
        // already at last — scroll the page down
        scrollToContent();
      } else {
        goTo(current + 1);
      }
    } else {
      // swiping down (prev)
      goTo(current - 1);
    }
  };

  const proj = projects[current];
  const stopBubble = (e) => e.stopPropagation();

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100dvh", background: "#0A0A0B", overflow: "hidden", touchAction: "none" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images */}
      {projects.map((p, i) => (
        <div key={p.id} style={{
          position: "absolute", inset: 0,
          opacity: i === current ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}>
          <img src={p.image} alt={p.title} style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: p.id === "enri-portrait" ? "grayscale(1) brightness(0.7)" : "brightness(0.55)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, transparent 40%, rgba(10,10,11,0.97) 90%)",
          }} />
        </div>
      ))}

      {/* Scan reveal */}
      {!scanned && (
        <div style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none" }}>
          <div style={{ position: "absolute", inset: 0, background: "#0A0A0B", animation: "scanReveal 1.4s linear 0.1s forwards" }} />
          <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "#1A56DB", boxShadow: "0 0 12px 4px rgba(26,86,219,0.6)", animation: "scanLine 1.4s linear 0.1s forwards" }} />
          <style>{`
            @keyframes scanReveal{from{clip-path:inset(0 0 0% 0)}to{clip-path:inset(0 0 100% 0)}}
            @keyframes scanLine{from{top:0%}to{top:100%}}
          `}</style>
        </div>
      )}

      {/* Info */}
      <div
        style={{ position: "absolute", left: 0, right: 0, bottom: 80, padding: "0 24px", zIndex: 10 }}
        onTouchStart={stopBubble}
        onTouchEnd={stopBubble}
      >
        <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#1A56DB", marginBottom: 8 }}>
          {proj.category}
        </p>
        <h2 style={{ fontSize: "clamp(1.2rem, 6vw, 1.8rem)", fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 20 }}>
          {proj.title}
        </h2>
        <button
          onPointerDown={(e) => { e.preventDefault(); onProjectClick(proj); }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 24px", borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(0,0,0,0.5)",
            color: "rgba(255,255,255,0.9)", fontSize: 14,
            cursor: "pointer", minHeight: 48,
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
          }}
        >
          {proj.tracks
            ? <><Music style={{ width: 15, height: 15 }} /><span>Escuchar</span></>
            : <><ExternalLink style={{ width: 15, height: 15 }} /><span>Ver</span></>
          }
        </button>
      </div>

      {/* Down arrow — always visible, pulses on last project */}
      <button
        onPointerDown={(e) => { e.preventDefault(); scrollToContent(); }}
        onTouchStart={stopBubble}
        onTouchEnd={stopBubble}
        style={{
          position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
          zIndex: 10, background: "none", border: "none", padding: 8, cursor: "pointer",
          WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
          opacity: isLast ? 1 : 0.35,
          transition: "opacity 0.4s ease",
          animation: isLast ? "arrowBounce 1.4s ease-in-out infinite" : "none",
        }}
        aria-label="Explorar más"
      >
        <ChevronDown style={{ width: 22, height: 22, color: "#fff" }} />
        <style>{`@keyframes arrowBounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(5px)}}`}</style>
      </button>

      {/* Dots */}
      <div
        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", zIndex: 10, display: "flex", flexDirection: "column", gap: 8 }}
        onTouchStart={stopBubble}
        onTouchEnd={stopBubble}
      >
        {projects.map((_, i) => (
          <button
            key={i}
            onPointerDown={(e) => { e.preventDefault(); goTo(i); }}
            style={{
              width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
              background: "none", border: "none", padding: 0, cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
          >
            <div style={{
              width: 5, borderRadius: 9999,
              height: i === current ? 20 : 5,
              background: i === current ? "#1A56DB" : "rgba(255,255,255,0.2)",
              transition: "all 0.3s ease",
            }} />
          </button>
        ))}
      </div>
    </div>
  );
}
