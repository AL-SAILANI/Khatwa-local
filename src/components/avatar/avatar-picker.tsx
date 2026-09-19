"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { FEMALE_AVATARS, MALE_AVATARS } from "@/data/avatars";
import { cn } from "@/lib/utils/cn";
import type { Gender } from "@/types/user";

interface AvatarPickerProps {
  value: string | null;
  onChange: (id: string) => void;
  /** Filters the shown avatars to the user's gender. `null` shows both. */
  gender?: Gender | null;
}

export function AvatarPicker({ value, onChange, gender }: AvatarPickerProps) {
  const t = useTranslations("avatars.styles");

  const sections =
    gender === "female"
      ? [{ id: "female", label: t("female"), options: FEMALE_AVATARS }]
      : gender === "male"
        ? [{ id: "male", label: t("male"), options: MALE_AVATARS }]
        : [
            { id: "female", label: t("female"), options: FEMALE_AVATARS },
            { id: "male", label: t("male"), options: MALE_AVATARS },
          ];

  return (
    <div className="max-h-80 space-y-4 overflow-y-auto p-1">
      {sections.map((section) => (
        <section key={section.id}>
          <h4 className="mb-1.5 px-1 text-xs font-semibold text-muted">{section.label}</h4>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
            {section.options.map((option) => {
              const selected = value === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onChange(option.id)}
                  aria-pressed={selected}
                  aria-label={option.name}
                  className={cn(
                    "grid aspect-square place-items-center overflow-hidden rounded-full transition-all",
                    selected
                      ? "ring-2 ring-primary-400 ring-offset-2 ring-offset-background"
                      : "hover:scale-105 hover:ring-2 hover:ring-primary-300",
                  )}
                >
                  <Image
                    src={option.src}
                    alt={option.name}
                    width={128}
                    height={128}
                    className="size-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}