import { setRequestLocale } from "next-intl/server";
import { AuthGuard } from "@/components/app-shell/auth-guard";
import { Sidebar } from "@/components/app-shell/sidebar";
import { MobileNav } from "@/components/app-shell/mobile-nav";
import { Topbar } from "@/components/app-shell/topbar";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
          <Topbar />
          {children}
        </main>
      </div>
      <MobileNav />
    </AuthGuard>
  );
}
