import { useTranslations } from "next-intl";
import { Award, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModuleHeader } from "@/components/ui/module-header";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

interface AchievementPreview {
  title: string;
  unlocked: boolean;
}

export function AchievementsPreview({ achievements }: { achievements: AchievementPreview[] }) {
  const t = useTranslations("dashboard");

  return (
    <Card>
      <ModuleHeader
        icon={Award}
        title={t("achievementsTitle")}
        action={
          <Link href="/achievements" className="text-xs font-medium text-ink-violet dark:text-primary-400">
            {t("viewAll")}
          </Link>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {achievements.map((achievement) => (
          <div key={achievement.title} className="flex flex-col items-center gap-2 text-center">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-2xl",
                achievement.unlocked
                  ? "bg-butter-yellow text-ink-violet"
                  : "bg-surface-muted text-muted",
              )}
            >
              {achievement.unlocked ? <Award className="size-5" /> : <Lock className="size-4" />}
            </div>
            <span className="text-xs leading-tight text-muted">{achievement.title}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
