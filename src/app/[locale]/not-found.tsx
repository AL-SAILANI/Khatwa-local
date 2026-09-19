import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { SearchX } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md text-center p-8">
        <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-primary-500/10 text-ink-violet">
          <SearchX className="size-7" />
        </div>
        <p className="mt-5 text-5xl font-bold text-ink-violet dark:text-primary-300">404</p>
        <h1 className="mt-2 text-xl font-semibold">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted">{t("description")}</p>
        <Button asChild variant="primary" size="lg" className="mt-6">
          <Link href="/">{t("goHome")}</Link>
        </Button>
      </Card>
    </div>
  );
}
