"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ID" | "EN";

interface Translations {
  [key: string]: {
    ID: string;
    EN: string;
  };
}

type ExperienceTab = "education" | "experience" | "activities";

const translations: Translations = {
  nav_about: { ID: "Tentang Saya", EN: "About Me" },
  nav_education: { ID: "Pendidikan", EN: "Education" },
  nav_experience: { ID: "Pengalaman", EN: "Experience" },
  nav_activities: { ID: "Aktivitas", EN: "Activities" },
  nav_projects: { ID: "Proyek", EN: "Projects" },
  nav_certificates: { ID: "Sertifikat", EN: "Certificates" },
  nav_contact: { ID: "Kontak", EN: "Contact" },

  // Sidebar
  greeting: { ID: "Halo, nama saya", EN: "Hi, my name is" },
  download_cv: { ID: "Unduh CV Saya", EN: "Download Resume" },

  about_title: { ID: "Tentang Saya", EN: "About Me" },
  experience_title: { ID: "Pengalaman", EN: "Experience" },
  projects_title: { ID: "Proyek", EN: "Projects" },
  certificates_title: { ID: "Sertifikat", EN: "Certificates" },
  contact_title: { ID: "Kontak", EN: "Contact" },

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
  experienceTab: ExperienceTab;
  setExperienceTab: (tab: ExperienceTab) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ID");
  const [experienceTab, setExperienceTab] = useState<ExperienceTab>("education");

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

  return <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t, experienceTab, setExperienceTab }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
