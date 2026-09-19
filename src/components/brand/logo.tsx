import { KhatwaLogo } from "@/components/brand/khatwa-mark";

/**
 * Khatwa's logo lockup, used across the navbar, footer, sidebar, and auth
 * shells. A thin wrapper around `KhatwaLogo` so every call site imports one
 * name; the vector mark + real-text wordmark mean there's no separate
 * light/dark asset pair to keep in sync — `currentColor` and the shared
 * `text-ink-violet dark:text-cream-paper` do that for free.
 */
export function Logo({ className }: { className?: string }) {
  return <KhatwaLogo className={className} />;
}
