import type { FilterState, Meta } from "../types";

interface Props {
  meta: Meta | null;
  filters: FilterState;
  onChange: (next: Partial<FilterState>) => void;
  onReset: () => void;
  total: number;
}

const ALL = { value: "", label: "All" };

export function FilterBar({ meta, filters, onChange, onReset, total }: Props) {
  if (!meta) return null;
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 7 0 110-14 8 7 0 010 14z" />
          </svg>
          <input
            value={filters.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Search by name, sector, role…"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#0a2540] focus:bg-white focus:ring-2 focus:ring-[#ff8c1a]/30"
          />
        </div>

        <Select
          value={filters.type}
          onChange={(v) => onChange({ type: v })}
          options={[ALL, ...meta.types.map((v) => ({ value: v, label: v }))]}
          label="Type"
        />
        <Select
          value={filters.sector}
          onChange={(v) => onChange({ sector: v })}
          options={[ALL, ...meta.sectors.map((v) => ({ value: v, label: v }))]}
          label="Sector"
        />
        <Select
          value={filters.stage}
          onChange={(v) => onChange({ stage: v })}
          options={[ALL, ...meta.stages.map((v) => ({ value: v, label: v }))]}
          label="Stage"
        />
        <Select
          value={filters.area}
          onChange={(v) => onChange({ area: v })}
          options={[ALL, ...meta.areas.map((v) => ({ value: v, label: v }))]}
          label="Area"
        />

        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={filters.hiring}
            onChange={(e) => onChange({ hiring: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-[#ff8c1a] focus:ring-[#ff8c1a]"
          />
          <span>Hiring now</span>
        </label>

        <button
          onClick={onReset}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          Reset
        </button>

        <div className="ml-auto flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <ViewButton active={filters.view === "map"} onClick={() => onChange({ view: "map" })}>
            Map
          </ViewButton>
          <ViewButton active={filters.view === "list"} onClick={() => onChange({ view: "list" })}>
            List
          </ViewButton>
          <ViewButton active={filters.view === "grid"} onClick={() => onChange({ view: "grid" })}>
            Grid
          </ViewButton>
        </div>

        <div className="ml-2 hidden text-xs font-medium text-slate-500 sm:block">
          <span className="font-bold text-slate-900">{total}</span> result{total !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0a2540] focus:ring-2 focus:ring-[#ff8c1a]/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label === "All" ? `${label}: All` : `${label}: ${o.label}`}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-md px-3 py-1 text-xs font-semibold transition " +
        (active
          ? "bg-[#0a2540] text-white shadow"
          : "text-slate-600 hover:bg-white")
      }
    >
      {children}
    </button>
  );
}