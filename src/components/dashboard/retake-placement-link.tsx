import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

export function RetakePlacementLink() {
  const t = useTranslations("dashboard.retakePlacement");

  return (
    <Card className="flex items-center justify-between gap-3 py-4">
      <div>
        <p className="text-sm font-semibold">{t("title")}</p>
        <p className="mt-0.5 text-xs text-muted">{t("hint")}</p>
      </div>
      <Link
        href="/placement-test"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-none border border-border px-3 py-2 text-sm font-semibold text-ink-violet transition-colors hover:border-primary-500 hover:bg-primary-50/50 dark:text-primary-300 dark:hover:bg-primary-950/30"
      >
        <RotateCcw className="size-4" />
        {t("button")}
      </Link>
    </Card>
  );
}
