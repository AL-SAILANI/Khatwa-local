import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex items-center gap-3 p-4 sm:gap-4 sm:p-6">
      <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet sm:size-11">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-lg font-bold tabular-nums sm:text-xl">{value}</div>
        <div className="text-xs text-muted">{label}</div>
      </div>
    </Card>
  );
}
