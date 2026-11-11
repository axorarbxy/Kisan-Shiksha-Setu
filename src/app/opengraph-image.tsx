import { ImageResponse } from "next/og";
import { homeCopy } from "@/content/public-pages";

export const alt =
  `Kisan Shiksha Setu — ${homeCopy.hero.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0f2a1f",
          color: "#fbf8f2",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "80px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              color: "#a9cfb8",
              fontFamily: "Georgia",
              fontSize: 30,
            }}
          >
            {homeCopy.hero.eyebrow}
          </div>
          <div
            style={{
              fontFamily: "Georgia",
              fontSize: 76,
              lineHeight: 1.08,
              maxWidth: 760,
            }}
          >
            {homeCopy.hero.headline}
          </div>
          <div
            style={{
              color: "#d5e7dc",
              fontFamily: "Arial",
              fontSize: 26,
            }}
          >
            {homeCopy.hero.illustrationCaption}
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            border: "2px solid #78b091",
            borderRadius: "50%",
            color: "#a9cfb8",
            display: "flex",
            fontFamily: "Georgia",
            fontSize: 96,
            height: 176,
            justifyContent: "center",
            marginLeft: 36,
            width: 176,
          }}
        >
          K
        </div>
      </div>
    ),
    size,
  );
}
