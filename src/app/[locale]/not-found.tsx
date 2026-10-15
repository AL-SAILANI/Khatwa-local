import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { SceneArt } from "@/components/courses/lesson-art";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-xl text-center p-8">
        <SceneArt name="page_not_found" className="mx-auto h-44 w-full" />
        <p className="mt-2 text-5xl font-bold text-ink-violet dark:text-primary-300">404</p>
        <h1 className="mt-2 text-xl font-semibold">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted">{t("description")}</p>
        <Button asChild variant="primary" size="lg" className="mt-6">
          <Link href="/">{t("goHome")}</Link>
        </Button>
      </Card>
    </div>
  );
}
