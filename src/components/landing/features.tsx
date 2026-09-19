"use client";

import { useTranslations } from "next-intl";
import {
  Gauge,
  Route,
  ClipboardCheck,
  LineChart,
  BookMarked,
  Flame,
  BadgeCheck,
} from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const TILE_COLORS = [
  "bg-primary-100/80 text-ink-violet dark:bg-primary-950/50 dark:text-primary-200 border border-primary-200/50 dark:border-primary-800/40",
  "bg-secondary-100/80 text-ink-violet dark:bg-secondary-950/50 dark:text-secondary-200 border border-secondary-200/50 dark:border-secondary-800/40",
  "bg-amber-100/80 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200 border border-amber-200/50 dark:border-amber-800/40",
] as const;

const FEATURES = [
  { key: "placementTest", icon: Gauge },
  { key: "smartPlan", icon: Route },
  { key: "mockExams", icon: ClipboardCheck },
  { key: "analytics", icon: LineChart },
  { key: "vocabulary", icon: BookMarked },
  { key: "gamification", icon: Flame },
] as const;

export function Features() {
  const t = useTranslations("features");

  return (
    <Section id="features" data-anchor>
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-none border border-primary-200/80 bg-primary-100/70 px-3.5 py-1 text-xs font-semibold text-ink-violet dark:border-primary-800/60 dark:bg-primary-950/60 dark:text-primary-200">
            <BadgeCheck className="size-4" aria-hidden="true" />
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon }, index) => (
            <RevealItem key={key} className="h-full">
              <Card
                id={key === "mockExams" ? "mock-exams" : undefined}
                className="hover-top-shadow h-full scroll-mt-28"
              >
                <div
                  className={`inline-flex size-11 items-center justify-center rounded-xl ${TILE_COLORS[index % TILE_COLORS.length]}`}
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{t(`items.${key}.title`)}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  {t(`items.${key}.description`)}
                </p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
