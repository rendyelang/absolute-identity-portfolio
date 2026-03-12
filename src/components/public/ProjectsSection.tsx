"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github, ChevronDown, ChevronUp, X, Globe, ExternalLink } from "lucide-react";
import { Prisma } from "@prisma/client";
import { useLanguage } from "@/components/LanguageContext";
import Link from "next/link";

type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: { tags: true; techStacks: true };
}>;

type Tag = Prisma.TagGetPayload<{}>;

export default function ProjectsSection({ projects }: { projects: ProjectWithRelations[] }) {
  const { t, language } = useLanguage();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [popupProject, setPopupProject] = useState<ProjectWithRelations | null>(null);

  if (!projects || projects.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="projects" className="scroll-mt-24">
      {/* Mobile Sticky Header */}
      <div className="sticky top-0 z-30 -mx-6 mb-4 bg-bg/90 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:hidden">
        <h2 className="text-sm font-bold tracking-widest text-text uppercase flex items-center gap-4">
          <span className="text-accent font-mono">03.</span> {t("nav_projects")}
          <span className="h-px bg-border grow"></span>
        </h2>
      </div>

      <div className="space-y-12">
        {projects.map((project, index) => {
          const isExpanded = expandedIds.has(project.id);
          const description = language === "EN" && project.descriptionEn ? project.descriptionEn : project.description;
          const longDesc = language === "EN" && project.longDescEn ? project.longDescEn : project.longDesc;
          const fullText = longDesc || description;
          const hasMore = fullText.length > 150 || fullText.includes("\n");

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col sm:flex-row gap-6 p-4 -mx-4 rounded-xl hover:bg-surface/50 transition-all border border-transparent hover:border-border/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
            >
              {/* Tags Positioned Top Right */}
              {project.tags && project.tags.length > 0 && (
                <div className="absolute top-4 right-4 z-20 flex flex-wrap gap-2 justify-end mt-2 mr-2 lg:mt-0 lg:mr-0">
                  {project.tags.map((tag) => (
                    <span key={tag.id} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-accent/30 bg-bg/80 backdrop-blur text-accent flex items-center gap-1.5 shadow-sm">
                      {tag.color && <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: tag.color, color: tag.color }} />}
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              {/* Left Image */}
              <div className="sm:w-1/3 shrink-0 relative">
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="block">
                    <div className="aspect-video rounded border border-border/50 bg-surface relative z-10 transition-transform duration-300 lg:hover:scale-[3.5] hover:-translate-y-2 hover:translate-x-2 lg:hover:translate-x-6 hover:z-50 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                      {project.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-90 hover:opacity-100 rounded transition-all duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">No Image</div>
                      )}
                    </div>
                  </a>
                ) : (
                  <div className="aspect-video rounded border border-border/50 bg-surface relative z-10 transition-transform duration-300 lg:hover:scale-[3.5] hover:-translate-y-2 hover:translate-x-2 lg:hover:translate-x-6 hover:z-50 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                    {project.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-90 hover:opacity-100 rounded transition-all duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">No Image</div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Content */}
              <div className="sm:w-2/3 flex flex-col justify-start relative">
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="w-fit">
                    <h3 className="text-lg font-bold text-text group-hover:text-accent flex items-center gap-1 transition-colors w-fit relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out group-hover:after:origin-bottom-left group-hover:after:scale-x-100 mt-2 sm:mt-0">
                      <span>{language === "EN" && project.titleEn ? project.titleEn : project.title}</span>
                      <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                  </a>
                ) : (
                  <button onClick={() => setPopupProject(project)} className="w-fit cursor-pointer">
                    <h3 className="text-lg font-bold text-text group-hover:text-accent flex items-center gap-1 transition-colors w-fit relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out group-hover:after:origin-bottom-left group-hover:after:scale-x-100 mt-2 sm:mt-0">
                      <span>{language === "EN" && project.titleEn ? project.titleEn : project.title}</span>
                      <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                  </button>
                )}

                {/* Description with Read More / Show Less */}
                <div className="mt-2 mb-4">
                  <AnimatePresence mode="wait" initial={false}>
                    {isExpanded ? (
                      <motion.div key="expanded" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                        <div className="text-sm text-text-muted leading-relaxed space-y-2">
                          {fullText
                            .split("\n")
                            .filter((line: string) => line.trim().length > 0)
                            .map((line: string, i: number) => (
                              <p key={i}>{line.replace(/^[-*•]\s*/, "")}</p>
                            ))}
                        </div>
                        {hasMore && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(project.id);
                            }}
                            className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-accent hover:text-accent-2 transition-colors cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                            {language === "ID" ? "Tampilkan Lebih Sedikit" : "Show Less"}
                          </button>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <p className="text-sm text-text-muted leading-relaxed line-clamp-3">{description}</p>
                        {hasMore && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(project.id);
                            }}
                            className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-accent hover:text-accent-2 transition-colors cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                            {language === "ID" ? "Baca Selengkapnya" : "Read More"}
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.techStacks.map((tech) => (
                    <div key={tech.id} className="flex items-center gap-1.5 bg-accent/10 text-accent px-2.5 py-1 rounded-full text-xs font-mono border border-transparent group-hover:border-accent/20">
                      {tech.iconUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={tech.iconUrl} alt={tech.name} className="w-3 h-3" />
                      )}
                      <span>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12">
        <Link href="/archive" className="group inline-flex items-center gap-2 text-sm font-bold text-text hover:text-accent transition-colors font-playfair tracking-wide">
          <span>{t("view_archive")}</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>
      {/* Live URL Unavailable Popup */}
      <AnimatePresence>
        {popupProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setPopupProject(null)}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-surface/90 backdrop-blur-xl border border-border/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(34,211,238,0.15),0_0_80px_rgba(34,211,238,0.05)] text-center"
            >
              {/* Close button */}
              <button onClick={() => setPopupProject(null)} className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              {/* Glow orb */}
              <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                <Globe className="w-7 h-7 text-accent" />
              </div>

              {/* Project name */}
              <h3 className="text-lg font-bold text-text mb-2">{language === "EN" && popupProject.titleEn ? popupProject.titleEn : popupProject.title}</h3>

              {/* Message */}
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                {language === "ID" ? "Live URL untuk proyek ini belum tersedia saat ini. Silakan cek kembali nanti!" : "The live URL for this project is currently unavailable. Please check back later!"}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {popupProject.repoUrl && (
                  <a
                    href={popupProject.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent/10 text-accent border border-accent/30 rounded-xl text-sm font-bold hover:bg-accent/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                  >
                    <Github className="w-4 h-4" />
                    {language === "ID" ? "Lihat Repository" : "View Repository"}
                  </a>
                )}
                <button
                  onClick={() => setPopupProject(null)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-xl text-sm font-medium text-text-muted hover:text-text hover:border-text-muted/50 transition-all cursor-pointer"
                >
                  {language === "ID" ? "Tutup" : "Close"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
