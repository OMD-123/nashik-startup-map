import type { Company } from "../types";
import { sectorColor, stageBadge, companyInitials } from "../utils";

interface Props {
  c: Company;
  onSelect?: (id: string) => void;
  selected?: boolean;
  variant?: "grid" | "list";
}

export function CompanyCard({ c, onSelect, selected, variant = "grid" }: Props) {
  const color = sectorColor(c.sector);

  if (variant === "list") {
    return (
      <button
        onClick={() => onSelect?.(c.id)}
        className={
          "flex w-full items-center gap-4 border-b border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50 " +
          (selected ? "bg-amber-50" : "")
        }
      >
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-bold text-white shadow-sm"
          style={{ background: color }}
        >
          {companyInitials(c)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-base font-bold text-slate-900">{c.name}</h3>
            {c.hiring && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
                Hiring
              </span>
            )}
          </div>
          <p className="truncate text-sm text-slate-600">
            {c.sector} · {c.area} · {c.size}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            {c.roles.slice(0, 4).join(", ")}
          </p>
        </div>
        <span className="hidden text-xs text-slate-400 sm:inline">Founded {c.founded}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => onSelect?.(c.id)}
      className={
        "group flex h-full flex-col rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg " +
        (selected ? "border-[#ff8c1a] ring-2 ring-[#ff8c1a]/30" : "border-slate-200")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="grid h-12 w-12 place-items-center rounded-xl text-sm font-bold text-white shadow-sm"
          style={{ background: color }}
        >
          {companyInitials(c)}
        </div>
        {c.hiring && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
            Hiring
          </span>
        )}
      </div>

      <h3 className="mt-3 font-display text-base font-bold text-slate-900">{c.name}</h3>
      <p className="text-xs font-medium text-slate-500">
        {c.sector} · {c.area} · {c.size}
      </p>

      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{c.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${stageBadge(c.stage)}`}>
          {c.stage}
        </span>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
          Founded {c.founded}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {c.roles.slice(0, 4).map((r) => (
          <span
            key={r}
            className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700"
          >
            {r}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <span className="text-xs font-semibold text-[#0a2540] group-hover:text-[#ff8c1a]">
          View details →
        </span>
      </div>
    </button>
  );
}