import { useEffect, useState } from "react";
import { PageLayout } from "../components/PageLayout";
import { submitCompany } from "../api";
import type { Meta } from "../types";
import { fetchMeta } from "../api";

export function SubmitPage() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [form, setForm] = useState({
    name: "",
    type: "startup",
    sector: "",
    area: "",
    description: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  useEffect(() => {
    fetchMeta().then(setMeta);
  }, []);

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

  return (
    <PageLayout title="Submit a Nashik company">
      <p style={{ color: "#475569", marginBottom: 16 }}>
        Help students and job-seekers in Nashik find local opportunities. All submissions are reviewed before going live.
      </p>

      <form
        onSubmit={onSubmit}
        style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <Field label="Company name *">
          <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Acme Tech" />
        </Field>

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
          <Field label="Type">
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {meta?.types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Sector *">
            <select className="input" required value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}>
              <option value="">Choose…</option>
              {meta?.sectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Area">
          <select className="input" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
            <option value="">Choose…</option>
            {meta?.areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </Field>

        <Field label="Description">
          <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does the company do?" />
        </Field>

        <Field label="Website">
          <input type="url" className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
        </Field>

        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            background: "#ff6a1a",
            color: "#ffffff",
            border: "none",
            borderRadius: 9999,
            padding: "12px 18px",
            fontSize: 14,
            fontWeight: 700,
            cursor: status === "sending" ? "wait" : "pointer",
          }}
        >
          {status === "sending" ? "Submitting…" : "Submit for review"}
        </button>

        {status === "ok" && <p style={{ background: "#dcfce7", color: "#166534", padding: 10, borderRadius: 8, fontSize: 13 }}>✓ Thanks — your submission is queued.</p>}
        {status === "err" && <p style={{ background: "#fee2e2", color: "#991b1b", padding: 10, borderRadius: 8, fontSize: 13 }}>Couldn't submit. Please try again.</p>}
      </form>
    </PageLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
          <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{label}</span>
          {children}
        </label>
  );
}