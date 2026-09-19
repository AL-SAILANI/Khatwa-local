import { ImageResponse } from "next/og";

// Next's file-convention favicon: the same three-step mark as the in-app
// logo, rasterized once at build time. `ImageResponse` (satori) only
// understands literal style values, not Tailwind classes or CSS custom
// properties, so the brand hexes are repeated here rather than imported.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const INK_VIOLET = "#0d0129";
const BUTTER_YELLOW = "#fae59b";
const CREAM_PAPER = "#fffcf7";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 2,
          background: CREAM_PAPER,
          padding: "4px 3px 3px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: 6, height: 8, background: INK_VIOLET }} />
        <div style={{ width: 6, height: 14, background: INK_VIOLET }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: BUTTER_YELLOW, marginBottom: 1 }} />
          <div style={{ width: 6, height: 20, background: INK_VIOLET }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
