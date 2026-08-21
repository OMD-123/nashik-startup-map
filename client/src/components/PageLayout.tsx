import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export function PageLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          padding: "14px 20px",
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden
            style={{
              width: 28,
              height: 28,
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              background: "#ff6a1a",
            }}
          />
          <strong style={{ fontSize: 16, color: "#0f172a" }}>Nashik Startup Map</strong>
        </Link>
        <Link to="/" style={{ fontSize: 13, color: "#0f172a", textDecoration: "none" }}>
          ← Back to map
        </Link>
      </header>

      <main style={{ flex: 1, padding: "32px 20px", maxWidth: 720, width: "100%", margin: "0 auto" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>
          {title}
        </h1>
        {children}
      </main>

      <footer style={{ padding: "16px 20px", borderTop: "1px solid #e2e8f0", textAlign: "center", color: "#64748b", fontSize: 12 }}>
        © OMD-123 · MIT
      </footer>
    </div>
  );
}