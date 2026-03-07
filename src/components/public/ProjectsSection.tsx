"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { Prisma } from "@prisma/client";
import { useLanguage } from "@/components/LanguageContext";
import Link from "next/link";

type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: { tags: true; techStacks: true };
}>;

type Tag = Prisma.TagGetPayload<{}>;

export default function ProjectsSection({ projects }: { projects: ProjectWithRelations[] }) {
  const { t, language } = useLanguage();

  if (!projects || projects.length === 0) return null;

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
        {projects.map((project, index) => (
          <motion.a
            key={project.id}
            href={project.liveUrl || project.repoUrl || "#"}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative flex flex-col sm:flex-row gap-6 p-4 -mx-4 rounded-xl hover:bg-surface/50 transition-all border border-transparent hover:border-border/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
          >
            {/* Tags Positioned Top Right */}
            {project.tags && project.tags.length > 0 && (
              <div className="absolute top-4 right-4 z-20 flex flex-wrap gap-2 justify-end">
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
              <div className="aspect-video rounded border border-border/50 bg-surface relative z-10 transition-transform duration-300 lg:hover:scale-[3.5] hover:-translate-y-2 hover:translate-x-2 lg:hover:translate-x-6 hover:z-50 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-90 hover:opacity-100 rounded transition-all duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">No Image</div>
                )}
              </div>
            </div>

            {/* Right Content */}
            <div className="sm:w-2/3 flex flex-col justify-start relative">
              <h3 className="text-lg font-bold text-text group-hover:text-accent flex items-center gap-1 transition-colors w-fit relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out group-hover:after:origin-bottom-left group-hover:after:scale-x-100 mt-2 sm:mt-0">
                <span>{language === "EN" && project.titleEn ? project.titleEn : project.title}</span>
                <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
              </h3>

              <p className="text-sm text-text-muted mt-2 mb-4 leading-relaxed line-clamp-3">{language === "EN" && project.descriptionEn ? project.descriptionEn : project.description}</p>

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
          </motion.a>
        ))}
      </div>

      <div className="mt-12">
        <Link href="/archive" className="group inline-flex items-center gap-2 text-sm font-bold text-text hover:text-accent transition-colors font-playfair tracking-wide">
          <span>{t("view_archive")}</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
