import { useLocale, useTranslations } from "next-intl";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getWeekdayLabels } from "@/lib/format";
import { cn } from "@/lib/utils/cn";

export function StreakCard({ streak, activeDays }: { streak: number; activeDays: boolean[] }) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const weekdays = getWeekdayLabels(locale);

  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="inline-flex size-11 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
          <Flame className="size-5 fill-current" />
        </div>
        <div>
          <div className="text-xl font-bold">{t("streakDays", { count: streak })}</div>
          <div className="text-xs text-muted">{t("keepGoing")}</div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2 text-center">
        {weekdays.map((day, index) => (
          <div key={day} className="text-xs text-muted">
            {day}
            <div
              className={cn(
                "mx-auto mt-1.5 flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                activeDays[index]
                  ? "bg-ink-violet text-ink-violet dark:text-primary-300"
                  : "bg-surface-muted text-muted/60",
              )}
            >
              {activeDays[index] ? "✓" : ""}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
