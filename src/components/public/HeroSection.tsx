"use client";

import { motion } from "framer-motion";
import { Download, ChevronDown } from "lucide-react";
import { Profile } from "@prisma/client";
import { useLanguage } from "@/components/LanguageContext";

export default function HeroSection({ profile }: { profile: Profile | null }) {
  const { language } = useLanguage();

  if (!profile) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-accent-2/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="z-10 text-center px-4 max-w-4xl">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-accent mb-4 tracking-widest uppercase text-sm font-semibold">
          Welcome to my portfolio
        </motion.p>

        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="text-xl sm:text-2xl mt-4 font-medium text-text-muted">
          {language === "EN" && profile.titleEn ? profile.titleEn : profile.title}
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="mt-6 max-w-xl text-text-muted leading-relaxed text-sm sm:text-base whitespace-pre-line">
          {language === "EN" && profile.bioEn ? profile.bioEn : profile.bio}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#projects" className="px-8 py-4 bg-accent text-bg font-semibold rounded hover:bg-accent-2 transition-colors w-full sm:w-auto text-center">
            View Projects
          </a>

          <a href="/cv.pdf" download="Rendi_Elang_CV.pdf" className="px-8 py-4 border border-border text-foreground font-semibold rounded hover:border-accent group flex items-center justify-center gap-2 transition-colors w-full sm:w-auto">
            <Download className="w-5 h-5 group-hover:text-accent transition-colors" />
            Download CV
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 1.5, delay: 1, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-text-muted hover:text-accent transition-colors"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.a>
    </section>
  );
}
