import { setRequestLocale } from "next-intl/server";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminNav } from "@/components/admin/admin-nav";
import { ComponentErrorBoundary } from "@/components/ui/error-boundary";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminGuard>
      <div className="flex min-h-screen w-full flex-col">
        <AdminNav />
        <div className="flex-1">
          <ComponentErrorBoundary>{children}</ComponentErrorBoundary>
        </div>
      </div>
    </AdminGuard>
  );
}
