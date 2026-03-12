export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import LeftSidebar from "@/components/public/LeftSidebar";
import AboutSection from "@/components/public/AboutSection";
import ExperienceSection from "@/components/public/ExperienceSection";
import ProjectsSection from "@/components/public/ProjectsSection";
import CertificateSection from "@/components/public/CertificateSection";
import ContactSection from "@/components/public/ContactSection";
import { Experience, Education, Certificate } from "@prisma/client";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const [profile, experiences, educations, projects, certificates, tags, techStacks] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.project.findMany({
      orderBy: { order: "asc" },
      include: { tags: true, techStacks: true },
    }),
    prisma.certificate.findMany({ orderBy: { order: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.techStack.findMany({ orderBy: { name: "asc" } }),
  ]);

  // Activity table may not exist yet if migration hasn't been applied
  let activities: any[] = [];
  try {
    activities = await prisma.activity.findMany({ orderBy: { order: "asc" } });
  } catch {
    // Table doesn't exist yet — gracefully fallback to empty array
  }

  return (
    <>
      <div className="lg:w-[48%] lg:sticky lg:top-0 lg:h-screen lg:py-0">
        <LeftSidebar profile={profile} />
      </div>

      <div className="lg:w-[52%] pt-12 lg:pt-24 pb-24 flex flex-col gap-24 lg:gap-32">
        <AboutSection profile={profile} techStacks={techStacks} />
        <ExperienceSection experiences={experiences} educations={educations} activities={activities} />
        <ProjectsSection projects={projects} />
        <CertificateSection certificates={certificates} />
        <ContactSection profile={profile} />
      </div>
    </>
  );
}
