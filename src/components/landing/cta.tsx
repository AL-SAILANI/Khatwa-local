"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Send } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { TicketButton } from "@/components/ui/ticket-button";
import { chamferClipPath } from "@/lib/utils/chamfer";

export function CTA() {
  const t = useTranslations("cta");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Section>
      <Container>
        <Reveal>
          {/* The chamfered-corner motif scaled up from the buttons to a whole
              panel, both corners cut (top-left and bottom-right) — matching
              how the reference cuts its own large section blocks the same
              way it cuts its buttons, not just one corner. */}
          <div
            className="relative overflow-hidden bg-deep-teal px-6 py-14 sm:px-8 sm:py-16"
            style={{ clipPath: chamferClipPath(48) }}
          >
            <div className="relative mx-auto max-w-xl text-center">
              <span className="inline-flex items-center gap-2 text-base font-bold text-butter-yellow">
                <Mail className="size-5" />
                {t("eyebrow")}
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-cream-paper sm:text-4xl">{t("title")}</h2>
              <p className="mt-4 text-lg text-cream-paper/70">{t("subtitle")}</p>

              <form
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubmitted(true);
                }}
              >
                <label className="relative w-full">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("placeholder")}
                    aria-label={t("placeholder")}
                    className="h-13 w-full rounded-none border border-cream-paper/30 bg-cream-paper/10 ps-11 pe-4 text-base text-cream-paper placeholder:text-cream-paper/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-butter-yellow"
                  />
                  <Mail className="absolute top-1/2 start-4 size-5 -translate-y-1/2 text-white/50" />
                </label>
                <TicketButton type="submit" className="shrink-0">
                  {t("button")}
                  <Send className="size-4 rtl:-scale-x-100" />
                </TicketButton>
              </form>

              {submitted && (
                <p className="mt-4 text-base font-semibold text-secondary-300" role="status">
                  {t("success")}
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
