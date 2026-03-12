import CursorGlow from "@/components/public/CursorGlow";
import SmoothScroll from "@/components/public/SmoothScroll";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg min-h-screen text-text selection:bg-accent/30 selection:text-accent font-inter">
      <SmoothScroll />
      <CursorGlow />
      <div className="max-w-7xl mx-auto min-h-screen relative flex flex-col lg:flex-row px-6 md:px-12 lg:px-24">{children}</div>
    </div>
  );
}
