"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Users, FileText, BookOpen, FileQuestion } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getAdminStats, type AdminStats } from "@/lib/firestore/admin-stats";

export function AdminOverview() {
  const t = useTranslations("admin.overview");
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  return (
    <Container className="max-w-6xl py-8">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-1 text-sm text-muted">{t("description")}</p>

      {stats === null ? (
        <div className="flex justify-center py-12" role="status" aria-label={t("loading")}>
          <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center gap-4">
            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
              <Users className="size-5" />
            </div>
            <div>
              <div className="text-xl font-bold">{stats.totalUsers}</div>
              <div className="text-xs text-muted">{t("users")}</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
              <FileText className="size-5" />
            </div>
            <div>
              <div className="text-xl font-bold">{stats.totalExamAttempts}</div>
              <div className="text-xs text-muted">{t("examAttempts")}</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
              <BookOpen className="size-5" />
            </div>
            <div>
              <div className="text-xl font-bold">{stats.totalCourses}</div>
              <div className="text-xs text-muted">{t("courses")}</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
              <FileQuestion className="size-5" />
            </div>
            <div>
              <div className="text-xl font-bold">{stats.totalQuestions}</div>
              <div className="text-xs text-muted">{t("questions")}</div>
            </div>
          </Card>
        </div>
      )}
    </Container>
  );
}
