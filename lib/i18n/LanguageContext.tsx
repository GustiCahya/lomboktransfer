"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "zh" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLang = localStorage.getItem("app_lang") as Language;
    if (savedLang && ["en", "zh", "id"].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("app_lang", lang);
  };

  // Prevent hydration mismatch by returning null on first render if needed, or simply let the default be "en"
  // Since we default to "en", if localStorage has "zh", it will briefly flash "en".
  // This is acceptable for a quick i18n implementation.

  return (
    <LanguageContext.Provider value={{ language: isClient ? language : "en", setLanguage: handleSetLanguage }}>
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
