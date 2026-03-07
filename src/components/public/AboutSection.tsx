"use client";

import { motion } from "framer-motion";
import { Profile, TechStack } from "@prisma/client";
import { useLanguage } from "@/components/LanguageContext";

export default function AboutSection({ profile, techStacks }: { profile: Profile | null; techStacks: TechStack[] }) {
  const { t, language } = useLanguage();

  if (!profile) return null;

  return (
    <section id="about" className="scroll-mt-24">
      {/* Mobile Sticky Header */}
      <div className="sticky top-0 z-20 -mx-6 mb-4 bg-bg/90 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:hidden">
        <h2 className="text-sm font-bold tracking-widest text-text uppercase flex items-center gap-4">
          <span className="text-accent font-mono">01.</span> {t("nav_about")}
          <span className="h-px bg-border grow"></span>
        </h2>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }} className="space-y-6 text-base lg:text-lg text-text-muted leading-relaxed">
        <p>
          {language === "ID"
            ? "Halo! Nama saya Rendi, tapi kebanyakan orang memanggil saya Rendy. Saya suka membuat hal-hal yang 'hidup' di perangkat mobile dan web. Ketertarikan saya terhadap dunia IT Development dimulai sejak lama."
            : "Hi! My name is Rendi, but most people call me Rendy. I love creating things that 'live' on mobile devices and the web. My interest in IT Development started a long time ago."}
        </p>

        <p className="whitespace-pre-line">{language === "EN" && profile.bioEn ? profile.bioEn : profile.bio}</p>

        <p>{language === "ID" ? "Berikut adalah beberapa teknologi yang sedang saya gunakan dan eksplorasi akhir-akhir ini:" : "Here are some technologies I've been using and exploring lately:"}</p>

        <div className="flex flex-wrap gap-3 mt-4">
          {techStacks.map((tech) => (
            <div
              key={tech.id}
              className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-mono border border-accent/20 hover:border-accent hover:shadow-[0_0_15px_var(--color-accent)] transition-all cursor-default"
            >
              {tech.iconUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={tech.iconUrl} alt={tech.name} className="w-4 h-4" />
              )}
              <span>{tech.name}</span>
            </div>
          ))}
          {techStacks.length === 0 && (
            // Fallback pills if db is empty
            <>
              {["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"].map((tech) => (
                <div
                  key={tech}
                  className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-mono border border-accent/20 hover:border-accent hover:shadow-[0_0_15px_var(--color-accent)] transition-all cursor-default"
                >
                  <span>{tech}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
