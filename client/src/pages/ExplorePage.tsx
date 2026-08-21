import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Company, FilterState, Meta } from "../types";
import { fetchCompanies, fetchMeta } from "../api";
import { MapView } from "../components/MapView";
import { GridView } from "../components/GridView";
import { ResultCounter } from "../components/ResultCounter";
import { AdsStrip } from "../components/AdsStrip";
import { DetailPanel } from "../components/DetailPanel";

const DEFAULTS: FilterState = {
  type: "",
  sector: "",
  stage: "",
  area: "",
  hiring: false,
  q: "",
  view: "map",
};

export function ExplorePage() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMeta().then(setMeta);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCompanies({
      type: filters.type,
      sector: filters.sector,
      stage: filters.stage,
      area: filters.area,
      q: filters.q,
      hiring: filters.hiring,
    })
      .then(setCompanies)
      .finally(() => setLoading(false));
  }, [filters]);

  const update = (next: Partial<FilterState>) =>
    setFilters((f) => ({ ...f, ...next }));
  const reset = () => setFilters(DEFAULTS);

  const selected = useMemo(
    () => companies.find((c) => c.id === selectedId) ?? null,
    [companies, selectedId]
  );

  const counter = useMemo(() => companies.length, [companies]);

  return (
    <div className="explore-page">
      <div className="toolbar" role="search">
        <Link to="/" className="brand" style={{ textDecoration: "none" }}>
          <span className="pin" aria-hidden />
          <span>Nashik Startup Map</span>
        </Link>

        <div className="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search startups, sectors, founders…"
            aria-label="Search"
          />
        </div>

        <div className="select-wrap">
          <select aria-label="All types" value={filters.type} onChange={(e) => update({ type: e.target.value })}>
            <option value="">All types</option>
            {meta?.types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="select-wrap">
          <select aria-label="All areas" value={filters.area} onChange={(e) => update({ area: e.target.value })}>
            <option value="">All areas</option>
            {meta?.areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="select-wrap">
          <select aria-label="All stages" value={filters.stage} onChange={(e) => update({ stage: e.target.value })}>
            <option value="">All stages</option>
            {meta?.stages.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="select-wrap">
          <select aria-label="All sectors" value={filters.sector} onChange={(e) => update({ sector: e.target.value })}>
            <option value="">All sectors</option>
            {meta?.sectors.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="toggle" role="tablist">
          <button
            className={filters.view === "map" ? "active" : ""}
            onClick={() => update({ view: "map" })}
            role="tab"
            aria-selected={filters.view === "map"}
          >
            Map
          </button>
          <button
            className={filters.view === "grid" ? "active" : ""}
            onClick={() => update({ view: "grid" })}
            role="tab"
            aria-selected={filters.view === "grid"}
          >
            Grid
          </button>
        </div>

        <button className="btn-boost" title="Boost your company" onClick={() => alert("Boost — coming soon")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>
          Boost
        </button>

        <Link to="/submit" style={{ textDecoration: "none" }}>
          <button className="btn-submit">Submit</button>
        </Link>
      </div>

      <ResultCounter count={counter} loading={loading} />

      <button
        className="job-alerts"
        onClick={() => alert("Job alerts — coming soon")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
        Get job alerts
      </button>

      {filters.view === "map" ? (
        <MapView companies={companies} selectedId={selectedId} onSelect={setSelectedId} />
      ) : (
        <GridView companies={companies} onSelect={setSelectedId} />
      )}

      <AdsStrip />

      <DetailPanel company={selected} onClose={() => setSelectedId(null)} />

      <style>{`
        .explore-page {
          position: relative;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: #dbeafe;
        }
        .leaflet-container {
          position: absolute;
          inset: 0;
          background: #dbeafe;
        }
      `}</style>
    </div>
  );
}