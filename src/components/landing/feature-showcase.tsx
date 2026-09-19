"use client";

import { useTranslations } from "next-intl";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { StudyPlanIllustration } from "@/components/landing/illustrations/study-plan-illustration";
import { VocabularyIllustration } from "@/components/landing/illustrations/vocabulary-illustration";

/**
 * Two "go deeper" panels below the feature grid — Khatwa's own study-plan
 * and spaced-repetition engines, each paired with an original illustration.
 *
 * Each row is a two-column CSS grid, so `dir="rtl"` mirrors it on its own —
 * the same trick the hero uses. The alternating zigzag therefore comes from
 * swapping which element is FIRST in the JSX per row (illustration, then
 * text; then text, then illustration) rather than a `lg:order-*` override —
 * `order` is a sort key, not a physical side, so it does not flip with
 * `dir` the way DOM order does, and would have de-synced row two from
 * row one under RTL.
 */
export function FeatureShowcase() {
  const t = useTranslations("showcase");

  return (
    <Section className="bg-surface-muted">
      <Container className="space-y-20 sm:space-y-28">
        <Reveal className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <StudyPlanIllustration className="mx-auto w-full max-w-md" />
          <div>
            <span className="text-sm font-bold text-ink-violet dark:text-primary-300">{t("studyPlan.eyebrow")}</span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("studyPlan.title")}</h3>
            <p className="mt-4 text-lg leading-relaxed text-muted">{t("studyPlan.description")}</p>
          </div>
        </Reveal>

        <Reveal className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-sm font-bold text-ink-violet dark:text-primary-300">{t("vocabulary.eyebrow")}</span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("vocabulary.title")}</h3>
            <p className="mt-4 text-lg leading-relaxed text-muted">{t("vocabulary.description")}</p>
          </div>
          <VocabularyIllustration className="mx-auto w-full max-w-md" />
        </Reveal>
      </Container>
    </Section>
  );
}
