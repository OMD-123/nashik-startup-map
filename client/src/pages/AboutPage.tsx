import { Header } from "../components/Header";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header subtitle="About this project" />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="font-display text-3xl font-bold text-slate-900">
            About the Nashik Startup Map
          </h1>
          <p className="mt-3 text-base text-slate-700">
            The <strong>Nashik Startup Map</strong> is a free, open directory of
            companies and startups operating in and around Nashik. It's built for
            two groups of people:
          </p>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>
              <strong>Nashik students</strong> — find local internships, fresher
              roles, and companies worth targeting.
            </li>
            <li>
              <strong>Unemployed / career-switchers in Nashik</strong> — discover
              which local companies are hiring today, what roles are open, and
              where they are.
            </li>
          </ul>

          <h2 className="mt-8 font-display text-xl font-bold text-slate-900">How it's built</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
            <li>
              <strong>Frontend</strong> — React 19, Vite, TypeScript, Tailwind v4,
              React-Leaflet, Leaflet MarkerCluster
            </li>
            <li>
              <strong>Backend</strong> — Node.js, Express
            </li>
            <li>
              <strong>Data</strong> — curated from public sources (LinkedIn,
              company websites, news)
            </li>
            <li>
              <strong>Map tiles</strong> — OpenStreetMap
            </li>
          </ul>

          <h2 className="mt-8 font-display text-xl font-bold text-slate-900">Contribute</h2>
          <p className="mt-2 text-slate-700">
            Know a Nashik company missing from the map? Use the
            <a href="/submit" className="font-semibold text-[#0a2540] underline"> Submit form </a>
            — every entry is reviewed.
          </p>

          <h2 className="mt-8 font-display text-xl font-bold text-slate-900">Inspired by</h2>
          <p className="mt-2 text-slate-700">
            <a
              href="https://www.bangalorestartupmap.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[#0a2540] underline"
            >
              bangalorestartupmap.com
            </a>{" "}
            — same idea, tuned for Nashik.
          </p>

          <h2 className="mt-8 font-display text-xl font-bold text-slate-900">Source</h2>
          <p className="mt-2 text-slate-700">
            Open source on{" "}
            <a
              href="https://github.com/OMD-123/nashik-startup-map"
              target="_blank"
              rel="noreferrer"
              className="text-[#0a2540] underline"
            >
              GitHub
            </a>
            .
          </p>
        </article>
      </main>
    </div>
  );
}