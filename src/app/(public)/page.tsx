export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import LeftSidebar from "@/components/public/LeftSidebar";
import AboutSection from "@/components/public/AboutSection";
import ExperienceSection from "@/components/public/ExperienceSection";
import ProjectsSection from "@/components/public/ProjectsSection";
import ContactSection from "@/components/public/ContactSection";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const [profile, experiences, projects, tags, techStacks] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.project.findMany({
      orderBy: { order: "asc" },
      include: { tags: true, techStacks: true },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.techStack.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <div className="lg:w-[48%] lg:sticky lg:top-0 lg:h-screen lg:py-0">
        <LeftSidebar profile={profile} />
      </div>

      <div className="lg:w-[52%] pt-12 lg:pt-24 pb-24 flex flex-col gap-24 lg:gap-32">
        <AboutSection profile={profile} techStacks={techStacks} />
        <ExperienceSection experiences={experiences} />
        <ProjectsSection projects={projects} />
        <ContactSection profile={profile} />
      </div>
    </>
  );
}
