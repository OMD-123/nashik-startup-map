import type { Company } from "./types";

export function sectorColor(sector: string): string {
  const map: Record<string, string> = {
    "Software / IT": "#2563eb",
    "AI / ML": "#7c3aed",
    SaaS: "#0891b2",
    Edtech: "#db2777",
    Manufacturing: "#475569",
    Automotive: "#b91c1c",
    Pharma: "#0d9488",
    "Food & Beverage": "#ea580c",
    AgriTech: "#16a34a",
    Healthtech: "#059669",
    Logistics: "#ca8a04",
    "Media / VFX": "#9333ea",
    "Creative Agency": "#ec4899",
    Fintech: "#1e40af",
    Incubator: "#0e7490",
    Community: "#65a30d",
  };
  return map[sector] || "#0a2540";
}

export function stageBadge(stage: string): string {
  const m: Record<string, string> = {
    "Pre-seed": "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
    Seed: "bg-amber-100 text-amber-700 border-amber-200",
    Bootstrapped: "bg-sky-100 text-sky-700 border-sky-200",
    Established: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Series A": "bg-violet-100 text-violet-700 border-violet-200",
    Public: "bg-slate-800 text-white border-slate-900",
  };
  return m[stage] || "bg-slate-100 text-slate-700 border-slate-200";
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

export function companyInitials(c: Company): string {
  return c.name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}