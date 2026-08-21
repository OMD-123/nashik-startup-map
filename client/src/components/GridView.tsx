import type { Company } from "../types";
import { companyLetter } from "../utils";

interface Props {
  companies: Company[];
  loading?: boolean;
}

export function GridView({ companies }: Props) {
  if (companies.length === 0) {
    return (
      <div className="grid-overlay">
        <h2>No results</h2>
        <p style={{ color: "#64748b" }}>Try clearing some filters.</p>
      </div>
    );
  }
  return (
    <div className="grid-overlay">
      <h2>{companies.length} companies</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        {companies.map((c) => (
          <CompanyGridCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}

function CompanyGridCard({ c }: { c: Company }) {
  return (
    <a
      href={c.website || "#"}
      target="_blank"
      rel="noreferrer"
      style={{
        background: "#ffffff",
        borderRadius: 14,
        padding: 14,
        textDecoration: "none",
        color: "#0f172a",
        boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
        border: "1px solid #e2e8f0",
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "#0a2540",
          color: "#ff6a1a",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {companyLetter(c)}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{c.name}</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>
          {c.sector} · {c.area}
        </div>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 12,
            color: "#475569",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {c.description}
        </p>
      </div>
    </a>
  );
}