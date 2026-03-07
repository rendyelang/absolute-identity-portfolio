"use client";

import { motion } from "framer-motion";
import { Experience } from "@prisma/client";
import { useLanguage } from "@/components/LanguageContext";

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const { t, language } = useLanguage();

  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="experience" className="scroll-mt-24">
      {/* Mobile Sticky Header */}
      <div className="sticky top-0 z-20 -mx-6 mb-4 bg-bg/90 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:hidden">
        <h2 className="text-sm font-bold tracking-widest text-text uppercase flex items-center gap-4">
          <span className="text-accent font-mono">02.</span> {t("nav_experience")}
          <span className="h-px bg-border grow"></span>
        </h2>
      </div>

      <div className="space-y-12">
        {experiences.map((exp, index) => {
          const startDate = new Date(exp.startDate).toLocaleDateString(language === "ID" ? "id-ID" : "en-US", { month: "short", year: "numeric" }).toUpperCase();
          const endDateText = language === "ID" ? "SEKARANG" : "PRESENT";
          const endDate = exp.current ? endDateText : exp.endDate ? new Date(exp.endDate).toLocaleDateString(language === "ID" ? "id-ID" : "en-US", { month: "short", year: "numeric" }).toUpperCase() : "";

          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 -mx-6 rounded-xl hover:bg-surface/50 border border-transparent hover:border-border/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.05)] transition-all"
            >
              <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors">
                {language === "EN" && exp.titleEn ? exp.titleEn : exp.title} <span className="text-text-muted font-normal">• {exp.company}</span>
              </h3>

              <div className="text-xs font-mono text-text-muted mt-3 mb-6 tracking-widest opacity-80">
                {startDate} - {endDate}
              </div>

              <ul className="space-y-3">
                {(language === "EN" && exp.descriptionEn ? exp.descriptionEn : exp.description)
                  .split("\n")
                  .filter((line: string) => line.trim().length > 0)
                  .map((line: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-text-muted leading-relaxed">
                      <span className="text-accent text-xs mt-1">▸</span>
                      <span>{line.replace(/^[-*•]\s*/, "") /* Remove existing bullet markers if any */}</span>
                    </li>
                  ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
