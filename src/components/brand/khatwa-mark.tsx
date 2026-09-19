import { cn } from "@/lib/utils/cn";

/**
 * Khatwa brand mark — three ascending steps toward a goal, the literal
 * meaning of «خطوة» (step) rendered as geometry rather than illustrated.
 *
 * Built to the standard a mark has to clear to work as a brand system, not
 * just a picture: exactly two flat colors (no gradients, no glow, no
 * opacity ramps — those don't survive being shrunk to a 16px favicon), a
 * silhouette that still reads at that size, and a shape distinct enough to
 * recognize without the wordmark next to it. `currentColor` keeps the
 * steps adaptive to light/dark surfaces; the goal stays fixed brand yellow
 * in both, the way an accent color in a real identity system doesn't shift
 * with the page theme. In Arabic/RTL the mark mirrors (`.khatwa-mark` in
 * globals.css) so the ascent reads right-to-left, matching the reading
 * direction of the brand's native script — a real reason to mirror, unlike
 * a decorative shape with no inherent direction.
 */
export function KhatwaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("khatwa-mark size-8", className)}
    >
      <rect x="3" y="19" width="6" height="8" fill="currentColor" />
      <rect x="12" y="13" width="6" height="14" fill="currentColor" />
      <rect x="21" y="7" width="6" height="20" fill="currentColor" />
      <circle cx="27" cy="5" r="3.5" className="fill-butter-yellow" />
    </svg>
  );
}

/**
 * Full lockup: mark + Arabic wordmark, the form used in the navbar/footer.
 * The wordmark is real text (Rubik, the site's own typeface) rather than
 * hand-traced letterforms — Arabic is a connected script, and a freehand
 * path is not a safe way to author it. The tagline is optional so the mark
 * can sit alone at small sizes.
 */
export function KhatwaLogo({
  tagline,
  className,
  markClassName,
}: {
  tagline?: string;
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ink-violet dark:text-cream-paper", className)}>
      <KhatwaMark className={cn("size-9", markClassName)} />
      <span className="flex flex-col leading-none">
        <span className="text-2xl font-bold tracking-tight">خطوة</span>
        {tagline && (
          <span className="mt-1 text-[11px] font-medium tracking-wide opacity-70">
            {tagline}
          </span>
        )}
      </span>
    </span>
  );
}
