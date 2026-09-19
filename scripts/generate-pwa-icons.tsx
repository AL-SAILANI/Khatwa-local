/**
 * One-off regeneration of the static PWA icon files manifest.ts points at
 * (icon-192.png, icon-512.png, apple-touch-icon.png). These can't use the
 * icon.tsx/apple-icon.tsx file convention like the favicon and iOS
 * home-screen icon do — the Web App Manifest spec requires real static
 * image files at declared sizes, not a route. Reuses next/og's
 * ImageResponse (the same renderer behind icon.tsx) so the shape is
 * defined once and just re-scaled per size, rather than hand-tracing it
 * again in an image editor.
 *
 * Run with: npx tsx scripts/generate-pwa-icons.mts
 */
import { writeFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

const INK_VIOLET = "#0d0129";
const BUTTER_YELLOW = "#fae59b";
const CREAM_PAPER = "#fffcf7";

function markJsx(size: number) {
  // Same three-step proportions as icon.tsx/apple-icon.tsx, scaled from a
  // 32-unit design so every exported size is the same mark, not a redraw.
  const scale = size / 32;
  const u = (n: number) => Math.round(n * scale);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: u(2),
        background: CREAM_PAPER,
        padding: `${u(4)}px ${u(3)}px ${u(3)}px`,
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: u(6), height: u(8), background: INK_VIOLET }} />
      <div style={{ width: u(6), height: u(14), background: INK_VIOLET }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: u(7), height: u(7), borderRadius: "50%", background: BUTTER_YELLOW, marginBottom: u(1) }} />
        <div style={{ width: u(6), height: u(20), background: INK_VIOLET }} />
      </div>
    </div>
  );
}

async function render(size: number, outPath: string) {
  const response = new ImageResponse(markJsx(size), { width: size, height: size });
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outPath, buffer);
  console.log(`wrote ${outPath} (${buffer.byteLength} bytes)`);
}

async function main() {
  await render(192, "public/icons/icon-192.png");
  await render(512, "public/icons/icon-512.png");
  await render(180, "public/icons/apple-touch-icon.png");
}

main();
