"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export function SocialProof() {
  const t = useTranslations("socialProof");
  const partners = t.raw("partners") as string[];

  return (
    <section className="border-b border-border bg-surface-muted">
      <Container className="py-14">
        <Reveal className="text-center">
          <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">{t("eyebrow")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl font-bold text-foreground sm:text-2xl">
            {t("partnersLabel")}
          </p>
        </Reveal>

        <RevealGroup className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {partners.map((partner) => (
            <RevealItem key={partner}>
              <span className="inline-flex max-w-full items-center rounded-none border border-border bg-surface px-3.5 py-2 text-center text-sm font-medium text-foreground/70 sm:px-4 sm:text-base">
                {partner}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
