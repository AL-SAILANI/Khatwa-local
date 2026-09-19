"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NightShiftToggle } from "@/components/theme/night-shift-toggle";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { PWAInstallButton } from "@/components/pwa/pwa-install-button";
import { PWAInstallModal, type PWAInstallModalHandle } from "@/components/pwa/pwa-install-modal";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { Download, Mail, Menu, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { cn } from "@/lib/utils/cn";

const linkButtonStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

export function Navbar() {
  const t = useTranslations("nav");
  const tTop = useTranslations("topNav");
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tPwa = useTranslations("pwa");
  const { canInstall } = useInstallPrompt();
  const installModalRef = useRef<PWAInstallModalHandle>(null);

  const links = [
    { id: "features", href: "#features", label: t("features") },
    { id: "steps", href: "#steps", label: t("steps") },
    { id: "testimonials", href: "#testimonials", label: t("testimonials") },
    { id: "why-us", href: "#why-us", label: t("whyUs") },
    { id: "faq", href: "#faq", label: t("faq") },
    { id: "pricing", href: "#pricing", label: t("pricing") },
  ];

  /** Anchor links only resolve to a section on the landing page; on other
   * routes we point them at the home page plus the hash so they still work. */
  const resolveHref = (href: string) => {
    if (!href.startsWith("#")) return href;
    return pathname === "/" ? href : `/${href}`;
  };

  return (
    <>
      <div className="hidden bg-ink-violet text-cream-paper/85 sm:block">
        <div className="mx-auto flex h-10 w-full max-w-6xl items-center justify-between gap-4 px-6 text-sm font-medium">
          <span className="min-w-0 truncate">{tTop("tagline")}</span>
          <span className="flex shrink-0 items-center gap-5 whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" />
              <span dir="ltr" className="inline-block">
                {tTop("email")}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <WhatsAppIcon className="size-3.5" />
              <span dir="ltr" className="inline-block">
                {tTop("phone")}
              </span>
            </span>
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setIsMenuOpen(false);
              if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                router.replace("/");
              }
            }}
          >
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
              {links.map((link) => (
              <Link
                key={link.id}
                href={resolveHref(link.href)}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-ink-violet dark:hover:text-primary-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <LanguageToggle />
            <NightShiftToggle />
            <PWAInstallButton />
            <ThemeToggle />
            <Link
              href="/login"
              className={cn(linkButtonStyles, "hidden h-9 px-4 text-sm sm:inline-flex", "border border-border bg-transparent text-foreground hover:border-primary-500 hover:text-ink-violet dark:hover:text-primary-300")}
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              className={cn(linkButtonStyles, "hidden h-9 px-4 text-sm sm:inline-flex", "bg-secondary-500 text-cream-paper hover:bg-secondary-400")}
            >
              {t("getStarted")}
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={isMenuOpen}
              className="inline-flex size-9 items-center justify-center rounded-none border border-border text-foreground/70 transition-colors hover:border-primary-500 hover:text-ink-violet lg:hidden"
            >
              {isMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-border/60 bg-background/95 backdrop-blur-md lg:hidden">
            <nav className="mx-auto max-w-6xl space-y-1 px-6 py-4" aria-label={t("ariaLabel")}>
            {links.map((link) => (
                <Link
                  key={link.id}
                  href={resolveHref(link.href)}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-surface-muted hover:text-ink-violet"
                >
                  {link.label}
                </Link>
              ))}

              {canInstall && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    installModalRef.current?.open();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-ink-violet transition-colors hover:bg-surface-muted dark:text-primary-300"
                >
                  <Download className="size-4 shrink-0" aria-hidden="true" />
                  {tPwa("installTitle")}
                </button>
              )}

              <div className="flex gap-3 pt-3">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(linkButtonStyles, "flex-1 h-11 px-4 text-sm", "border border-border bg-transparent text-foreground hover:border-primary-500 hover:text-ink-violet")}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(linkButtonStyles, "flex-1 h-11 px-4 text-sm", "bg-secondary-500 text-cream-paper hover:bg-secondary-400")}
                >
                  {t("getStarted")}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <PWAInstallModal ref={installModalRef} />
    </>
  );
}
