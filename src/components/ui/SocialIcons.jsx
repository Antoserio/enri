import React from "react";
import { Instagram } from "lucide-react";
import BandcampIcon from "@/components/ui/BandcampIcon";

export default function SocialIcons({ className = "", iconClass = "w-5 h-5" }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <a
        href="https://www.instagram.com/enrilaforet/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="w-10 h-10 rounded-full border border-quartz/15 flex items-center justify-center text-quartz/50 hover:text-cobalt hover:border-cobalt/40 transition-all"
      >
        <Instagram className={iconClass} />
      </a>
      <a
        href="https://enrilaforet.bandcamp.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bandcamp"
        className="w-10 h-10 rounded-full border border-quartz/15 flex items-center justify-center text-quartz/50 hover:text-cobalt hover:border-cobalt/40 transition-all"
      >
        <BandcampIcon className={iconClass} />
      </a>
    </div>
  );
}