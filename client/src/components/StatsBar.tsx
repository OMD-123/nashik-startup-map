import type { Stats } from "../types";

interface Props {
  stats: Stats | null;
}

export function StatsBar({ stats }: Props) {
  if (!stats) return null;
  const topSectors = Object.entries(stats.bySector)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  return (
    <div className="grid grid-cols-2 gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:grid-cols-4">
      <StatCard label="Companies" value={stats.total} accent="#0a2540" />
      <StatCard label="Hiring now" value={stats.hiring} accent="#16a34a" />
      <StatCard label="Sectors" value={stats.sectors} accent="#ff8c1a" />
      <StatCard label="Areas" value={stats.areas} accent="#7c3aed" />
      {topSectors.length > 0 && (
        <div className="col-span-2 hidden rounded-xl bg-white p-3 ring-1 ring-slate-200 sm:block sm:col-span-4">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Top sectors
          </div>
          <div className="flex flex-wrap gap-2">
            {topSectors.map(([s, n]) => (
              <span
                key={s}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
              >
                {s} · <span className="font-bold">{n}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-0.5 font-display text-2xl font-bold" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}