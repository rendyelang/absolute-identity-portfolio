import prisma from "@/lib/prisma";
import CursorGlow from "@/components/public/CursorGlow";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="bg-bg min-h-screen text-text selection:bg-accent/30 selection:text-accent font-inter">
      <CursorGlow />
      <div className="max-w-7xl mx-auto min-h-screen relative flex flex-col lg:flex-row px-6 md:px-12 lg:px-24">{children}</div>
    </div>
  );
}
