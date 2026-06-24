import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

// Default: EPV album
const EPV = {
  title:  "Espacio Premeditadamente Vacío",
  image:  "/EPV_Portada-01.jpg",
  credit: "Enri La Forêt · 2026 · Pinorama Records",
  tracks: [
    { n: "1", title: "El muro",                    duration: "06:09", file: "/epv-1-el-muro.mp3" },
    { n: "2", title: "Bil'in",                      duration: "05:22", file: "/epv-2-bilin.mp3" },
    { n: "3", title: "¿Hasta cuándo?",             duration: "04:20", file: "/epv-3-hasta-cuando.mp3" },
    { n: "4", title: "Sumergirse en el naufragio", duration: "06:08", file: "/epv-4-sumergirse.mp3" },
    { n: "5", title: "La brecha",                   duration: "05:46", file: "/epv-5-la-brecha.mp3" },
  ],
};

// Build album descriptor from a project that has tracks
const projectToAlbum = (proj) => ({
  title:  proj.title,
  image:  proj.image,
  credit: proj.category,
  tracks: proj.tracks.map((t, i) => ({ ...t, n: String(i + 1) })),
});

export default function BandcampPlayer({ audioProject, isOpen: isOpenProp, onOpenChange }) {
  const [isOpen,      setIsOpen]      = useState(false);
  const [currentIdx,  setCurrentIdx]  = useState(null);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [progress,    setProgress]    = useState(0);
  const audioRef = useRef(null);
  const { t } = useLanguage();

  // Resolve current album (external project or EPV default)
  const album = audioProject?.tracks ? projectToAlbum(audioProject) : EPV;

  // Sync open state from parent
  useEffect(() => {
    if (isOpenProp) setIsOpen(true);
  }, [isOpenProp]);

  // When album changes, reset playhead (don't auto-play)
  const prevAlbumRef = useRef(null);
  useEffect(() => {
    if (prevAlbumRef.current !== album.title) {
      prevAlbumRef.current = album.title;
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
      setCurrentIdx(null);
      setIsPlaying(false);
      setProgress(0);
    }
  }, [album.title]);

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    const onEnd  = () => loadAndPlay(((currentIdx ?? 0) + 1) % album.tracks.length);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended",      onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended",      onEnd);
    };
  }, [currentIdx, album.tracks.length]);

  const loadAndPlay = (idx) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = album.tracks[idx].file;
    audio.play().catch(() => {});
    setCurrentIdx(idx);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleTrack = (idx) => {
    if (currentIdx === idx) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
      else           { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
    } else {
      loadAndPlay(idx);
    }
  };

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    onOpenChange?.(next);
  };

  return (
    <>
      <audio ref={audioRef} />

      {/* Floating trigger — desktop always visible, mobile only when playing */}
      <AnimatePresence>
        {(isPlaying || typeof window !== "undefined" && window.innerWidth >= 768) && (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            onClick={toggle}
            className="fixed z-40 items-center gap-3 px-5 h-12 rounded-full glass-panel hover:border-cobalt/40 transition-all focus:outline-none focus:ring-2 focus:ring-cobalt group"
            style={{ bottom: 24, left: 24, display: "flex" }}
            aria-label={isOpen ? t.player.close : t.player.open}
          >
            <div className={`w-2 h-2 rounded-full transition-all ${isPlaying ? "bg-cobalt animate-pulse" : "bg-quartz/30"}`} />
            <Music className={`w-4 h-4 transition-colors ${isOpen ? "text-cobalt" : "text-quartz/50 group-hover:text-quartz"}`} />
            <span className="text-xs font-body text-quartz/50 group-hover:text-quartz transition-colors hidden md:block truncate max-w-[140px]">
              {isPlaying && currentIdx !== null ? album.tracks[currentIdx].title : album.title}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile backdrop â€” tap outside panel to close */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 md:hidden"
            onClick={toggle}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 left-4 md:left-8 z-40 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden glass-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-quartz/10">
              <div className="min-w-0">
                <p className="text-xs font-display font-semibold text-quartz truncate">{album.title}</p>
                <p className="text-[10px] text-quartz/30 font-body truncate">{album.credit}</p>
              </div>
              <button
                onClick={toggle}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-quartz/10 active:bg-quartz/20 transition-colors text-quartz/40 hover:text-quartz shrink-0 ml-2 touch-manipulation"
                aria-label="Cerrar reproductor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Album art + progress â€” smaller on mobile */}
            <div className="relative">
              <img
                src={album.image}
                alt={album.title}
                className="w-full object-cover aspect-square md:aspect-square"
                style={{ maxHeight: "clamp(120px, 35vw, 280px)" }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-1.5 bg-quartz/20 cursor-pointer"
                onClick={seek}
              >
                <div className="h-full bg-cobalt transition-all duration-100" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Transport */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-quartz/10">
              <button
                onClick={() => loadAndPlay(((currentIdx ?? 0) - 1 + album.tracks.length) % album.tracks.length)}
                className="text-quartz/40 hover:text-quartz transition-colors p-2 touch-manipulation"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => currentIdx !== null ? handleTrack(currentIdx) : loadAndPlay(0)}
                className="w-11 h-11 rounded-full bg-cobalt flex items-center justify-center text-white hover:bg-cobalt/80 active:bg-cobalt/70 transition-colors touch-manipulation"
              >
                {isPlaying
                  ? <Pause className="w-4 h-4" fill="currentColor" />
                  : <Play  className="w-4 h-4 ml-0.5" fill="currentColor" />
                }
              </button>
              <button
                onClick={() => loadAndPlay(((currentIdx ?? -1) + 1) % album.tracks.length)}
                className="text-quartz/40 hover:text-quartz transition-colors p-2 touch-manipulation"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Tracklist */}
            <div className="max-h-[160px] md:max-h-[200px] overflow-y-auto">
              {album.tracks.map((track, i) => (
                <button
                  key={i}
                  onClick={() => handleTrack(i)}
                  className={`flex items-center gap-3 px-4 py-3 w-full text-left transition-colors group touch-manipulation ${
                    currentIdx === i ? "bg-cobalt/10" : "hover:bg-quartz/5 active:bg-quartz/10"
                  }`}
                >
                  <span className="w-4 text-center shrink-0">
                    {currentIdx === i && isPlaying
                      ? <span className="text-cobalt text-[10px]">â–¶</span>
                      : <span className={`font-mono text-xs ${currentIdx === i ? "text-cobalt" : "text-quartz/30"}`}>{track.n}</span>
                    }
                  </span>
                  <span className={`text-sm font-body flex-1 truncate transition-colors ${
                    currentIdx === i ? "text-quartz" : "text-quartz/55 group-hover:text-quartz/80"
                  }`}>
                    {track.title}
                  </span>
                  {track.duration && (
                    <span className="text-xs text-quartz/25 font-body shrink-0">{track.duration}</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

