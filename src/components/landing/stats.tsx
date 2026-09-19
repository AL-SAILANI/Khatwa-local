"use client";

import { useTranslations } from "next-intl";
import { Users, BookOpenCheck, TrendingUp, Heart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

const STATS = [
  { value: "12,000+", key: "students", icon: Users },
  { value: "25,000+", key: "questions", icon: BookOpenCheck },
  { value: "+18", key: "avgImprovement", icon: TrendingUp },
  { value: "96%", key: "satisfaction", icon: Heart },
] as const;

export function Stats() {
  const t = useTranslations("stats");

  return (
    <section className="relative z-10 bg-surface-muted">
      <Container className="pb-16 pt-16">
        <RevealGroup className="relative z-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {STATS.map((stat) => (
            <RevealItem key={stat.key} className="h-full">
              <div className="hover-top-shadow h-full bg-deep-teal p-5 text-center sm:p-6">
                <div className="mx-auto inline-flex size-11 items-center justify-center bg-butter-yellow text-ink-violet sm:size-12">
                  <stat.icon className="size-5" aria-hidden="true" />
                </div>
                <div className="mt-3 text-2xl font-bold text-cream-paper sm:mt-4 sm:text-4xl">{stat.value}</div>
                <div className="mt-1.5 text-sm text-cream-paper/75 sm:mt-2 sm:text-base">{t(stat.key)}</div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
