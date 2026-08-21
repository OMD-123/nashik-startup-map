import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { SubmitForm } from "../components/SubmitForm";
import type { Meta } from "../types";
import { fetchMeta } from "../api";

export function SubmitPage() {
  const [meta, setMeta] = useState<Meta | null>(null);
  useEffect(() => {
    fetchMeta().then(setMeta);
  }, []);
  return (
    <div className="min-h-screen bg-slate-50">
      <Header subtitle="Help us add a Nashik company to the map" />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <SubmitForm meta={meta} />
      </main>
    </div>
  );
}