import prisma from "@/lib/prisma";
import { FolderKanban, Briefcase, Tags, Layers } from "lucide-react";

export default async function DashboardOverview() {
  const [projectCount, experienceCount, tagCount, techStackCount] = await Promise.all([prisma.project.count(), prisma.experience.count(), prisma.tag.count(), prisma.techStack.count()]);

  const stats = [
    { name: "Total Projects", value: projectCount, icon: FolderKanban },
    { name: "Experiences", value: experienceCount, icon: Briefcase },
    { name: "Tags", value: tagCount, icon: Tags },
    { name: "Tech Stacks", value: techStackCount, icon: Layers },
  ];

  return (
    <div>
      <h1 className="text-3xl font-playfair font-bold mb-8">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass p-6 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-text-muted font-medium">{stat.name}</h3>
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 glass p-6 rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-4 font-playfair">Getting Started</h2>
        <p className="text-text-muted mb-4">Welcome to your portfolio dashboard! Use the sidebar navigation to manage your content.</p>
        <ul className="list-disc pl-5 space-y-2 text-text-muted">
          <li>
            <strong>Profile</strong>: Update your bio, social links, and CV.
          </li>
          <li>
            <strong>Experience</strong>: Manage your work timeline.
          </li>
          <li>
            <strong>Projects</strong>: Add new works, link them to tags and tech stacks.
          </li>
          <li>
            <strong>Tags & Tech Stacks</strong>: Pre-define the categories before linking them to projects.
          </li>
        </ul>
      </div>
    </div>
  );
}
