"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "zh" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** true once the client has finished detecting/loading the language */
  isDetected: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Detect preferred language from the browser without requesting any permission.
 * Uses navigator.language (browser / OS language setting).
 *
 * Priority:
 *   1. Explicit user choice saved in localStorage  → respect always
 *   2. navigator.language / navigator.languages    → auto-detect
 *   3. Fallback: "en"
 *
 * Mapping:
 *   zh*, yue, wuu, cmn  → "zh"  (Chinese variants)
 *   id, ms, jv, su      → "id"  (Indonesian / Malay / Javanese / Sundanese)
 *   everything else     → "en"
 */
function detectLanguage(): Language {
  // Collect all browser language candidates
  const candidates: string[] = [];
  if (typeof navigator !== "undefined") {
    if (navigator.languages?.length) {
      candidates.push(...navigator.languages);
    } else if (navigator.language) {
      candidates.push(navigator.language);
    }
  }

  for (const raw of candidates) {
    const lang = raw.toLowerCase().split(/[-_]/)[0]; // e.g. "zh-CN" → "zh"
    if (["zh", "yue", "wuu", "cmn", "cdo", "hak"].includes(lang)) return "zh";
    if (["id", "ms", "jv", "su", "ban"].includes(lang)) return "id";
    if (lang === "en") return "en";
  }

  return "en"; // ultimate fallback
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage]   = useState<Language>("en");
  const [isDetected, setIsDetected] = useState(false);

  useEffect(() => {
    const initLang = async () => {
      // 1. Respect an explicit user preference stored in localStorage
      const saved = localStorage.getItem("app_lang") as Language | null;
      if (saved && (["en", "zh", "id"] as Language[]).includes(saved)) {
        setLanguage(saved);
        setIsDetected(true);
        return;
      }

      // 2. Auto-detect from IP address
      try {
        const res = await fetch("https://get.geojs.io/v1/ip/country.json");
        if (!res.ok) throw new Error("Failed to fetch IP country");
        
        const data = await res.json();
        const country = data.country;
        
        if (country === "ID") {
          setLanguage("id");
        } else if (country === "CN") {
          setLanguage("zh");
        } else {
          setLanguage("en");
        }
      } catch (error) {
        // Fallback to browser language if IP fetch fails
        const detected = detectLanguage();
        setLanguage(detected);
      }
      
      setIsDetected(true);
    };

    initLang();
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("app_lang", lang); // persist explicit user choice
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, isDetected }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
