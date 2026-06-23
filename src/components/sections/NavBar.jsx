import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import LanguageToggle from "@/components/ui/LanguageToggle";
import SocialIcons from "@/components/ui/SocialIcons";
import { useLanguage } from "@/lib/LanguageContext";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: t.nav.obra, href: "#scroll-experience" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.contact, href: "#contact", isContact: true },
    { label: t.nav.bandcamp, href: "https://enrilaforet.bandcamp.com/album/espacio-premeditadamente-vac-o" },
  ];

  const handleContactClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact"));
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? "glass-panel" : ""
        }`}
      >
        <div className="flex items-center justify-between px-[5vw] md:px-[10vw] py-5">
          <a href="#" className="font-display font-bold text-base md:text-lg text-quartz tracking-tight">
            Enri La Forêt
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => link.isContact && handleContactClick(e)}
                className="text-sm text-quartz/50 hover:text-quartz transition-colors font-body tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <LanguageToggle />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <LanguageToggle />
            <button
              className="w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cobalt rounded-md"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-quartz" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "#0A0A0B" }}
          >
            <button
              className="absolute top-5 right-[5vw] w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cobalt rounded-md"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-quartz" />
            </button>

            <div className="flex flex-col items-center gap-8">
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (link.isContact) {
                      handleContactClick(e);
                    } else {
                      setMenuOpen(false);
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="font-display font-bold text-4xl text-quartz hover:text-cobalt transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <SocialIcons className="mt-10" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}