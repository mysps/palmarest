"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { translations, type Lang, type T } from "@/lib/t";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; t: T };

const LangContext = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

function detectLang(): Lang {
  if (typeof document !== "undefined") {
    const cookie = document.cookie.split("; ").find((c) => c.startsWith("lang="));
    if (cookie) {
      const val = cookie.split("=")[1];
      if (val === "es" || val === "en") return val;
    }
  }
  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem("lang");
    if (stored === "es" || stored === "en") return stored;
  }
  if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("es")) {
    return "es";
  }
  return "en";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(detectLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
