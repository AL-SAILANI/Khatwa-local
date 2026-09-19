"use client";

import { useTranslations } from "next-intl";
import { Container, Section } from "@/components/ui/container";

export function InfoPage({
  namespace,
  extra = [],
}: {
  namespace: string;
  extra?: string[];
}) {
  const t = useTranslations(namespace);

  const bodyKeys = ["body", "body2", "body3"];

  return (
    <Section>
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
        <div className="mt-6 space-y-4 text-muted">
          {bodyKeys.map((key) => {
            const text = t.has(key) ? t(key) : "";
            return text ? <p key={key}>{text}</p> : null;
          })}
          {extra.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      </Container>
    </Section>
  );
}
