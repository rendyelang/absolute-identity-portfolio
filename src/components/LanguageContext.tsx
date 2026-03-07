"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ID" | "EN";

interface Translations {
  [key: string]: {
    ID: string;
    EN: string;
  };
}

const translations: Translations = {
  // Navigation
  nav_about: { ID: "01. Tentang Saya", EN: "01. About Me" },
  nav_experience: { ID: "02. Pengalaman", EN: "02. Experience" },
  nav_projects: { ID: "03. Proyek", EN: "03. Projects" },
  nav_contact: { ID: "04. Kontak", EN: "04. Contact" },

  // Sidebar
  greeting: { ID: "Halo, nama saya", EN: "Hi, my name is" },
  download_cv: { ID: "Unduh CV Saya", EN: "Download Resume" },

  // Right Content Titles
  about_title: { ID: "01. Tentang Saya", EN: "01. About Me" },
  experience_title: { ID: "02. Pengalaman", EN: "02. Experience" },
  projects_title: { ID: "03. Proyek", EN: "03. Projects" },
  contact_title: { ID: "04. Kontak", EN: "04. Contact" },

  // Contact section
  get_in_touch: { ID: "Hubungi Saya", EN: "Get In Touch" },
  contact_paragraph: {
    ID: "Saya selalu terbuka untuk peluang baru, proyek menarik, atau sekadar berdiskusi tentang teknologi. Jangan ragu untuk menghubungi saya!",
    EN: "I'm always open to new opportunities, interesting projects, or just discussing technology. Don't hesitate to reach out!",
  },
  send_email: { ID: "Kirim Email", EN: "Send Email" },

  // Projects View Archive link
  view_archive: { ID: "Lihat Arsip Proyek", EN: "View Project Archive" },

  // Footer
  designed_by: { ID: "Desain terinspirasi oleh", EN: "Design inspired by" },
  built_with: { ID: "Dibuat dengan", EN: "Built with" },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ID");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("portfolio_lang") as Language;
    if (saved === "ID" || saved === "EN") {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("portfolio_lang", lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === "ID" ? "EN" : "ID";
    handleSetLanguage(nextLang);
  };

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
