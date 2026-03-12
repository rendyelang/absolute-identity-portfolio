"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Experience, Education, Activity } from "@prisma/client";
import { useLanguage } from "@/components/LanguageContext";
import { Briefcase, GraduationCap, Trophy, Star, ExternalLink } from "lucide-react";

export default function ExperienceSection({ experiences, educations, activities }: { experiences: Experience[]; educations: Education[]; activities: Activity[] }) {
  const { t, language, experienceTab: activeTab, setExperienceTab: setActiveTab } = useLanguage();

  if ((!experiences || experiences.length === 0) && (!educations || educations.length === 0) && (!activities || activities.length === 0)) return null;

  const tabLabel = () => {
    switch (activeTab) {
      case "education":
        return language === "ID" ? "Pendidikan" : "Education";
      case "experience":
        return t("nav_experience");
      case "activities":
        return language === "ID" ? "Aktivitas" : "Activities";
    }
  };

  const tabs = [
    { key: "education" as const, labelID: "Pendidikan", labelEN: "Education" },
    { key: "experience" as const, labelID: "Pengalaman", labelEN: "Experience" },
    { key: "activities" as const, labelID: "Aktivitas", labelEN: "Activities" },
  ];

  return (
    <section id="experience" className="scroll-mt-24">
      {/* Mobile Sticky Header */}
      <div className="sticky top-0 z-20 -mx-6 mb-4 bg-bg/90 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:hidden">
        <h2 className="text-sm font-bold tracking-widest text-text uppercase flex items-center gap-4">
          <span className="text-accent font-mono">02.</span> {tabLabel()}
          <span className="h-px bg-border grow"></span>
        </h2>
      </div>

      {/* Modern Tabs Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center p-1.5 bg-surface/50 backdrop-blur border border-border/50 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 ${activeTab === tab.key ? "text-bg" : "text-text-muted hover:text-text"}`}
            >
              {activeTab === tab.key && (
                <motion.div layoutId="activeTabBg" className="absolute inset-0 bg-accent rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.4)]" initial={false} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <span className="relative z-10">{language === "ID" ? tab.labelID : tab.labelEN}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="relative">
        {/* Continuous vertical line for the timeline track */}
        <div className="absolute top-2 bottom-0 left-6 w-0.5 bg-border/60 shadow-[0_0_10px_rgba(34,211,238,0.1)] -translate-x-1/2 rounded-full z-0"></div>

        <AnimatePresence mode="wait">
          {activeTab === "education" ? (
            <motion.div key="education" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }} className="space-y-12">
              {educations.map((edu, index) => (
                <motion.div key={edu.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4, delay: index * 0.1 }} className="relative group pl-16 pb-2">
                  {/* Timeline Node Icon/Logo */}
                  <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-surface border-4 border-bg flex items-center justify-center overflow-hidden z-10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                    {edu.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={edu.logoUrl} alt={edu.institution} className="w-full h-full object-cover" />
                    ) : (
                      <GraduationCap className="w-5 h-5 text-accent" />
                    )}
                  </div>

                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-text group-hover:text-accent transition-colors duration-300">{edu.institution}</h3>
                    <p className="text-sm font-medium text-text-muted/90 mt-1">{edu.degree}</p>
                    <div className="text-xs font-mono text-text-muted mt-2 tracking-widest opacity-80 flex items-center gap-3">
                      <span>
                        {edu.startDate} - {edu.endDate || (language === "ID" ? "Sekarang" : "Present")}
                      </span>
                      {edu.gpa && <span className="px-2 py-0.5 rounded bg-surface/80 border border-border text-[10px] text-accent font-bold">GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
              {educations.length === 0 && <div className="text-sm text-text-muted font-mono pl-2">No education records found.</div>}
            </motion.div>
          ) : activeTab === "experience" ? (
            <motion.div key="experience" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }} className="space-y-12">
              {experiences.map((exp, index) => {
                const startDate = new Date(exp.startDate).toLocaleDateString(language === "ID" ? "id-ID" : "en-US", { month: "short", year: "numeric" }).toUpperCase();
                const endDateText = language === "ID" ? "SEKARANG" : "PRESENT";
                const endDate = exp.current ? endDateText : exp.endDate ? new Date(exp.endDate).toLocaleDateString(language === "ID" ? "id-ID" : "en-US", { month: "short", year: "numeric" }).toUpperCase() : "";

                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative group pl-16 pb-2"
                  >
                    {/* Timeline Node Icon/Logo */}
                    <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-surface border-4 border-bg flex items-center justify-center overflow-hidden z-10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                      {exp.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={exp.logoUrl} alt={exp.company} className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-accent" />
                      )}
                    </div>

                    <div className="pt-1 p-5 -mx-5 sm:p-6 sm:-mx-6 rounded-xl hover:bg-surface/30 border border-transparent hover:border-border/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.05)] transition-all -mt-5 sm:-mt-6">
                      <h3 className="text-xl font-bold text-text group-hover:text-accent transition-colors duration-300">{language === "EN" && exp.titleEn ? exp.titleEn : exp.title}</h3>
                      <p className="text-sm font-medium text-text-muted/90 mt-1">{exp.company}</p>

                      <div className="text-xs font-mono text-text-muted mt-2 mb-4 tracking-widest opacity-80">
                        {startDate} - {endDate}
                      </div>

                      <ul className="space-y-2.5">
                        {(language === "EN" && exp.descriptionEn ? exp.descriptionEn : exp.description)
                          .split("\n")
                          .filter((line: string) => line.trim().length > 0)
                          .map((line: string, i: number) => (
                            <li key={i} className="flex gap-3 text-sm text-text-muted leading-relaxed">
                              <span className="text-accent text-[10px] mt-1.5 opacity-70">✦</span>
                              <span>{line.replace(/^[-*•]\s*/, "")}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
              {experiences.length === 0 && <div className="text-sm text-text-muted font-mono pl-2">No experience records found.</div>}
            </motion.div>
          ) : (
            /* Activities Tab */
            <motion.div key="activities" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }} className="space-y-12">
              {activities.map((act, index) => (
                <motion.div key={act.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4, delay: index * 0.1 }} className="relative group pl-16 pb-2">
                  {/* Timeline Node Icon/Logo */}
                  <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-surface border-4 border-bg flex items-center justify-center overflow-hidden z-10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                    {act.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={act.logoUrl} alt={act.organizer} className="w-full h-full object-cover" />
                    ) : (
                      <Trophy className="w-5 h-5 text-accent" />
                    )}
                  </div>

                  <div className="pt-1 p-5 -mx-5 sm:p-6 sm:-mx-6 rounded-xl hover:bg-surface/30 border border-transparent hover:border-border/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.05)] transition-all -mt-5 sm:-mt-6">
                    {/* Type badge + Title */}
                    <div className="flex flex-wrap items-center gap-2 mb-1 justify-end lg:justify-start">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border mb-2 ${
                          act.type === "competition" ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]" : "bg-accent/10 text-accent border-accent/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
                        }`}
                      >
                        {act.type === "competition" ? (language === "ID" ? "Kompetisi" : "Competition") : "Bootcamp"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-text group-hover:text-accent transition-colors duration-300">{language === "EN" && act.titleEn ? act.titleEn : act.title}</h3>
                    <p className="text-sm font-medium text-text-muted/90 mt-1">{act.organizer}</p>

                    <div className="text-xs font-mono text-text-muted mt-2 mb-3 tracking-widest opacity-80">
                      {act.date}
                      {act.endDate ? ` — ${act.endDate}` : ""}
                    </div>

                    {/* Achievement badge */}
                    {act.achievement && (
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-bold shadow-[0_0_12px_rgba(34,211,238,0.1)]">
                          <Star className="w-3 h-3" />
                          {language === "EN" && act.achievementEn ? act.achievementEn : act.achievement}
                        </span>
                      </div>
                    )}

                    <ul className="space-y-2.5">
                      {(language === "EN" && act.descriptionEn ? act.descriptionEn : act.description)
                        .split("\n")
                        .filter((line: string) => line.trim().length > 0)
                        .map((line: string, i: number) => (
                          <li key={i} className="flex gap-3 text-sm text-text-muted leading-relaxed">
                            <span className="text-accent text-[10px] mt-1.5 opacity-70">✦</span>
                            <span>{line.replace(/^[-*•]\s*/, "")}</span>
                          </li>
                        ))}
                    </ul>

                    {/* Certificate link */}
                    {act.certificateUrl && (
                      <a href={act.certificateUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-accent hover:text-accent-2 transition-colors group/cert">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="border-b border-accent/30 group-hover/cert:border-accent transition-colors">{language === "ID" ? "Lihat Sertifikat" : "View Certificate"}</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
              {activities.length === 0 && <div className="text-sm text-text-muted font-mono pl-2">{language === "ID" ? "Belum ada aktivitas." : "No activities found."}</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
