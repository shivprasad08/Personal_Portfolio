import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0d1117",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Green top accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "#238636" }} />

        {/* Available badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#3fb950" }} />
          <span style={{ color: "#7d8590", fontSize: "16px" }}>Available for work</span>
        </div>

        {/* Name */}
        <div style={{ fontSize: "72px", fontWeight: 700, color: "#e6edf3", lineHeight: 1.1 }}>
          Shivprasad Mahind
        </div>

        {/* Role */}
        <div style={{ fontSize: "28px", color: "#3fb950", marginTop: "16px" }}>
          Full Stack Developer
        </div>

        {/* Stack pills */}
        <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
          {["MERN", "Next.js", "Python", "AI/ML", "Open Source"].map((s) => (
            <div
              key={s}
              style={{
                padding: "6px 16px",
                border: "1px solid #30363d",
                borderRadius: "20px",
                color: "#7d8590",
                fontSize: "14px",
              }}
            >
              {s}
            </div>
          ))}
        </div>

        {/* URL bottom right */}
        <div style={{ position: "absolute", bottom: "32px", right: "80px", color: "#484f58", fontSize: "16px" }}>
          shivprasadportfolio.vercel.app
        </div>

        {/* Green bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "32px",
            background: "#238636",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: "16px",
            fontSize: "12px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <span>⎇ main</span>
          <span>TypeScript</span>
          <span style={{ color: "#fff" }}>● Live</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
