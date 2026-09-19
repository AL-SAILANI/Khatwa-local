/**
 * The site's signature cut-corner shape as a `clip-path` polygon: the
 * top-left and bottom-right corners cut diagonally by `size` px, the other
 * two left square. Used at button scale (`TicketButton`) and at panel scale
 * (large section blocks) — same formula, different `size`, so both stay
 * visually consistent with each other.
 */
export function chamferClipPath(size: number) {
  return `polygon(${size}px 0,100% 0,100% calc(100% - ${size}px),calc(100% - ${size}px) 100%,0 100%,0 ${size}px)`;
}
