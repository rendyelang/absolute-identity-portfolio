"use client";

import { motion } from "framer-motion";
import { Certificate } from "@prisma/client";
import { useLanguage } from "@/components/LanguageContext";
import { ArrowRight, Award } from "lucide-react";
import Link from "next/link";

export default function CertificateSection({ certificates }: { certificates: Certificate[] }) {
  const { t, language } = useLanguage();

  if (!certificates || certificates.length === 0) return null;

  // We enforce showing only the top 3 on the main page.
  const displayCertificates = certificates.slice(0, 3);

  return (
    <section id="certificates" className="scroll-mt-24">
      {/* Mobile Sticky Header */}
      <div className="sticky top-0 z-20 -mx-6 mb-8 bg-bg/90 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:hidden">
        <h2 className="text-sm font-bold tracking-widest text-text uppercase flex items-center gap-4">
          <span className="text-accent font-mono">04.</span> {t("nav_certificates")}
          <span className="h-px bg-border grow"></span>
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {displayCertificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative flex flex-col justify-end rounded-2xl bg-surface border border-border/50 hover:border-accent/40 shadow-lg transition-all duration-500 aspect-video sm:aspect-[1.3/1] md:aspect-[1.4/1]`}
          >
            {/* Base Background Image (for when hover lifts the real image away safely) */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute inset-0 bg-surface" />
              <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/80 to-bg/40" />
            </div>

            {/* FLOATING IMAGE POPUP - This scales aggressively out of bounds on hover */}
            <div className="absolute inset-0 z-0 group-hover:z-50 rounded-2xl overflow-hidden pointer-events-none transition-all duration-500 ease-out lg:group-hover:scale-[2] group-hover:scale-[1.2] group-hover:-translate-y-4 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-transparent group-hover:border-accent/50 bg-surface">
              {cert.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              )}
              {/* Gradient overlay for normal state so base text is readable */}
              <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/90 to-bg/20 group-hover:opacity-0 transition-opacity duration-300" />
            </div>

            {/* Content Context Layer (sits normally on base image, covered by floating popup on hover) */}
            <div className="relative z-10 p-5 pointer-events-none mb-2">
              <div className="text-xs font-mono text-accent mb-2 tracking-widest opacity-90">{cert.date}</div>
              <h3 className="text-base font-bold text-text group-hover:text-transparent transition-colors leading-tight mb-1">{language === "EN" && (cert as any).titleEn ? (cert as any).titleEn : cert.title}</h3>
              <p className="text-sm font-medium text-text-muted/90 max-w-sm group-hover:opacity-0 transition-opacity duration-300">{cert.issuer}</p>
            </div>

            {/* Make the entire card clickable, above everything */}
            {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="absolute inset-0 z-60" aria-label={`View credential for ${cert.title}`} />}
          </motion.div>
        ))}
      </div>

      {certificates.length > 3 && (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-10 flex justify-center">
          <Link href="/certificates" className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-surface hover:border-accent hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300">
            <span className="text-sm font-bold text-text group-hover:text-accent transition-colors">{language === "ID" ? "Lihat Semua Sertifikat" : "View All Certificates"}</span>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors group-hover:translate-x-1" />
          </Link>
        </motion.div>
      )}
    </section>
  );
}
