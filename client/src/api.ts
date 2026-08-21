import type { Company, Meta, Stats } from "./types";

const BASE = "/api";

async function getJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}

export async function fetchCompanies(params: Record<string, string | boolean | undefined>): Promise<Company[]> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === "" || v === false) return;
    qs.set(k, String(v));
  });
  const url = qs.toString() ? `${BASE}/companies?${qs}` : `${BASE}/companies`;
  const data = await getJson<{ items: Company[]; count: number }>(url);
  return data.items;
}

export const fetchMeta = () => getJson<Meta>(`${BASE}/meta`);
export const fetchStats = () => getJson<Stats>(`${BASE}/stats`);

export async function submitCompany(payload: Record<string, unknown>) {
  const r = await fetch(`${BASE}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}