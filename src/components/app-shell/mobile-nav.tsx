"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BookMarked,
  MoreHorizontal,
  Trophy,
  Medal,
  Settings,
  LogOut,
  Map,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NightShiftToggle } from "@/components/theme/night-shift-toggle";
import { cn } from "@/lib/utils/cn";
import { logout } from "@/lib/firebase/auth";

const PRIMARY_ITEMS = [
  { href: "/dashboard", labelKey: "home", icon: LayoutDashboard },
  { href: "/courses", labelKey: "courses", icon: BookOpen },
  { href: "/mock-exams", labelKey: "mockExams", icon: FileText },
  { href: "/vocabulary", labelKey: "vocabulary", icon: BookMarked },
] as const;

const MORE_ITEMS = [
  { href: "/study-plan/path", labelKey: "studyPath", icon: Map },
  { href: "/achievements", labelKey: "achievements", icon: Trophy },
  { href: "/leaderboard", labelKey: "leaderboard", icon: Medal },
  { href: "/settings", labelKey: "settings", icon: Settings },
] as const;

export function MobileNav() {
  const t = useTranslations("sidebar");
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!isMoreOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMoreOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMoreOpen]);

  const moreActive = MORE_ITEMS.some((item) => isActive(item.href));

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 items-stretch px-2">
        {PRIMARY_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 px-0.5 py-2.5 text-xs font-medium transition-colors",
                active
                  ? "text-ink-violet dark:text-primary-300"
                  : "text-muted hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                  active && "bg-butter-yellow text-ink-violet",
                )}
              >
                <item.icon className="size-5" />
              </span>
              <span className="w-full truncate text-center leading-none">{t(item.labelKey)}</span>
            </Link>
          );
        })}

        <div ref={moreRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMoreOpen((open) => !open)}
            aria-expanded={isMoreOpen}
            aria-haspopup="dialog"
            aria-label={t("more")}
            className={cn(
              "flex w-full flex-col items-center gap-1 px-0.5 py-2.5 text-xs font-medium transition-colors",
              moreActive
                ? "text-ink-violet dark:text-primary-300"
                : "text-muted hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-full transition-all duration-200",
                moreActive && "bg-butter-yellow text-ink-violet",
              )}
            >
              <MoreHorizontal className="size-5" />
            </span>
            <span className="w-full truncate text-center leading-none">{t("more")}</span>
          </button>

          {isMoreOpen && (
            <div
              className="absolute bottom-full left-1/2 mb-3 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface p-1.5"
            >
              {MORE_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-butter-yellow text-ink-violet"
                        : "text-foreground/80 hover:bg-surface-muted",
                    )}
                  >
                    <item.icon className={cn("size-4", active ? "text-ink-violet" : undefined)} />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
              <div className="mt-1 flex items-center justify-center gap-3 border-t border-border pt-2">
                <NightShiftToggle />
                <ThemeToggle />
              </div>
              <div className="mt-1 border-t border-border pt-1">
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-surface-muted"
                >
                  <LogOut className="size-4" />
                  {t("logout")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
