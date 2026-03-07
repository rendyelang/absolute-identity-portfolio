import { Profile } from "@prisma/client";

export default function Footer({ profile }: { profile: Profile | null }) {
  const currentYear = new Date().getFullYear();
  const name = profile?.name || "Rendi Elang";

  return (
    <footer className="border-t border-border py-8 mt-12 bg-bg/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-text-muted text-sm mb-2 font-medium">Built with Next.js, Tailwind CSS & Prisma.</p>
        <p className="text-text-muted text-sm">
          &copy; {currentYear} {name}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
