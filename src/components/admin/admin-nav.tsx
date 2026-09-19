"use client";

import { useTranslations } from "next-intl";
import { LayoutDashboard, Users, BookOpen, FileQuestion } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NightShiftToggle } from "@/components/theme/night-shift-toggle";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/admin", labelKey: "overview", icon: LayoutDashboard },
  { href: "/admin/users", labelKey: "users", icon: Users },
  { href: "/admin/courses", labelKey: "courses", icon: BookOpen },
  { href: "/admin/questions", labelKey: "questions", icon: FileQuestion },
] as const;

export function AdminNav() {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:gap-8 sm:px-6">
        <Link href="/admin" className="shrink-0">
          <Logo />
        </Link>
        <nav className="flex flex-1 gap-1 overflow-x-auto" aria-label={t("navLabel")}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary-50 text-ink-violet dark:bg-primary-500/10 dark:text-primary-300"
                  : "text-foreground/70 hover:bg-surface-muted",
              )}
            >
              <item.icon className="size-4" />
              <span className="hidden sm:inline">{t(item.labelKey)}</span>
              <span className="sr-only sm:hidden">{t(item.labelKey)}</span>
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          <NightShiftToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
