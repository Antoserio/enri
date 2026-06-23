import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const ALBUM_ART = "/EPV_Portada-01.jpg";

const TRACKS = [
  { n: "1", title: "El muro",                    duration: "06:09", file: "/epv-1-el-muro.wav" },
  { n: "2", title: "Bil'in",                      duration: "05:22", file: "/epv-2-bilin.wav" },
  { n: "3", title: "¿Hasta cuándo?",             duration: "04:20", file: "/epv-3-hasta-cuando.wav" },
  { n: "4", title: "Sumergirse en el naufragio", duration: "06:08", file: "/epv-4-sumergirse.wav" },
  { n: "5", title: "La brecha",                   duration: "05:46", file: "/epv-5-la-brecha.wav" },
];

export default function BandcampPlayer() {
  const [isOpen, setIsOpen]         = useState(false);
  const [currentIdx, setCurrentIdx] = useState(null);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const audioRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    const onEnd  = () => loadAndPlay(((currentIdx ?? 0) + 1) % TRACKS.length);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [currentIdx]);

  const loadAndPlay = (idx) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[idx].file;
    audio.play().catch(() => {});
    setCurrentIdx(idx);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleTrack = (idx) => {
    if (currentIdx === idx) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
      else            { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
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

  return (
    <>
      <audio ref={audioRef} />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 z-40 flex items-center gap-3 px-5 h-12 rounded-full glass-panel hover:border-cobalt/40 transition-all focus:outline-none focus:ring-2 focus:ring-cobalt group"
        aria-label={isOpen ? t.player.close : t.player.open}
      >
        <div className={`w-2 h-2 rounded-full transition-all ${isPlaying ? "bg-cobalt animate-pulse" : "bg-quartz/30"}`} />
        <Music className={`w-4 h-4 transition-colors ${isOpen ? "text-cobalt" : "text-quartz/50 group-hover:text-quartz"}`} />
        <span className="text-xs font-body text-quartz/50 group-hover:text-quartz transition-colors hidden md:block truncate max-w-[120px]">
          {isPlaying && currentIdx !== null ? TRACKS[currentIdx].title : t.player.album}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 left-8 z-40 w-[360px] max-w-[calc(100vw-4rem)] rounded-2xl overflow-hidden glass-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-quartz/10">
              <div className="min-w-0">
                <p className="text-xs font-display font-semibold text-quartz truncate">{t.player.album}</p>
                <p className="text-[10px] text-quartz/30 font-body">Enri La Forêt · 2026 · Pinorama Records</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-quartz/10 transition-colors text-quartz/40 hover:text-quartz shrink-0 ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Album art + progress bar */}
            <div className="relative">
              <img
                src={ALBUM_ART}
                alt="Espacio Premeditadamente Vacío — Enri La Forêt"
                className="w-full aspect-square object-cover"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-quartz/20 cursor-pointer"
                onClick={seek}
              >
                <div className="h-full bg-cobalt transition-all duration-100" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Transport */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-quartz/10">
              <button
                onClick={() => loadAndPlay(((currentIdx ?? 0) - 1 + TRACKS.length) % TRACKS.length)}
                className="text-quartz/40 hover:text-quartz transition-colors p-1"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => currentIdx !== null ? handleTrack(currentIdx) : loadAndPlay(0)}
                className="w-9 h-9 rounded-full bg-cobalt flex items-center justify-center text-white hover:bg-cobalt/80 transition-colors"
              >
                {isPlaying
                  ? <Pause className="w-4 h-4" fill="currentColor" />
                  : <Play  className="w-4 h-4 ml-0.5" fill="currentColor" />
                }
              </button>
              <button
                onClick={() => loadAndPlay(((currentIdx ?? -1) + 1) % TRACKS.length)}
                className="text-quartz/40 hover:text-quartz transition-colors p-1"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Tracklist */}
            <div className="max-h-[200px] overflow-y-auto">
              {TRACKS.map((track, i) => (
                <button
                  key={track.n}
                  onClick={() => handleTrack(i)}
                  className={`flex items-center gap-3 px-4 py-2.5 w-full text-left transition-colors group ${
                    currentIdx === i ? "bg-cobalt/10" : "hover:bg-quartz/5"
                  }`}
                >
                  <span className="w-4 text-center shrink-0">
                    {currentIdx === i && isPlaying
                      ? <span className="text-cobalt text-[10px]">▶</span>
                      : <span className={`font-mono text-xs ${currentIdx === i ? "text-cobalt" : "text-quartz/30"}`}>{track.n}</span>
                    }
                  </span>
                  <span className={`text-sm font-body flex-1 truncate transition-colors ${
                    currentIdx === i ? "text-quartz" : "text-quartz/55 group-hover:text-quartz/80"
                  }`}>
                    {track.title}
                  </span>
                  <span className="text-xs text-quartz/25 font-body shrink-0">{track.duration}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
