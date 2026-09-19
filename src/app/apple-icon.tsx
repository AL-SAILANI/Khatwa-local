import { ImageResponse } from "next/og";

// iOS home-screen icon: same mark as icon.tsx, scaled to Apple's 180×180
// convention. iOS applies its own rounded-square mask on top, so this stays
// a plain square with generous padding — no corner rounding baked in here.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const INK_VIOLET = "#0d0129";
const BUTTER_YELLOW = "#fae59b";
const CREAM_PAPER = "#fffcf7";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 11,
          background: CREAM_PAPER,
          padding: "34px 20px 26px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: 32, height: 44, background: INK_VIOLET }} />
        <div style={{ width: 32, height: 76, background: INK_VIOLET }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: BUTTER_YELLOW, marginBottom: 6 }} />
          <div style={{ width: 32, height: 108, background: INK_VIOLET }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
