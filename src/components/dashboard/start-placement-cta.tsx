import { useTranslations } from "next-intl";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

const buttonStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-semibold transition-all duration-200 focus-visible:outline-none";

export function StartPlacementCta() {
  const t = useTranslations("dashboard.startPlacementCta");

  return (
    <Card className="flex flex-col items-center gap-4 border-primary-200 bg-primary-50/50 py-10 text-center dark:border-primary-500/20 dark:bg-primary-500/5">
      <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary-500 text-ink-violet">
        <ClipboardCheck className="size-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{t("title")}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted">{t("description")}</p>
      </div>
      <Link
        href="/placement-test"
        className={cn(
          buttonStyles,
          "h-13 px-8 text-base",
          // `hover:from-/to-` had no `bg-gradient-to-*` left to activate them,
          // so this button had no hover state at all.
          "border border-secondary-600 bg-butter-yellow text-ink-violet shadow-hard hover:bg-primary-500",
        )}
      >
        {t("button")}
        <ArrowLeft className="size-4 rtl:rotate-180" />
      </Link>
    </Card>
  );
}
