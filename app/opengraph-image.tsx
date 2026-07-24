import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Walk Through Nepal — Authentic Himalayan Adventures"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a3f4f 0%, #0f2a33 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              color: "white",
            }}
          >
            🏔️
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            Walk Through Nepal
          </div>
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Authentic treks, cultural journeys &amp; wildlife adventures
          across the Himalayas
        </div>
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            gap: "32px",
            fontSize: 20,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <span>20+ Years Experience</span>
          <span>·</span>
          <span>50+ Destinations</span>
          <span>·</span>
          <span>5,000+ Happy Travelers</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
