"use client";

import { motion } from "framer-motion";
import { Mail, ArrowUpRight, ArrowUp } from "lucide-react";
import { Profile } from "@prisma/client";
import { useLanguage } from "@/components/LanguageContext";

export default function ContactSection({ profile }: { profile: Profile | null }) {
  const { t } = useLanguage();

  if (!profile) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="contact" className="scroll-mt-24 pb-24 relative">
      {/* Mobile Sticky Header */}
      <div className="sticky top-0 z-20 -mx-6 mb-4 bg-bg/90 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:hidden">
        <h2 className="text-sm font-bold tracking-widest text-text uppercase flex items-center gap-4">
          <span className="text-accent font-mono">04.</span> {t("nav_contact")}
          <span className="h-px bg-border grow"></span>
        </h2>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }}>
        <p className="text-sm lg:text-base text-text-muted mb-8 max-w-xl leading-relaxed">{t("contact_paragraph")}</p>

        <a href={`mailto:${profile.email || "hello@example.com"}`} className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-accent/30 text-accent font-mono text-sm rounded hover:bg-accent/10 transition-colors">
          <Mail className="w-4 h-4" />
          {t("send_email")}
          <ArrowUpRight className="w-4 h-4" />
        </a>

        <div className="mt-24 text-xs font-mono text-text-muted space-y-4">
          <p className="flex items-center gap-2">
            {t("built_with")}{" "}
            <span className="flex items-center gap-2">
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-text hover:text-accent transition-colors" xmlns="http://www.w3.org/2000/svg">
                <title>Next.js</title>
                <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
              </svg>
              <span>Next.js</span>
            </span>
            <span>&amp;</span>
            <span className="flex items-center gap-2">
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent hover:text-accent-2 transition-colors" xmlns="http://www.w3.org/2000/svg">
                <title>Tailwind CSS</title>
                <path d="M12.001,4.8c-3.208,0-6.099,2.192-7.153,5.197c1.392-1.64,3.159-2.312,5.01-2.029 c1.402,0.211,2.44,1.265,3.585,2.427c1.458,1.48,3.167,3.22,6.56,3.22c3.208,0,6.099-2.192,7.153-5.197 c-1.392,1.64-3.159,2.312-5.01,2.029c-1.402-0.211-2.439-1.265-3.585-2.427C17.103,6.54,15.394,4.8,12.001,4.8z M4.848,12.812 c-3.208,0-6.099,2.192-7.153,5.197c1.392-1.64,3.159-2.312,5.01-2.029c1.402,0.211,2.44,1.265,3.585,2.427 c1.458,1.48,3.167,3.22,6.56,3.22c3.208,0,6.099-2.192,7.153-5.197c-1.392,1.64-3.159,2.312-5.01,2.029 c-1.402-0.211-2.439-1.265-3.585-2.427C9.949,14.551,8.24,12.812,4.848,12.812z" />
              </svg>
              <span>Tailwind CSS</span>
            </span>
          </p>
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </div>
      </motion.div>

      {/* Scroll to Top Button - Fixed Position */}
      <div className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-50">
        <button
          onClick={scrollToTop}
          title="Back to Top"
          aria-label="Back to Top"
          className="w-12 h-12 rounded-full border border-accent/50 bg-surface/80 backdrop-blur text-accent hover:bg-accent/20 hover:border-accent hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:-translate-y-1 flex items-center justify-center transition-all duration-300 group"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
}
