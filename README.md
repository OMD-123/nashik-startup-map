# Nashik Startup Map 🗺️

> A free, open directory of startups and companies in Nashik, built for **Nashik students** and **unemployed / career-switchers** to discover local opportunities.

Inspired by [bangalorestartupmap.com](https://www.bangalorestartupmap.com/). Re-built for Nashik.

![Nashik Startup Map](https://img.shields.io/badge/Nashik-Startup%20Map-0a2540?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzBhMjU0MCIvPjwvc3ZnPg==)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=for-the-badge&logo=typescript)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet)

---

## ✨ Features

- 🗺️ **Interactive map** of all Nashik startups & companies (Leaflet + OpenStreetMap, marker clustering)
- 🔎 **Full-text search** across name, sector, area, and open roles
- 🎯 **Multi-filter** by type (startup / company), sector, stage, area, and "hiring now"
- 👁 **Three views** — Map, List, and Grid — toggle instantly
- 📊 **Live stats** — total, hiring, sectors, areas
- 📝 **Community submissions** — anyone can submit a missing company
- 📱 **Responsive** — works from phone to desktop
- 💨 **Auto-fly** — click a list row or grid card, the map flies to that pin

---

## 🏗 Architecture

```
nashik-startup-map/
├── client/              React 19 + Vite + TypeScript + Tailwind v4
│   ├── src/
│   │   ├── components/  MapView, FilterBar, CompanyCard, DetailModal, StatsBar
│   │   ├── pages/       SubmitPage, AboutPage
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── server/              Node.js + Express
    ├── index.js
    ├── data.js          Curated Nashik company dataset
    └── package.json
```

External libraries:

- **react-leaflet** + **leaflet** + **leaflet.markercluster** — map rendering, clustering
- **react-router-dom** — `/`, `/submit`, `/about` routes
- **tailwindcss** + **@tailwindcss/vite** — styling
- **cors** + **express** — REST API

---

## 🚀 Run locally

```bash
# 1. Install
cd server  && npm install
cd ../client && npm install

# 2. Start API (terminal 1)
cd server
npm run dev       # http://localhost:5174

# 3. Start UI (terminal 2)
cd client
npm run dev       # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5174`.

---

## 🔌 API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Readiness probe |
| GET | `/api/meta` | Sectors / stages / types / areas |
| GET | `/api/stats` | Summary cards (total, hiring, bySector, byArea) |
| GET | `/api/companies` | List — query: `type`, `sector`, `stage`, `area`, `q`, `hiring=true`, `limit` |
| GET | `/api/companies/:id` | Detail |
| POST | `/api/submit` | Community submission `{ name, type, sector, area, description, website }` |

Example:

```bash
curl 'http://localhost:5174/api/companies?sector=Software%20%2F%20IT&hiring=true' | jq '.count'
# => 4
```

---

## 🧪 What's in the data

`server/data.js` ships with **27 curated entries** spanning:

- Software / IT, AI/ML, SaaS, Edtech
- Manufacturing, Automotive, Pharma
- Food & Beverage (Sula, York, Grover Zampa — Nashik's wine belt)
- AgriTech, Healthtech, Logistics
- Media / VFX, Creative Agencies
- Fintech, Incubators (CIIE), Founder communities

Each entry has coordinates, sector, stage, area, size, founded year, and the **open roles** the company is hiring for.

---

## 🎯 For Nashik students & job-seekers

1. Open [the map](https://github.com/OMD-123/nashik-startup-map)
2. Filter by **Hiring now** to see who's actively recruiting
3. Filter by your **sector** (Software, Pharma, Finance…)
4. Click a pin → see roles, website, map link
5. Apply directly on the company's careers page (link in modal)

---

## 🤝 Contributing

- **Add a company** — use the `/submit` form
- **Fix a typo / link** — open an issue or PR
- **Self-host** — fork + edit `server/data.js`

---

## 📜 License

MIT — by [OMD-123](https://github.com/OMD-123)