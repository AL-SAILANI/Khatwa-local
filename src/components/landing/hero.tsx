"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Sparkles, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { HeroIllustration } from "@/components/landing/illustrations/hero-illustration";
import { DotGrid } from "@/components/landing/illustrations/dot-grid";
import { TicketButton } from "@/components/ui/ticket-button";
import { cn } from "@/lib/utils/cn";

const buttonStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-semibold transition-all duration-200 focus-visible:outline-none";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-24 sm:pt-28 sm:pb-32">
      {/* Quiet corner texture, desktop only — mirrors Syllabus's dot-field
          accent without competing with the text column. Pointer events are
          left enabled here (unlike the rest of the section) so the dots can
          react to the cursor; both corners sit clear of the buttons and
          illustration, confirmed visually in both LTR and RTL. */}
      <DotGrid className="absolute -top-4 start-8 hidden h-20 w-64 opacity-70 lg:block" />
      <DotGrid className="absolute bottom-10 end-8 hidden h-20 w-64 opacity-70 lg:block" />

      <Container className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-none border border-secondary-600 bg-primary-400 px-4 py-1.5 text-sm font-semibold text-secondary-600"
          >
            <Sparkles className="size-4 text-ink-violet dark:text-primary-400" />
            {t("eyebrow")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl leading-[1.2] sm:leading-[1.15]"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted text-balance sm:text-xl"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <TicketButton href="/register" className="w-full sm:w-auto">
              {t("ctaPrimary")}
            </TicketButton>
            <Link
              href="#features"
              className={cn(
                buttonStyles,
                "h-13 w-full px-8 text-base sm:w-auto",
                // `foreground` is ink violet on the cream canvas and cream in dark
                // mode, so the outline stays legible either way.
                "border border-foreground bg-transparent text-foreground hover:bg-primary-100 dark:hover:bg-foreground/10",
              )}
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-col items-center gap-2 lg:items-start"
          >
            <span className="flex items-center gap-1" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-ink-violet text-ink-violet dark:fill-primary-300 dark:text-primary-300" />
              ))}
            </span>
            <p className="text-sm font-semibold text-foreground/80 sm:text-base">{t("rating")}</p>
            <p className="text-xs text-muted sm:text-sm">{t("trustedBy")}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block"
        >
          <HeroIllustration className="mx-auto w-full max-w-lg" />
        </motion.div>
      </Container>
    </section>
  );
}
