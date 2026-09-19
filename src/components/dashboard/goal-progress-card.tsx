import { useTranslations } from "next-intl";
import { Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModuleHeader } from "@/components/ui/module-header";

export function GoalProgressCard({
  currentScore,
  goal,
}: {
  currentScore: number;
  goal: number;
}) {
  const t = useTranslations("dashboard");
  const percent = Math.min(100, Math.round((currentScore / goal) * 100));

  return (
    <Card>
      <ModuleHeader
        icon={Target}
        title={t("pathTo", { goal: goal === 95 ? "95+" : goal })}
        action={
          <span className="inline-flex items-center rounded-none bg-secondary-100 px-3 py-1 text-sm font-bold text-ink-violet dark:bg-secondary-500/15 dark:text-secondary-200">
            {percent}%
          </span>
        }
      />

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-none bg-surface-muted">
        <div
          className="h-full rounded-none bg-ink-violet transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-muted">
        {t("currentScoreNote", { current: currentScore, goal })}
      </p>
    </Card>
  );
}
