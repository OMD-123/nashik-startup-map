import { PageLayout } from "../components/PageLayout";

export function AboutPage() {
  return (
    <PageLayout title="About the Nashik Startup Map">
      <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.6 }}>
        The <strong>Nashik Startup Map</strong> is a free, open directory of startups and companies operating in and around Nashik.
        It is built for two groups of people:
      </p>
      <ul style={{ color: "#475569", paddingLeft: 22, lineHeight: 1.7 }}>
        <li><strong>Nashik students</strong> — find local internships, fresher roles, and companies worth targeting.</li>
        <li><strong>Unemployed / career-switchers in Nashik</strong> — discover which local companies are hiring today, what roles are open, and where they are.</li>
      </ul>

      <h2 style={{ marginTop: 32, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>How it's built</h2>
      <ul style={{ color: "#475569", paddingLeft: 22, lineHeight: 1.7 }}>
        <li><strong>Frontend</strong> — React 19, Vite, TypeScript, Tailwind v4, React-Leaflet, Leaflet MarkerCluster</li>
        <li><strong>Backend</strong> — Node.js, Express</li>
        <li><strong>Data</strong> — curated from public sources (LinkedIn, company websites, news)</li>
        <li><strong>Map tiles</strong> — OpenStreetMap</li>
      </ul>

      <h2 style={{ marginTop: 32, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Inspired by</h2>
      <p style={{ color: "#475569" }}>
        <a href="https://www.bangalorestartupmap.com/" target="_blank" rel="noreferrer" style={{ color: "#0a2540", fontWeight: 600 }}>
          bangalorestartupmap.com
        </a>{" "}— same idea, tuned for Nashik.
      </p>

      <h2 style={{ marginTop: 32, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Source</h2>
      <p style={{ color: "#475569" }}>
        Open source on{" "}
        <a href="https://github.com/OMD-123/nashik-startup-map" target="_blank" rel="noreferrer" style={{ color: "#0a2540", fontWeight: 600 }}>
          GitHub
        </a>.
      </p>
    </PageLayout>
  );
}