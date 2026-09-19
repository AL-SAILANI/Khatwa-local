import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getLevelProgress } from "@/lib/gamification";

export function LevelCard({ xp, coins }: { xp: number; coins: number }) {
  const t = useTranslations("levelCard");
  const tLevelTitles = useTranslations("levelTitles");
  const level = getLevelProgress(xp);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-11 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
            <Sparkles className="size-5" />
          </div>
          <div>
            <div className="font-semibold">
              {t("levelLabel", { level: level.level, title: tLevelTitles(String(level.level)) })}
            </div>
            <div className="text-xs text-muted">{t("xpAndCoins", { xp, coins })}</div>
          </div>
        </div>
      </div>

      {level.xpForNextLevel !== null && (
        <>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-none bg-surface-muted">
            <div
              className="h-full rounded-none bg-ink-violet transition-all duration-700"
              style={{ width: `${level.percentToNextLevel}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {t("xpToNextLevel", { current: level.xpIntoLevel, total: level.xpForNextLevel })}
          </p>
        </>
      )}
    </Card>
  );
}
