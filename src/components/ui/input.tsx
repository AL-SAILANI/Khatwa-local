import { cn } from "@/lib/utils/cn";

export const Input = ({
  className,
  type = "text",
  error,
  icon,
  "aria-describedby": ariaDescribedByProp,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  icon?: React.ReactNode;
}) => {
  const hasError = error || props["aria-invalid"] === "true";
  const errorId = hasError ? `${props.id}-error` : undefined;
  const hintId = !hasError && ariaDescribedByProp ? ariaDescribedByProp : undefined;

  return (
    <div className="relative w-full">
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted" aria-hidden="true">
          {icon}
        </div>
      )}
      <input
        className={cn(
          "w-full rounded-xl border bg-surface px-4 text-sm text-foreground placeholder:text-muted",
          "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted",
          hasError
            ? "border-error focus-visible:ring-error h-11 pl-11"
            : "border-border hover:border-primary-300 dark:hover:border-primary-700 h-11",
          icon && !hasError ? "pl-11" : "",
          className,
        )}
        type={type}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : hintId}
        {...props}
      />
    </div>
  );
};

export const Textarea = ({
  className,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
}) => {
  const hasError = error || props["aria-invalid"] === "true";

  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted",
        "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted",
        hasError
          ? "border-error focus-visible:ring-error"
          : "hover:border-primary-300 dark:hover:border-primary-700",
        className,
      )}
      aria-invalid={hasError}
      {...props}
    />
  );
};

export const Label = ({
  className,
  required,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
}) => (
  <label className={cn("mb-1.5 block text-sm font-medium text-foreground", className)} {...props}>
    {children}
    {required && <span className="ml-1 text-error" aria-hidden="true">*</span>}
  </label>
);

export function FieldError({ children, id }: { children?: string; id?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1 text-xs text-error" role="alert" aria-live="polite">
      <svg className="size-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {children}
    </p>
  );
}

export function FieldHint({ children, id }: { children?: string; id?: string }) {
  if (!children) return null;
  return <p id={id} className="mt-1.5 text-xs text-muted">{children}</p>;
}
