"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { getAllQuestions, createQuestion } from "@/lib/firestore/questions";
import type { ExamSectionKey, Question } from "@/types/question";

const SECTIONS: ExamSectionKey[] = ["reading", "grammar", "listening", "writingAnalysis"];
const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const OPTION_IDS = ["a", "b", "c", "d"] as const;

const EMPTY_FORM = {
  section: "grammar" as ExamSectionKey,
  difficulty: "medium" as (typeof DIFFICULTIES)[number],
  prompt: "",
  options: ["", "", "", ""],
  correctOptionId: "a" as (typeof OPTION_IDS)[number],
  explanation: "",
  tags: "",
};

export function AdminQuestions() {
  const t = useTranslations("admin.questions");
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const refresh = () => getAllQuestions().then(setQuestions);

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async () => {
    setIsSaving(true);
    await createQuestion({
      section: form.section,
      prompt: form.prompt,
      options: OPTION_IDS.map((id, index) => ({ id, text: form.options[index] ?? "" })),
      correctOptionId: form.correctOptionId,
      explanation: form.explanation,
      difficulty: form.difficulty,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setForm(EMPTY_FORM);
    setIsSaving(false);
    refresh();
  };

  const isValid = form.prompt && form.options.every(Boolean) && form.explanation;

  return (
    <Container className="max-w-4xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("countLabel", { count: questions?.length ?? 0 })}</p>
      </div>

      <Card>
        <h2 className="font-semibold">{t("addQuestionTitle")}</h2>
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="qSection">{t("sectionLabel")}</Label>
              <select
                id="qSection"
                value={form.section}
                onChange={(e) => setForm((f) => ({ ...f, section: e.target.value as ExamSectionKey }))}
                className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm"
              >
                {SECTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="qDifficulty">{t("difficultyLabel")}</Label>
              <select
                id="qDifficulty"
                value={form.difficulty}
                onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value as typeof form.difficulty }))}
                className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="qPrompt">{t("promptLabel")}</Label>
            <textarea
              id="qPrompt"
              dir="ltr"
              rows={2}
              value={form.prompt}
              onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
              className="w-full rounded-xl border border-border bg-surface p-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>{t("optionsLabel")}</Label>
            <div role="radiogroup" aria-label={t("correctOptionLabel")} className="space-y-2">
              {OPTION_IDS.map((id, index) => (
                <div key={id} className="flex items-center gap-2">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={form.correctOptionId === id}
                    aria-label={t("correctOptionLabel")}
                    onClick={() => setForm((f) => ({ ...f, correctOptionId: id }))}
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                      form.correctOptionId === id
                        ? "border-primary-500 bg-primary-500 text-ink-violet"
                        : "border-border text-muted",
                    )}
                  >
                    {id.toUpperCase()}
                  </button>
                  <Input
                    dir="ltr"
                    aria-label={t("optionLabel", { option: id.toUpperCase() })}
                    value={form.options[index]}
                    onChange={(e) =>
                      setForm((f) => {
                        const options = [...f.options];
                        options[index] = e.target.value;
                        return { ...f, options };
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="qExplanation">{t("explanationLabel")}</Label>
            <textarea
              id="qExplanation"
              rows={2}
              value={form.explanation}
              onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))}
              className="w-full rounded-xl border border-border bg-surface p-3 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="qTags">{t("tagsLabel")}</Label>
            <Input
              id="qTags"
              dir="ltr"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            />
          </div>

          <Button onClick={handleCreate} disabled={!isValid || isSaving}>
            {isSaving ? t("saving") : t("addQuestion")}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">{t("currentQuestionsTitle")}</h2>
        {questions === null ? (
          <div className="mt-4 flex justify-center" role="status" aria-label={t("loading")}>
            <div className="size-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : (
          <div className="mt-4 max-h-96 divide-y divide-border overflow-y-auto">
            {questions.map((q) => (
              <div key={q.id} className="py-3 text-sm">
                <div className="flex justify-between text-xs text-muted">
                  <span>{q.section}</span>
                  <span>{q.difficulty}</span>
                </div>
                <p className="mt-1" dir="ltr">
                  {q.prompt}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
}
