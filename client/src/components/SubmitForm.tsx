import { useState } from "react";
import { submitCompany } from "../api";

interface Meta {
  sectors: string[];
  types: string[];
  areas: string[];
}

export function SubmitForm({ meta }: { meta: Meta | null }) {
  const [form, setForm] = useState({
    name: "",
    type: "startup",
    sector: "",
    area: "",
    description: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitCompany(form);
      setStatus("ok");
      setForm({ name: "", type: "startup", sector: "", area: "", description: "", website: "" });
    } catch {
      setStatus("err");
    }
  };

  if (!meta) return <div className="p-6 text-sm text-slate-500">Loading…</div>;

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Submit a Nashik company</h2>
        <p className="mt-1 text-sm text-slate-600">
          Help students and job-seekers discover local opportunities. Submissions are reviewed.
        </p>
      </div>

      <Field label="Name *">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input"
          placeholder="e.g. Acme Tech"
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Type">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="input"
          >
            {meta.types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sector *">
          <select
            required
            value={form.sector}
            onChange={(e) => setForm({ ...form, sector: e.target.value })}
            className="input"
          >
            <option value="">Choose…</option>
            {meta.sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Area">
        <select
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
          className="input"
        >
          <option value="">Choose…</option>
          {meta.areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description">
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input"
          placeholder="What does the company do?"
        />
      </Field>

      <Field label="Website">
        <input
          type="url"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className="input"
          placeholder="https://"
        />
      </Field>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-[#0a2540] py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff8c1a] disabled:opacity-50"
      >
        {status === "sending" ? "Submitting…" : "Submit for review"}
      </button>

      {status === "ok" && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
          ✓ Thanks — your submission is queued for review.
        </p>
      )}
      {status === "err" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          Couldn't submit. Please try again.
        </p>
      )}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

