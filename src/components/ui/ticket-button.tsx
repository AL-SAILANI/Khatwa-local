import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { chamferClipPath } from "@/lib/utils/chamfer";

// Cut-corner size (px). Common "ticket stub" geometry, not a distinctive
// creative work — used across UI/print design for decades.
const CHAMFER = 14;
const BORDER = 2;
const SHADOW = 5;

// Shared by the border layer, the shadow layer, and the fill layer. The
// fill layer is inset by BORDER px on every side (via padding on the
// parent) and reuses the same pixel chamfer rather than a geometrically
// exact inset — at a 2px border the resulting ~0.8px difference in the
// diagonal's apparent thickness is not visible.
const CLIP = chamferClipPath(CHAMFER);

interface TicketButtonProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  "aria-label"?: string;
}

/**
 * The site's signature button for the handful of moments that most need to
 * feel like an action: a rectangle with two corners cut diagonally and a
 * hand-drawn hard-offset shadow, so pressing it reads as physically
 * plausible — a sticker lifted off the page, not a flat rectangle.
 *
 * Deliberately not the button used everywhere: dense UI (forms, the admin
 * panel, the exam runner) needs calm rectangular buttons, and the shape is
 * reserved for primary landing-page conversions per Khatwa's design system.
 *
 * `clip-path` cuts the corners; a border is faked by layering a slightly
 * larger ink-violet shape behind an inset butter-yellow one (a real
 * `border` can't follow a clip-path's diagonal edges). The shadow is a third
 * layer, offset and hidden on `:active` so the button visibly presses flat.
 */
export function TicketButton({
  children,
  className,
  innerClassName,
  href,
  type = "button",
  onClick,
  "aria-label": ariaLabel,
}: TicketButtonProps) {
  const sharedClassName = cn(
    "group relative inline-flex isolate",
    "bg-secondary-600 dark:bg-primary-300",
    "transition-transform duration-150 ease-out",
    "active:translate-x-[5px] active:translate-y-[5px]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    className,
  );
  const style = { clipPath: CLIP, padding: BORDER } as const;

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-shadow-black transition-opacity duration-150 group-active:opacity-0"
        style={{ clipPath: CLIP, transform: `translate(${SHADOW}px, ${SHADOW}px)` }}
      />
      <span
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap px-8 py-3.5 text-base font-semibold text-secondary-600",
          "bg-primary-400 transition-colors duration-150 group-hover:bg-primary-500",
          innerClassName,
        )}
        style={{ clipPath: CLIP }}
      >
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className={sharedClassName} style={style}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={sharedClassName} style={style}>
      {inner}
    </button>
  );
}
