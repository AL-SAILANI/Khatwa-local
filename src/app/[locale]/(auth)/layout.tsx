import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NightShiftToggle } from "@/components/theme/night-shift-toggle";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { ComponentErrorBoundary } from "@/components/ui/error-boundary";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(60%_60%_at_50%_0%,theme(colors.primary.500/0.12),transparent)]"
        aria-hidden
      />

      <header className="flex items-center justify-between p-6">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <NightShiftToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <ComponentErrorBoundary>{children}</ComponentErrorBoundary>
      </main>
    </div>
  );
}
