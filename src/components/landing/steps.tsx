"use client";

import { useTranslations } from "next-intl";
import { UserPlus, Compass, Rocket } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const STEPS = [
  { icon: UserPlus, tile: "bg-secondary-500 text-cream-paper" },
  { icon: Compass, tile: "bg-primary-600 text-ink-violet" },
  { icon: Rocket, tile: "bg-error text-white" },
] as const;

interface StepItem {
  title: string;
  description: string;
}

export function Steps() {
  const t = useTranslations("steps");
  const items = t.raw("items") as StepItem[];

  return (
    <Section id="steps" data-anchor>
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>
        </Reveal>

        <RevealGroup className="relative mt-16 grid gap-10 sm:grid-cols-3">
          {items.map((item, index) => {
            const { icon: Icon, tile } = STEPS[index]!;
            return (
              <RevealItem key={item.title} className="relative text-center">
                <div className="mx-auto flex w-fit flex-col items-center">
                  <div className={`relative flex size-16 items-center justify-center rounded-2xl ${tile}`}>
                    <Icon className="size-7" aria-hidden="true" />
                    <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-background bg-foreground text-xs font-bold text-background">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-base leading-relaxed text-muted">
                  {item.description}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </Section>
  );
}
