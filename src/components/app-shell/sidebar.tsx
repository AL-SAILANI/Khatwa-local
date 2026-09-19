"use client";

import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BookMarked,
  Trophy,
  Medal,
  Settings,
  Map,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard", labelKey: "home", icon: LayoutDashboard },
  { href: "/study-plan/path", labelKey: "studyPath", icon: Map },
  { href: "/courses", labelKey: "courses", icon: BookOpen },
  { href: "/mock-exams", labelKey: "mockExams", icon: FileText },
  { href: "/vocabulary", labelKey: "vocabulary", icon: BookMarked },
  { href: "/achievements", labelKey: "achievements", icon: Trophy },
  { href: "/leaderboard", labelKey: "leaderboard", icon: Medal },
  { href: "/settings", labelKey: "settings", icon: Settings },
] as const;

export function Sidebar() {
  const t = useTranslations("sidebar");
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-e border-border bg-surface lg:flex">
      <div className="px-6 pt-6 pb-3">
        <Link href="/dashboard" className="flex w-full justify-center">
          <Logo />
        </Link>
      </div>

      <div
        aria-hidden
        className="mx-5 h-px bg-border"
      />

      <nav aria-label={t("ariaLabel")} className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-butter-yellow text-ink-violet"
                  : "text-foreground/70 hover:bg-surface-muted hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "size-4.5 transition-colors",
                  // Matches the label's own colour: `secondary-400` was a
                  // leftover ramp step that left the icon (7.9:1) visibly
                  // lighter than the label beside it (15.9:1).
                  isActive ? "text-ink-violet" : "text-muted group-hover:text-ink-violet dark:group-hover:text-primary-300 dark:text-primary-300",
                )}
              />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
