"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  showLabel: string;
  hideLabel: string;
}

export function PasswordInput({
  className,
  error,
  showLabel,
  hideLabel,
  "aria-describedby": ariaDescribedByProp,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const hasError = error || props["aria-invalid"] === "true";
  const errorId = hasError && props.id ? `${props.id}-error` : undefined;
  const hintId = !hasError && ariaDescribedByProp ? ariaDescribedByProp : undefined;

  return (
    <div className="relative w-full">
      <input
        className={cn(
          "w-full rounded-xl border bg-surface px-4 text-sm text-foreground placeholder:text-muted",
          "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted",
          "pr-12",
          hasError
            ? "border-error focus-visible:ring-error h-11"
            : "border-border hover:border-primary-300 dark:hover:border-primary-700 h-11",
          className,
        )}
        type={visible ? "text" : "password"}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : hintId}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
        className="absolute inset-y-0 end-0 flex items-center pe-4 text-muted transition-colors hover:text-foreground focus-visible:outline-none"
      >
        {visible ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
      </button>
    </div>
  );
}
