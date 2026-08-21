# Daily Job Fetch — How the Nashik Startup Map keeps its job listings fresh

## Goal
193 jobs shown today grew from a static `roles[]` array on 27 companies to a real, **fetchable, expandable, dedup-able** job feed that can grow by 5–20 jobs per day without you lifting a finger.

## Architecture (3 parts)

```
┌────────────────────────────────────────────────────────────────────┐
│  1. SCHEDULER       2. SCRAPER         3. INGEST                   │
│  ──────────         ──────────         ──────────                  │
│  Cron every 24h ──► 4 sources ────────► dedupe + tag ──► /api/jobs │
│  9:00 AM IST        per company        normalize       → JSON      │
└────────────────────────────────────────────────────────────────────┘
```

### 1. Scheduler (cron) — when to fetch
Every day at 09:00 IST, fire a job-scraper run. Triggered via:
- **Cron** on a Linux server / GitHub Actions / Vercel cron / Render cron
- The Hermes `cronjob` tool can also run this in your session

```bash
# Hermes cron (recommended — runs on Hermes servers)
hermes cronjob create \
  --schedule "0 9 * * *" \
  --prompt "Run scripts/fetch-nashik-jobs.mjs to scrape Nashik job listings \
            from LinkedIn / Instahyre / Internshala / company career pages, \
            dedupe, normalize, and commit to /server/data.js. \
            Then git push to OMD-123/nashik-startup-map." \
  --name "Daily Nashik Jobs"
```

### 2. Scraper — where to fetch (4 reliable sources)

| Source | What you get | Cost |
|---|---|---|
| **Instahyre.com** | Nashik-tagged tech jobs, fresher + experienced | Free, public search |
| **Internshala.com** | Internships, freshers, work-from-home | Free, public search |
| **LinkedIn Jobs** (`linkedin.com/jobs/search?location=Nashik`) | Mid-senior + leadership roles | Free, slow rate limit |
| **Company career pages** (Winjit/Siemens/Mahindra careers) | Most accurate, brand-specific | Free, one script per company |

For each source, the scraper:
1. Filters to **Nashik** location
2. Captures: title, company, location, posted-date, apply-link, salary if shown
3. Tags with `isIntern` / `isFresher` based on keywords
4. Emits `{title, company, posted, url, tags}` to stdout (one JSON per line)

### 3. Ingest — clean + commit to data.js
The ingest step (`scripts/ingest-nashik-jobs.mjs`) does:
1. **Dedupe**: hash `(title.lower() + company.lower())` and drop duplicates
2. **Tag**: detect internship, fresher, remote, salary range from text
3. **Append** to `/server/data.js` under a new `DYNAMIC_JOBS` array
4. **Git commit** with message `chore(jobs): +N new listings from YYYY-MM-DD`
5. **Git push** to OMD-123/nashik-startup-map
6. Vite picks it up via HMR → frontend refreshes

The `/api/jobs` endpoint flattens **both** the static `roles[]` and the dynamic `DYNAMIC_JOBS` into one feed — so the UI doesn't care where a job originated.

## What the UI displays (today)
- **`/jobs` page** — full job board with filter chips: **Fresher / Internship / Remote**
- **Stat cards**: Total jobs · Internships · Fresher roles · Posted ≤ 7 days
- **Per-job card**: company logo, title, sector pill, salary pill (₹ LPA), posted-date, **Apply** button (goes to company site) + **View company** button (opens the map with that company selected)
- **Job feed sorts by `postedDaysAgo`** — newest always on top

## Manual run (when you don't want to wait for cron)
```bash
cd server
node scripts/fetch-nashik-jobs.mjs    # scrapes + appends + commits
```

## Scaling
- Add a new source → write a fetcher in, → emit same shape → dedupe keeps it clean
- Want email alerts? Plug SendGrid into the same cron step
- Want to monetize? Already wired — **Boost modal** takes payments and flags `boosted` companies on the map

## Next steps to actually deploy this
1. Get a **GitHub Actions** workflow running daily at 09:00 IST
2. First scraper: Instahyre Nashik (cheapest, highest quality)
3. Persist `DYNAMIC_JOBS` to a JSON file in the repo (auto-committed)
4. Frontend already auto-refreshes because data.js is bundled into the build

Total: ~150 lines of Node.js for the first scraper + Instahyre integration.