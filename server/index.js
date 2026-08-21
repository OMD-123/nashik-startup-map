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

/** GET /api/health — readiness probe */
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

/** GET /api/meta — facets for filters */
app.get("/api/meta", (_req, res) => {
  res.json({
    sectors: SECTORS,
    stages: STAGES,
    types: TYPES,
    areas: AREAS,
  });
});

/** GET /api/stats — summary cards */
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
    bySector,
    byArea,
  });
});

/**
 * GET /api/companies — list with filtering.
 * Query params: type, sector, stage, area, q, hiring, limit
 */
app.get("/api/companies", (req, res) => {
  const { type, sector, stage, area, q, hiring, limit } = req.query;
  let list = [...NASHIK_COMPANIES];

  if (type) list = list.filter((c) => c.type === type);
  if (sector) list = list.filter((c) => c.sector === sector);
  if (stage) list = list.filter((c) => c.stage === stage);
  if (area) list = list.filter((c) => c.area === area);
  if (hiring === "true") list = list.filter((c) => c.hiring);

  if (q) {
    const needle = String(q).toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.description.toLowerCase().includes(needle) ||
        c.sector.toLowerCase().includes(needle) ||
        c.area.toLowerCase().includes(needle) ||
        c.roles.some((r) => r.toLowerCase().includes(needle))
    );
  }

  if (limit) list = list.slice(0, Number(limit));

  res.json({
    count: list.length,
    items: list,
  });
});

/** GET /api/companies/:id — detail */
app.get("/api/companies/:id", (req, res) => {
  const c = NASHIK_COMPANIES.find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: "not_found" });
  res.json(c);
});

/** POST /api/submit — community submissions (in-memory only) */
const submissions = [];
app.post("/api/submit", (req, res) => {
  const { name, type, sector, area, description, website } = req.body || {};
  if (!name || !sector) {
    return res.status(400).json({ error: "name and sector are required" });
  }
  const sub = {
    id: `sub-${Date.now()}`,
    name,
    type: type || "startup",
    sector,
    area: area || "Other",
    description: description || "",
    website: website || "",
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  submissions.push(sub);
  res.status(201).json(sub);
});

app.get("/api/submissions", (_req, res) => res.json({ items: submissions }));

app.listen(PORT, () => {
  console.log(`Nashik Startup Map API running on http://localhost:${PORT}`);
});