import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#1e3a5f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 92,
        }}
      >
        <span
          style={{
            fontSize: 320,
            fontFamily: "serif",
            color: "#f8f4e8",
            lineHeight: 1,
          }}
        >
          Ω
        </span>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
