import prisma from "@/lib/prisma";
import { ArrowUpRight } from "lucide-react";
import React from 'react';

// We create a client component wrapper for language support if needed in the future,
// but for now we can just fetch and pass raw data.
import CertificatesListWrapper from "@/components/public/CertificatesListWrapper";

export const revalidate = 60;

export default async function CertificatesPage() {
  const [profile, certificates] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.certificate.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="pt-24 pb-16 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto w-full lg:w-3/4">
      {/* Header section */}
      <div className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-text mb-4 lg:mb-6">
          <span className="text-accent">My</span> Certificates
        </h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          A comprehensive list of the certifications, courses, and credentials I have earned throughout my professional journey.
        </p>
      </div>

      <CertificatesListWrapper certificates={certificates} />
    </div>
  );
}
