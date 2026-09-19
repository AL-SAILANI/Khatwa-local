"use client";

import { useTranslations } from "next-intl";
import { Star, TrendingUp } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

interface TestimonialItem {
  name: string;
  role?: string;
  score?: string;
  avatarEmoji?: string;
  quote: string;
}

export function Testimonials() {
  const t = useTranslations("testimonials");
  const testimonials = t.raw("items") as TestimonialItem[];

  return (
    <Section id="testimonials" data-anchor>
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <RevealItem key={item.name}>
              <Card className="hover-top-shadow flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-ink-violet dark:text-primary-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  {item.score && (
                    <span className="inline-flex items-center gap-1 rounded-none bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
                      <TrendingUp className="size-3.5" />
                      {item.score}
                    </span>
                  )}
                </div>
                <p className="mt-4 flex-1 text-base leading-relaxed text-foreground/90">
                  “{item.quote}”
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <Avatar emoji={item.avatarEmoji} name={item.name} className="size-11 text-xl" />
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold">{item.name}</div>
                    {item.role && <div className="truncate text-xs text-muted">{item.role}</div>}
                  </div>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}