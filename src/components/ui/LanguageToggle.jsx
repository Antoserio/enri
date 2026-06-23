import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageToggle({ className = "" }) {
  const { lang, toggle } = useLanguage();
  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1 text-xs font-body tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-cobalt rounded-md px-2 py-1 ${className}`}
      aria-label="Toggle language"
    >
      <span className={lang === "es" ? "text-cobalt" : "text-quartz/30 hover:text-quartz/60"}>ES</span>
      <span className="text-quartz/20">|</span>
      <span className={lang === "en" ? "text-cobalt" : "text-quartz/30 hover:text-quartz/60"}>EN</span>
    </button>
  );
}