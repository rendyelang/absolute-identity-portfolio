"use client";

import { motion } from "framer-motion";
import { Certificate } from "@prisma/client";
import { useLanguage } from "@/components/LanguageContext";
import { ArrowRight, Award } from "lucide-react";

export default function CertificatesListWrapper({ certificates }: { certificates: Certificate[] }) {
  const { language } = useLanguage();

  if (!certificates || certificates.length === 0) {
    return (
      <div className="col-span-full py-12 text-center text-text-muted border border-dashed border-border rounded-xl">
        No certificates available yet.
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {certificates.map((cert, index) => (
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative flex flex-col justify-end rounded-2xl bg-surface border border-border/50 hover:border-accent/40 shadow-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-500 aspect-video sm:aspect-[1.3/1] md:aspect-[1.4/1] animate-fade-in-up"
        >
          {/* Base Background Image (for when hover lifts the real image away safely) */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute inset-0 bg-surface" />
            <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/80 to-bg/40" />
          </div>

          {/* FLOATING IMAGE POPUP - This scales aggressively out of bounds on hover */}
          <div className="absolute inset-0 z-0 group-hover:z-50 rounded-2xl overflow-hidden pointer-events-none transition-all duration-500 ease-out lg:group-hover:scale-[1.8] group-hover:scale-[1.3] group-hover:-translate-y-4 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-transparent group-hover:border-accent/50 bg-surface">
             {cert.imageUrl && (
               // eslint-disable-next-line @next/next/no-img-element
               <img 
                 src={cert.imageUrl} 
                 alt={cert.title} 
                 className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
               />
             )}
             {/* Gradient overlay for normal state so base text is readable */}
             <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/90 to-bg/20 group-hover:opacity-0 transition-opacity duration-300" />
          </div>

          {/* Content Context Layer (sits normally on base image, covered by floating popup on hover) */}
          <div className="relative z-10 p-5 pointer-events-none mb-2">
            <div className="text-xs font-mono text-accent mb-2 tracking-widest opacity-90">
              {cert.date}
            </div>
            <h3 className="text-xl font-bold text-text group-hover:text-transparent transition-colors leading-tight mb-2">
              {language === "EN" && (cert as any).titleEn ? (cert as any).titleEn : cert.title}
            </h3>
            <p className="text-sm font-medium text-text-muted/90 group-hover:opacity-0 transition-opacity duration-300">
              {cert.issuer}
            </p>
          </div>
          
          {/* Make the entire card clickable, above everything */}
          {cert.credentialUrl && (
            <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="absolute inset-0 z-60" aria-label={`View credential for ${cert.title}`} />
          )}
        </motion.div>
      ))}
    </div>
  );
}
