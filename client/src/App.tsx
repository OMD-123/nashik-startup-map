import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { Company, FilterState, Meta, Stats } from "./types";
import { fetchCompanies, fetchMeta, fetchStats } from "./api";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { StatsBar } from "./components/StatsBar";
import { MapView } from "./components/MapView";
import { CompanyCard } from "./components/CompanyCard";
import { DetailModal } from "./components/DetailModal";
import { SubmitPage } from "./pages/SubmitPage";
import { AboutPage } from "./pages/AboutPage";
import { DEFAULT_FILTERS } from "./types";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function ExplorePage() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchMeta(), fetchStats()]).then(([m, s]) => {
      setMeta(m);
      setStats(s);
    });
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
      .then((items) => {
        setCompanies(items);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const selected = companies.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <StatsBar stats={stats} />
      <FilterBar
        meta={meta}
        filters={filters}
        onChange={(next) => setFilters((f) => ({ ...f, ...next }))}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        total={companies.length}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4">
        {loading && (
          <div className="py-12 text-center text-sm text-slate-500">Loading…</div>
        )}

        {!loading && companies.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
            <p className="font-display text-lg font-bold text-slate-900">No matches</p>
            <p className="mt-1 text-sm text-slate-500">
              Try clearing some filters or searching for a broader keyword.
            </p>
          </div>
        )}

        {!loading && companies.length > 0 && (
          <>
            {filters.view === "map" && (
              <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  <div style={{ height: "min(70vh, 720px)", minHeight: 480 }}>
                    <MapView
                      companies={companies}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                    />
                  </div>
                </div>
                <div className="flex max-h-[min(70vh,720px)] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <h2 className="font-display text-sm font-bold text-slate-900">
                      {companies.length} company{companies.length !== 1 ? "ies" : "y"} in view
                    </h2>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {companies.map((c) => (
                      <CompanyCard
                        key={c.id}
                        c={c}
                        variant="list"
                        selected={selectedId === c.id}
                        onSelect={setSelectedId}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {filters.view === "list" && (
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                {companies.map((c) => (
                  <CompanyCard
                    key={c.id}
                    c={c}
                    variant="list"
                    selected={selectedId === c.id}
                    onSelect={setSelectedId}
                  />
                ))}
              </div>
            )}

            {filters.view === "grid" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {companies.map((c) => (
                  <CompanyCard
                    key={c.id}
                    c={c}
                    variant="grid"
                    selected={selectedId === c.id}
                    onSelect={setSelectedId}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      <DetailModal company={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Built for Nashik students & job-seekers ·{" "}
          <a
            href="https://github.com/OMD-123"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-slate-700 hover:text-[#ff8c1a]"
          >
            OMD-123
          </a>
        </p>
        <p className="text-xs">
          Data curated from public sources · Submit corrections via the form
        </p>
      </div>
    </footer>
  );
}