"use client";

import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { LessonResource } from "@/types/course";

export function LessonResources({
  resources,
}: {
  resources: LessonResource[];
}) {
  const t = useTranslations("courses");

  return (
    <div className="space-y-4">
      {resources.map((resource, resourceIndex) => (
        <Card key={`${resource.url}-${resourceIndex}`} className="space-y-2">
          <p className="text-sm font-medium">{resource.title}</p>
          {resource.type === "video" && (
            <video controls className="w-full rounded-xl" src={resource.url} />
          )}
          {resource.type === "audio" && (
            <audio controls className="w-full" src={resource.url} />
          )}
          {resource.type === "youtube" && resource.youtubeId && (
            <div className="space-y-2">
              <iframe
                className="aspect-video w-full rounded-xl border-0"
                src={`https://www.youtube-nocookie.com/embed/${resource.youtubeId}?rel=0`}
                title={resource.title}
                loading="lazy"
                allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted underline"
              >
                <ExternalLink className="size-3.5" />
                {t("videoSource", { provider: resource.provider ?? "" })}
              </a>
            </div>
          )}
          {resource.type === "link" && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-violet underline dark:text-primary-400"
            >
              <ExternalLink className="size-4" />
              {t("extraVideoOn", { provider: resource.provider ?? "" })}
            </a>
          )}
          {resource.type === "pdf" && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium text-ink-violet underline dark:text-primary-400"
            >
              {t("openPdf")}
            </a>
          )}
        </Card>
      ))}
    </div>
  );
}
