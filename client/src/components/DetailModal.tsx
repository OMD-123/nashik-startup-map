import { useEffect } from "react";
import type { Company } from "../types";
import { sectorColor, stageBadge } from "../utils";

interface Props {
  company: Company | null;
  onClose: () => void;
}

export function DetailModal({ company, onClose }: Props) {
  useEffect(() => {
    if (!company) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [company, onClose]);

  if (!company) return null;
  const c = company;
  const color = sectorColor(c.sector);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-900/50 px-2 py-4 backdrop-blur-sm sm:items-center sm:px-6 fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-2 w-full"
          style={{ background: color }}
        />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>

        <div className="max-h-[calc(90vh-2rem)] overflow-y-auto p-6 scrollbar-thin">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">{c.name}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {c.sector} · {c.area}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {c.hiring && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                  Hiring now
                </span>
              )}
              <span
                className={`rounded-md border px-2 py-1 text-xs font-bold ${stageBadge(c.stage)}`}
              >
                {c.stage}
              </span>
            </div>
          </div>

          <p className="mt-4 text-base leading-relaxed text-slate-700">{c.description}</p>

          <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-4">
            <Stat label="Founded" value={c.founded} />
            <Stat label="Size" value={c.size} />
            <Stat label="Area" value={c.area} />
            <Stat label="Type" value={c.type === "startup" ? "Startup" : "Company"} />
          </div>

          {c.roles.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Roles hiring for</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {c.roles.map((r) => (
                  <span
                    key={r}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {c.address && (
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Address</h3>
              <p className="mt-1 text-sm text-slate-700">{c.address}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {c.website && (
              <a
                href={c.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0a2540] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#ff8c1a]"
              >
                Visit website
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M14 3h7v7M21 3l-9 9M10 14l-7 7m17-7v7H13" />
                </svg>
              </a>
            )}
            <a
              href={`https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=15/${c.lat}/${c.lng}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Open in maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-0.5 font-display text-base font-semibold text-slate-900">{value}</div>
    </div>
  );
}