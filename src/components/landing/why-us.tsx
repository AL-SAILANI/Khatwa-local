"use client";

import { useTranslations } from "next-intl";
import { BadgeCheck, LineChart, Feather } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const ITEMS = [
  { key: "arabic", icon: BadgeCheck, tile: "bg-secondary-500 text-cream-paper" },
  { key: "data", icon: LineChart, tile: "bg-primary-600 text-ink-violet" },
  { key: "design", icon: Feather, tile: "bg-error text-white" },
] as const;

export function WhyUs() {
  const t = useTranslations("whyUs");

  return (
    <Section id="why-us" data-anchor className="bg-surface-muted">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-10 sm:grid-cols-3">
          {ITEMS.map(({ key, icon: Icon, tile }) => (
            <RevealItem key={key} className="text-center">
              <div className={`mx-auto inline-flex size-14 items-center justify-center rounded-2xl ${tile}`}>
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{t(`items.${key}.title`)}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted">
                {t(`items.${key}.description`)}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
