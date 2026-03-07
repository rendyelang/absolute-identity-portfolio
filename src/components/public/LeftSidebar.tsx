"use client";

import { useLanguage } from "@/components/LanguageContext";
import { Github, Instagram, Linkedin, Download, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LeftSidebar({ profile }: { profile: any }) {
  const { language, toggleLanguage, t } = useLanguage();
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "experience", "projects", "contact"];
      let current = "about";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section;
          }
        }
      }

      // If scrolled to absolute bottom, force contact active
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        current = "contact";
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-full flex flex-col justify-between pt-12 lg:pt-24 pb-12 lg:pb-24">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-accent font-mono text-sm">
            {t("greeting")}
          </motion.p>
          <button onClick={toggleLanguage} className="flex items-center gap-1 text-xs font-mono border border-border rounded-full px-3 py-1 hover:border-accent hover:text-accent transition-colors">
            <span className={language === "EN" ? "text-accent font-bold" : "text-text-muted"}>EN</span>
            <span className="text-border">/</span>
            <span className={language === "ID" ? "text-accent font-bold" : "text-text-muted"}>ID</span>
          </button>
        </div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-5 font-playfair tracking-tight">
          {profile?.name || "Rendy Elang Lesmana"}.
        </motion.h1>

        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg font-medium text-text mb-1">
          {profile?.title || "IT Student — Software Engineer"}
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-base text-text-muted max-w-sm mb-8 leading-relaxed">
          {profile?.bio?.split(".")[0] || "Learning, building, and growing as a developer every day."}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-10 mb-12">
          <a
            href={profile?.resumeUrl || "/rendy-elang-resume.pdf"}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-accent text-accent px-5 py-3 rounded hover:bg-accent/10 transition-colors font-mono text-base lg:text-lg font-medium"
          >
            <Download className="w-4 h-4" /> {t("download_cv")}
          </a>

          <div className="flex items-center gap-5 text-text-muted">
            {profile?.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {profile?.instagramUrl && (
              <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>

      <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="hidden lg:flex flex-col gap-4 font-mono text-xs font-semibold tracking-widest">
        <a href="#about" className={`group flex items-center gap-4 py-2 w-max ${activeSection === "about" ? "text-text" : "text-text-muted hover:text-text"} transition-colors`}>
          <span className={`h-px transition-all duration-300 ${activeSection === "about" ? "w-16 bg-text" : "w-8 bg-border group-hover:w-16 group-hover:bg-text"}`}></span>
          <span className={activeSection === "about" ? "" : "group-hover:-translate-y-0.5 transition-transform"}>{t("nav_about")}</span>
        </a>
        <a href="#experience" className={`group flex items-center gap-4 py-2 w-max ${activeSection === "experience" ? "text-text" : "text-text-muted hover:text-text"} transition-colors`}>
          <span className={`h-px transition-all duration-300 ${activeSection === "experience" ? "w-16 bg-text" : "w-8 bg-border group-hover:w-16 group-hover:bg-text"}`}></span>
          <span className={activeSection === "experience" ? "" : "group-hover:-translate-y-0.5 transition-transform"}>{t("nav_experience")}</span>
        </a>
        <a href="#projects" className={`group flex items-center gap-4 py-2 w-max ${activeSection === "projects" ? "text-text" : "text-text-muted hover:text-text"} transition-colors`}>
          <span className={`h-px transition-all duration-300 ${activeSection === "projects" ? "w-16 bg-text" : "w-8 bg-border group-hover:w-16 group-hover:bg-text"}`}></span>
          <span className={activeSection === "projects" ? "" : "group-hover:-translate-y-0.5 transition-transform"}>{t("nav_projects")}</span>
        </a>
        <a href="#contact" className={`group flex items-center gap-4 py-2 w-max ${activeSection === "contact" ? "text-text" : "text-text-muted hover:text-text"} transition-colors`}>
          <span className={`h-px transition-all duration-300 ${activeSection === "contact" ? "w-16 bg-text" : "w-8 bg-border group-hover:w-16 group-hover:bg-text"}`}></span>
          <span className={activeSection === "contact" ? "" : "group-hover:-translate-y-0.5 transition-transform"}>{t("nav_contact")}</span>
        </a>
      </motion.nav>
    </div>
  );
}
