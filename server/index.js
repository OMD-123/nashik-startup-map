import express from "express";
import cors from "cors";
import {
  NASHIK_COMPANIES,
  SECTORS,
  STAGES,
  TYPES,
  AREAS,
} from "./data.js";

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());
app.use(express.json());

/* =====================================================================
 * Utilities — flatten all roles from all companies into a single feed
 * ===================================================================== */

const ROLES_FLAT = (() => {
  const out = [];
  for (const c of NASHIK_COMPANIES) {
    for (const role of c.roles) {
      out.push({
        id: `${c.id}__${role.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60)}`,
        title: role,
        companyId: c.id,
        companyName: c.name,
        companyWebsite: c.website,
        companyType: c.type,
        sector: c.sector,
        stage: c.stage,
        area: c.area,
        // derived tags
        isIntern: /intern/i.test(role),
        isFresher: /fresher|trainee|junior|get\b/i.test(role),
        // pseudo dates — last "posted" within the last N days
        postedDaysAgo: Math.floor(Math.random() * 14) + 1,
        // pseudo salary in LPA (lakhs per annum). Realistic Nashik ranges.
        salaryLpa: pickSalary(role),
        // remote / onsite (most Nashik roles are onsite)
        remote: /(remote|work from home|wfh)/i.test(role),
      });
    }
  }
  return out.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
})();

function pickSalary(role) {
  const r = role.toLowerCase();
  if (/intern/.test(r)) return { min: 0.6, max: 1.5, period: "/month" };
  if (/fresher|trainee|junior|get\b|diploma/.test(r)) return { min: 2.4, max: 4.5, period: "/year" };
  if (/senior|lead|architect|principal/.test(r)) return { min: 12, max: 28, period: "/year" };
  if (/manager|supervisor/.test(r)) return { min: 6, max: 14, period: "/year" };
  if (/engineer|developer|designer|analyst|scientist|artist|chemist/.test(r)) return { min: 3.5, max: 9, period: "/year" };
  if (/driver|operator|steward|worker|technician/.test(r)) return { min: 1.8, max: 3.5, period: "/year" };
  if (/executive|recruiter|coordinator|associate/.test(r)) return { min: 2.5, max: 5.5, period: "/year" };
  return { min: 2.5, max: 6, period: "/year" };
}

/* =====================================================================
 * Endpoints
 * ===================================================================== */

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get("/api/meta", (_req, res) => {
  res.json({ sectors: SECTORS, stages: STAGES, types: TYPES, areas: AREAS });
});

app.get("/api/stats", (_req, res) => {
  const hiring = NASHIK_COMPANIES.filter((c) => c.hiring).length;
  const bySector = NASHIK_COMPANIES.reduce((acc, c) => {
    acc[c.sector] = (acc[c.sector] || 0) + 1;
    return acc;
  }, {});
  const byArea = NASHIK_COMPANIES.reduce((acc, c) => {
    acc[c.area] = (acc[c.area] || 0) + 1;
    return acc;
  }, {});
  res.json({
    total: NASHIK_COMPANIES.length,
    hiring,
    sectors: Object.keys(bySector).length,
    areas: Object.keys(byArea).length,
    jobs: ROLES_FLAT.length,
    bySector,
    byArea,
  });
});

/** GET /api/jobs — list of all open roles across Nashik
 *  Query params:
 *    q          — full-text across title, company, sector, area
 *    type       — startup | company
 *    sector     — filter
 *    area       — filter
 *    stage      — filter
 *    hiring     — "true" (companies currently hiring)
 *    fresher    — "true" (jobs marked for freshers)
 *    intern     — "true" (internships)
 *    remote     — "true"
 *    limit      — integer
 */
app.get("/api/jobs", (req, res) => {
  const { type, sector, stage, area, q, hiring, fresher, intern, remote, limit } = req.query;
  let list = [...ROLES_FLAT];
  if (type)   list = list.filter((j) => j.companyType === type);
  if (sector) list = list.filter((j) => j.sector === sector);
  if (stage)  list = list.filter((j) => j.stage === stage);
  if (area)   list = list.filter((j) => j.area === area);
  if (hiring === "true") list = list.filter((j) => NASHIK_COMPANIES.find((c) => c.id === j.companyId)?.hiring);
  if (fresher === "true") list = list.filter((j) => j.isFresher);
  if (intern === "true")  list = list.filter((j) => j.isIntern);
  if (remote === "true")  list = list.filter((j) => j.remote);

  if (q) {
    const n = String(q).toLowerCase().trim();
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(n) ||
        j.companyName.toLowerCase().includes(n) ||
        j.sector.toLowerCase().includes(n) ||
        j.area.toLowerCase().includes(n)
    );
  }
  if (limit) list = list.slice(0, Number(limit));
  res.json({ count: list.length, items: list });
});

app.get("/api/companies", (req, res) => {
  const { type, sector, stage, area, q, hiring, limit } = req.query;
  let list = [...NASHIK_COMPANIES];
  if (type)   list = list.filter((c) => c.type === type);
  if (sector) list = list.filter((c) => c.sector === sector);
  if (stage)  list = list.filter((c) => c.stage === stage);
  if (area)   list = list.filter((c) => c.area === area);
  if (hiring === "true") list = list.filter((c) => c.hiring);
  if (q) {
    const n = String(q).toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(n) ||
        c.description.toLowerCase().includes(n) ||
        c.sector.toLowerCase().includes(n) ||
        c.area.toLowerCase().includes(n) ||
        c.roles.some((r) => r.toLowerCase().includes(n))
    );
  }
  if (limit) list = list.slice(0, Number(limit));
  res.json({ count: list.length, items: list });
});

app.get("/api/companies/:id", (req, res) => {
  const c = NASHIK_COMPANIES.find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: "not_found" });
  res.json(c);
});

const submissions = [];
app.post("/api/submit", (req, res) => {
  const { name, type, sector, area, description, website } = req.body || {};
  if (!name || !sector) return res.status(400).json({ error: "name and sector required" });
  const sub = {
    id: `sub-${Date.now()}`,
    name, type: type || "startup", sector, area: area || "Other",
    description: description || "", website: website || "",
    status: "pending", submittedAt: new Date().toISOString(),
  };
  submissions.push(sub);
  res.status(201).json(sub);
});

app.get("/api/submissions", (_req, res) => res.json({ items: submissions }));

app.listen(PORT, () => {
  console.log(`Nashik Startup Map API running on http://localhost:${PORT}`);
  console.log(`  companies=${NASHIK_COMPANIES.length}  jobs=${ROLES_FLAT.length}`);
});