import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  es: {
    nav: { obra: "Obra", about: "About", contact: "Contacto", bandcamp: "Bandcamp" },
    hero: {
      tagline: "Enri La Forêt · 2026",
      title1: "Espacio",
      title2: "Premeditadamente",
      title3: "Vacío",
      subtitle: "Primer álbum · Live/AV · Techno industrial, ambient, voces corales y poesía.",
      scroll: "Scroll para explorar",
      click: "Click para explorar",
      continue: "Continuar",
    },
    about: {
      label: "Sobre",
      artistLabel: "El Artista",
      creditsLabel: "Créditos",
      released: "Lanzado el 20 de marzo de 2026",
      tracklistLabel: "Tracklist",
      tagsLabel: "Tags",
      p1: "Es el primer álbum del músico y compositor Enri La Forêt. Nace de una propuesta sonora en formato Live/AV, muy cercana a las artes vivas, en la que música, imagen de gran formato, poesía, texto y voz conforman un dispositivo artístico expandido que culmina con la publicación de este LP.",
      p2: "Su deseo es el de invitar a reflexionar de forma crítica acerca de las violencias sistémicas y las estructuras de poder a las que nos vemos sometidxs y atravesadxs como sociedad y como individuos. Y, sobre todo, existe la voluntad de abrir un espacio de pensamiento para imaginar formas más conscientes y humanas de relacionarnos con nuestro presente y nuestro futuro, dentro del contexto turbocapitalista actual.",
      p3: "La arquitectura sonora de este álbum transiciona desde sonidos crudos y beats rotundos propios del techno industrial, hasta armonías luminosas generadas con sintetizadores, arpegiadores y voces corales, pasando por texturas ambientales creadas con pianos preparados y samples de voces. La textualidad y la poesía actúan como elementos vehiculares de esta propuesta y están muy presentes a lo largo de todo el álbum.",
      bio: "Enri La Forêt es músico de formación clásica, residente en Madrid. Actualmente enfocado en la composición musical electrónica, su campo de creación se basa en la búsqueda de lugares de encuentro entre sonoridades múltiples y en la experimentación con otros lenguajes —imagen, texto, voz o artes vivas— para construir dispositivos artísticos desde los que manifestar narrativas disidentes.",
      music: "Música original, composición e interpretación:",
      production: "Producción y arreglos:",
      mix: "Mezcla:",
      mastering: "Mastering:",
      art: "Diseño de arte:",
      poem: "Sumergirse en el naufragio:",
      poemDesc: "Letra del poema homónimo de Adrienne Rich, traducido por Patricia Gonzalo de Jesús (Editorial Sexto Piso, 2021). Narrado por Helena Mariño.",
    },
    footer: {
      desc: "Espacio Premeditadamente Vacío — música electrónica experimental desde Madrid.",
      navigate: "Navegar",
      obra: "Obra",
      about: "Sobre",
      bandcamp: "Bandcamp",
      connect: "Conectar",
      instagram: "Instagram",
      contact: "Contacto",
      info: "Info",
      location: "Madrid, Spain",
      rights: "© 2026 · all rights reserved",
      bottomRights: "© 2026 Enri La Forêt · All rights reserved",
      powered: "powered with",
    },
    contact: {
      label: "Contacto",
      title: "Hablemos",
      namePlaceholder: "Tu Nombre",
      emailPlaceholder: "Email",
      messagePlaceholder: "Cuéntame tu propuesta",
      send: "Enviar Señal",
      sent: "Señal Recibida",
      sentDesc: "Estaré en contacto pronto.",
      orEmail: "O escríbeme a",
    },
    player: {
      open: "Abrir reproductor",
      close: "Cerrar reproductor",
      playing: "Reproduciendo",
      album: "Espacio Premeditadamente Vacío",
      listenOn: "Escuchar en Bandcamp",
    },
  },
  en: {
    nav: { obra: "Work", about: "About", contact: "Contact", bandcamp: "Bandcamp" },
    hero: {
      tagline: "Enri La Forêt · 2026",
      title1: "Deliberately",
      title2: "Empty",
      title3: "Space",
      subtitle: "Debut album · Live/AV · Industrial techno, ambient, choral voices and poetry.",
      scroll: "Scroll to explore",
      click: "Click to explore",
      continue: "Continue",
    },
    about: {
      label: "About",
      artistLabel: "The Artist",
      creditsLabel: "Credits",
      released: "Released on March 20, 2026",
      tracklistLabel: "Tracklist",
      tagsLabel: "Tags",
      p1: "It is the debut album by musician and composer Enri La Forêt. It originates from a sonic proposal in Live/AV format, closely connected to live arts, in which music, large-format imagery, poetry, text and voice form an expanded artistic device that culminates in the release of this LP.",
      p2: "Its intention is to invite critical reflection on systemic violence and the power structures to which we are subjected and traversed as a society and as individuals. Above all, there is the will to open a space for thought to imagine more conscious and humane ways of relating to our present and our future, within the current turbocapitalist context.",
      p3: "The sonic architecture of this album transitions from raw sounds and powerful beats typical of industrial techno, to luminous harmonies generated with synthesizers, arpeggiators and choral voices, passing through ambient textures created with prepared pianos and voice samples. Textuality and poetry act as vehicular elements of this proposal and are present throughout the entire album.",
      bio: "Enri La Forêt is a classically trained musician based in Madrid. Currently focused on electronic music composition, his field of creation is based on the search for meeting points between multiple sonorities and experimentation with other languages —image, text, voice or live arts— to build artistic devices from which to express dissident narratives.",
      music: "Original music, composition and performance:",
      production: "Production and arrangements:",
      mix: "Mixing:",
      mastering: "Mastering:",
      art: "Art design:",
      poem: "Diving into the Wreck:",
      poemDesc: "Lyrics from the poem of the same name by Adrienne Rich, translated by Patricia Gonzalo de Jesús (Editorial Sexto Piso, 2021). Narrated by Helena Mariño.",
    },
    footer: {
      desc: "Espacio Premeditadamente Vacío — experimental electronic music from Madrid.",
      navigate: "Navigate",
      obra: "Work",
      about: "About",
      bandcamp: "Bandcamp",
      connect: "Connect",
      instagram: "Instagram",
      contact: "Contact",
      info: "Info",
      location: "Madrid, Spain",
      rights: "© 2026 · all rights reserved",
      bottomRights: "© 2026 Enri La Forêt · All rights reserved",
      powered: "powered with",
    },
    contact: {
      label: "Contact",
      title: "Let's Talk",
      namePlaceholder: "Your Name",
      emailPlaceholder: "Email",
      messagePlaceholder: "Tell me about your proposal",
      send: "Send Signal",
      sent: "Signal Received",
      sentDesc: "I'll be in touch soon.",
      orEmail: "Or write me at",
    },
    player: {
      open: "Open player",
      close: "Close player",
      playing: "Playing",
      album: "Espacio Premeditadamente Vacío",
      listenOn: "Listen on Bandcamp",
    },
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("lang") || "es";
    } catch {
      return "es";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  const toggle = () => setLang((l) => (l === "es" ? "en" : "es"));
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}