"use client";

import { useLang } from "@/lib/lang";

export default function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      className="lang-toggle"
      aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
      onClick={() => setLang(lang === "en" ? "es" : "en")}
    >
      {lang === "en" ? "ES" : "EN"}
    </button>
  );
}
