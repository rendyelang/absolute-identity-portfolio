import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "@/components/Providers";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <Providers>
      <div className="min-h-screen bg-bg flex flex-col md:flex-row antialiased">
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto w-full pb-20">{children}</div>
        </main>
      </div>
    </Providers>
  );
}
