import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, localeDirection, type Locale } from "@/i18n/routing";
import { ThemeProvider, themeInitScript } from "@/components/theme/theme-provider";
import { PwaRegister } from "@/components/pwa/pwa-register";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { PageErrorBoundary } from "@/components/ui/error-boundary";
import { ScrollProgress, BackToTop, WhatsAppFloat } from "@/components/ui/scroll-effects";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: tMeta("titleDefault"),
      template: "%s | خطوة",
    },
    description: t("subtitle"),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    manifest: "/manifest.json",
    // No manual `icons` entry: `icon.tsx` and `apple-icon.tsx` (file
    // conventions, colocated in `src/app/`) generate and wire up the
    // favicon and home-screen icon automatically. An explicit override
    // here would fight the convention and win, undoing it.
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "خطوة",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0d0129",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const direction = localeDirection[locale as Locale];

  return (
    <html
      lang={locale}
      dir={direction}
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Raw, render-blocking <script> rather than next/script: this must
            run before the first paint so the stored theme is applied without
            a flash. `next/script` defaults to afterInteractive, which runs
            after hydration — it never reached the served HTML at all, so the
            page painted unthemed first. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <NextIntlClientProvider>
          <ThemeProvider>
            <ScrollProgress />
            <BackToTop />
            <WhatsAppFloat />
            <PageErrorBoundary>{children}</PageErrorBoundary>
            <PwaRegister />
            <InstallPrompt />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
