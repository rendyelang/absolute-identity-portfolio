import prisma from "@/lib/prisma";
import { FolderKanban, Briefcase, Tags, Layers, GraduationCap, Award, Trophy, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardOverview() {
  const [
    projectCount,
    experienceCount,
    educationCount,
    activityCount,
    certificateCount,
    tagCount,
    techStackCount
  ] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.activity.count(),
    prisma.certificate.count(),
    prisma.tag.count(),
    prisma.techStack.count()
  ]);

  const stats = [
    { name: "Projects", value: projectCount, icon: FolderKanban, color: "text-blue-400", bg: "bg-blue-400/10", border: "group-hover:border-blue-400/50" },
    { name: "Experience", value: experienceCount, icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "group-hover:border-emerald-400/50" },
    { name: "Education", value: educationCount, icon: GraduationCap, color: "text-purple-400", bg: "bg-purple-400/10", border: "group-hover:border-purple-400/50" },
    { name: "Activities", value: activityCount, icon: Trophy, color: "text-amber-400", bg: "bg-amber-400/10", border: "group-hover:border-amber-400/50" },
    { name: "Certificates", value: certificateCount, icon: Award, color: "text-rose-400", bg: "bg-rose-400/10", border: "group-hover:border-rose-400/50" },
    { name: "Tags", value: tagCount, icon: Tags, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "group-hover:border-cyan-400/50" },
    { name: "Tech Stacks", value: techStackCount, icon: Layers, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "group-hover:border-indigo-400/50" },
  ];

  const quickActions = [
    { name: "Add Project", href: "/dashboard/projects", icon: FolderKanban },
    { name: "Add Experience", href: "/dashboard/experience", icon: Briefcase },
    { name: "Add Activity", href: "/dashboard/activities", icon: Trophy },
    { name: "Add Certificate", href: "/dashboard/certificates", icon: Award },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-text mb-2">Overview</h1>
        <p className="text-text-muted">Welcome back! Here is a summary of your portfolio data.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`group bg-surface/50 backdrop-blur-sm p-5 md:p-6 rounded-2xl border border-border/50 hover:bg-surface transition-all duration-300 ${stat.border} hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-text mb-1">{stat.value}</p>
                <h3 className="text-sm font-medium text-text-muted">{stat.name}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold font-playfair mb-5 text-text flex items-center gap-2">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                href={action.href}
                className="group relative overflow-hidden flex items-center justify-between p-4 rounded-xl border border-border bg-surface/30 hover:bg-surface hover:border-accent/40 transition-all duration-300"
              >
                {/* Hover Glow Background */}
                <div className="absolute inset-0 bg-linear-to-r from-accent/0 via-accent/5 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                
                <div className="relative z-10 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-border/50 text-text-muted group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-text group-hover:text-accent transition-colors">{action.name}</span>
                </div>
                <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center bg-transparent group-hover:bg-accent/10 transition-colors">
                  <Plus className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* System Status / Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-surface/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 text-sm h-full">
          <h2 className="text-lg font-bold mb-4 font-playfair flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-text-muted">Database</span>
              <span className="text-emerald-400 font-mono text-xs px-2 py-1 bg-emerald-400/10 rounded-md">Connected (Neon)</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-text-muted">Assets</span>
              <span className="text-emerald-400 font-mono text-xs px-2 py-1 bg-emerald-400/10 rounded-md">Firebase Storage</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Auth</span>
              <span className="text-emerald-400 font-mono text-xs px-2 py-1 bg-emerald-400/10 rounded-md">NextAuth Github</span>
            </div>
          </div>
        </div>

        <div className="bg-surface/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 flex flex-col justify-center relative overflow-hidden h-full">
           <div className="relative z-10">
              <h2 className="text-lg font-bold mb-3 font-playfair">Public Profile</h2>
              <p className="text-sm text-text-muted mb-6 leading-relaxed max-w-sm">
                Your portfolio is live and displaying the data managed from this dashboard.
              </p>
              <Link href="/" target="_blank" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg hover:bg-accent-2 transition-colors font-bold text-sm rounded-lg group">
                View Public Live Site
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
           
           {/* Abstract Decoration */}
           <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
