import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Job, Meta } from "../types";
import { fetchJobs, fetchMeta } from "../api";
import { PageLayout } from "../components/PageLayout";

function colorFromJob(j: Job): string {
  // Hash by companyId so each company has a consistent color
  let h = 0;
  for (const ch of j.companyId) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const palette = ["#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#8b5cf6","#ec4899","#0d9488","#0a2540"];
  return palette[Math.abs(h) % palette.length];
}

const DEFAULTS = {
  q: "",
  sector: "",
  area: "",
  type: "",
  fresher: false,
  intern: false,
  remote: false,
};

export function JobsPage() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeta().then(setMeta);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchJobs({
      q: filters.q,
      sector: filters.sector,
      area: filters.area,
      type: filters.type,
      fresher: filters.fresher,
      intern: filters.intern,
      remote: filters.remote,
    })
      .then(setJobs)
      .finally(() => setLoading(false));
  }, [filters]);

  const update = (next: Partial<typeof DEFAULTS>) =>
    setFilters((f) => ({ ...f, ...next }));
  const reset = () => setFilters(DEFAULTS);

  const stats = useMemo(() => {
    const intern = jobs.filter((j) => j.isIntern).length;
    const fresher = jobs.filter((j) => j.isFresher).length;
    const last7 = jobs.filter((j) => j.postedDaysAgo <= 7).length;
    return { total: jobs.length, intern, fresher, last7 };
  }, [jobs]);

  return (
    <PageLayout title="Nashik Jobs">
      <p style={{ color: "#475569", fontSize: 15, marginBottom: 24 }}>
        Fresh job listings from Nashik startups and companies. Updated daily. Built for students and job-seekers in Nashik.
      </p>

      {/* ----- Filter bar ----- */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          padding: 16,
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <input
          value={filters.q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Search jobs, companies, skills…"
          style={{
            flex: "1 1 220px",
            padding: "10px 14px",
            border: "1px solid #cbd5e1",
            borderRadius: 9999,
            fontSize: 14,
            outline: "none",
            minWidth: 200,
          }}
        />

        <select value={filters.sector} onChange={(e) => update({ sector: e.target.value })} className="select-pill">
          <option value="">All sectors</option>
          {meta?.sectors.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={filters.area} onChange={(e) => update({ area: e.target.value })} className="select-pill">
          <option value="">All areas</option>
          {meta?.areas.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>

        <select value={filters.type} onChange={(e) => update({ type: e.target.value })} className="select-pill">
          <option value="">All types</option>
          <option value="startup">Startups</option>
          <option value="company">Companies</option>
        </select>

        <Chip label="Fresher"  on={filters.fresher} onClick={() => update({ fresher: !filters.fresher })} />
        <Chip label="Internship" on={filters.intern} onClick={() => update({ intern: !filters.intern })} />
        <Chip label="Remote"   on={filters.remote} onClick={() => update({ remote: !filters.remote })} />

        <button
          onClick={reset}
          style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer" }}
        >
          Reset
        </button>
      </div>

      {/* ----- Stats row ----- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <StatCard label="Total jobs"     value={stats.total}  accent="#0a2540" />
        <StatCard label="Internships"    value={stats.intern} accent="#7c3aed" />
        <StatCard label="Fresher roles"  value={stats.fresher} accent="#16a34a" />
        <StatCard label="Posted ≤ 7 days" value={stats.last7}  accent="#ff6a1a" />
      </div>

      {/* ----- Job list ----- */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>Loading jobs…</p>
      ) : jobs.length === 0 ? (
        <p style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>No jobs match your filters.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {jobs.map((j) => <JobRow key={j.id} j={j} />)}
        </div>
      )}

      <style>{`
        .select-pill {
          padding: 8px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 9999px;
          font-size: 13px;
          background: #ffffff;
          outline: none;
          cursor: pointer;
        }
        .select-pill:focus { border-color: #ff6a1a; }
      `}</style>
    </PageLayout>
  );
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: 9999,
        border: on ? "1.5px solid #ff6a1a" : "1px solid #cbd5e1",
        background: on ? "#fff7ed" : "#ffffff",
        color: on ? "#ff6a1a" : "#475569",
        fontSize: 13,
        fontWeight: on ? 700 : 500,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: accent, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function JobRow({ j }: { j: Job }) {
  const tags: { label: string; bg: string; fg: string }[] = [];
  if (j.isIntern)  tags.push({ label: "Internship", bg: "#ede9fe", fg: "#6d28d9" });
  if (j.isFresher) tags.push({ label: "Fresher",    bg: "#dcfce7", fg: "#166534" });
  if (j.remote)    tags.push({ label: "Remote",     bg: "#dbeafe", fg: "#1e40af" });

  return (
    <article
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: colorFromJob(j),
          color: "#ffffff",
          fontWeight: 800,
          fontSize: 18,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {j.companyName.charAt(0).toUpperCase()}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{j.title}</h3>
        <p style={{ margin: "4px 0 8px", fontSize: 13, color: "#475569" }}>
          <strong>{j.companyName}</strong> · {j.area}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          <span style={pillStyle("#f1f5f9", "#334155")}>{j.sector}</span>
          {tags.map((t) => (
            <span key={t.label} style={pillStyle(t.bg, t.fg)}>{t.label}</span>
          ))}
          <span style={pillStyle("#fef3c7", "#92400e")}>
            ₹ {j.salaryLpa.min}–{j.salaryLpa.max} LPA
          </span>
        </div>

        <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>
          Posted {j.postedDaysAgo === 1 ? "yesterday" : `${j.postedDaysAgo} days ago`}
          {j.companyWebsite && " · Apply on company site"}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
        {j.companyWebsite ? (
          <a
            href={j.companyWebsite}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "8px 14px",
              borderRadius: 9999,
              background: "#ff6a1a",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Apply →
          </a>
        ) : (
          <span style={{ fontSize: 11, color: "#94a3b8" }}>Apply via email</span>
        )}
        <Link
          to={`/?company=${j.companyId}`}
          style={{
            padding: "8px 14px",
            borderRadius: 9999,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            color: "#0f172a",
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "none",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          View company
        </Link>
      </div>
    </article>
  );
}

function pillStyle(bg: string, fg: string): React.CSSProperties {
  return {
    padding: "3px 10px",
    borderRadius: 9999,
    background: bg,
    color: fg,
    fontSize: 11,
    fontWeight: 600,
    lineHeight: 1.4,
  };
}