"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Briefcase, FolderKanban, Tags, Layers, LogOut, ArrowLeft, Menu, X, GraduationCap, Award, Trophy } from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Experience", href: "/dashboard/experience", icon: Briefcase },
  { name: "Education", href: "/dashboard/education", icon: GraduationCap },
  { name: "Activities", href: "/dashboard/activities", icon: Trophy },
  { name: "Certificates", href: "/dashboard/certificates", icon: Award },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Tags", href: "/dashboard/tags", icon: Tags },
  { name: "Tech Stacks", href: "/dashboard/tech-stacks", icon: Layers },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-surface border-b border-border p-4 sticky top-0 z-40">
        <h2 className="text-xl font-playfair font-bold text-accent">Dashboard</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-text hover:text-accent transition-colors">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-bg/80 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-surface border-r border-border shrink-0 flex flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 hidden md:block">
          <h2 className="text-2xl font-playfair font-bold text-accent">Dashboard</h2>
        </div>

        <nav className="flex-1 px-4 mt-6 md:mt-0 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            // Exact match for Overview, startsWith for others to highlight sub-pages
            const isActive = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                  isActive ? "bg-accent text-bg shadow-[0_0_15px_rgba(34,211,238,0.3)] shadow-accent/20" : "text-text-muted hover:bg-accent/10 hover:text-accent"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-bg" : ""}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-surface-hover hover:text-text rounded-lg transition-all">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Site</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
