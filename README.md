# Bourne Community Groups Points Website

A free, static React/Vite site for UDSC's Bourne Community Groups House Cup.

## New architecture

The public website no longer stores student-level points in Firebase. The public data contract is intentionally small:

```csv
event_id,event_name,date,house,points
```

The private Microsoft Forms/SharePoint/Power Automate system remains the source of truth for student identities, email addresses, computing IDs, and raw submissions. Only the five public-safe fields above are committed to this repository.

The intended pipeline is:

```text
Microsoft Forms
      ↓
Power Automate
      ↓
private SharePoint archive + public-safe export
      ↓
GitHub repository_dispatch
      ↓
GitHub Action
      ↓
frontend/public/data/points.csv
      ↓
GitHub Pages deployment
      ↓
public website
```

## Public data

Put the public points database at:

`frontend/public/data/points.csv`

The first row must be:

```text
event_id,event_name,date,house,points
```

Do not commit names, computing IDs, email addresses, raw Forms exports, student rosters, or private SharePoint data.

The website calculates house totals and event-by-event totals in the browser from this CSV. There is no public database account or server to maintain.

## GitHub Action: Power Automate → GitHub

`.github/workflows/update-points.yml` listens for a GitHub `repository_dispatch` event of type `points_export`.

Power Automate should send this public-safe payload:

```json
{
  "event_id": "BCG-2026-001",
  "event_name": "Community Dinner",
  "event_date": "2026-09-15",
  "csv": "event_id,event_name,date,house,points\nBCG-2026-001,Community Dinner,2026-09-15,Gray,20\n"
}
```

The workflow refuses an empty event ID/CSV and checks whether that event ID is already present before appending it. This gives us basic idempotency if Power Automate retries a dispatch.

## GitHub Pages

`.github/workflows/deploy.yml` builds `frontend` and deploys `frontend/dist` to GitHub Pages whenever anything under `frontend/` changes.

In the GitHub repository, set:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

If the repository name is not `bcg-website`, update `base` in `frontend/vite.config.js` to `/<repository-name>/`.

## Website information architecture

Public navigation:

- Home — standings plus the most recent event result.
- Leaderboard — current House Cup standings and the most recent event comparison.
- Points Table — event dropdown; compares each house's points for the selected event.
- Championship History — annual champions from `frontend/public/data/championships.json`.

Removed:

- My Points / individual student lookup.
- Individual points correction UI.
- Firebase-backed point storage.

Officer tools remain accessible from the footer but are not part of the public navigation:

- **Manual Excel export (fallback):** a browser-only utility that can join a Forms export to a private roster and produce a public-safe CSV. It does not publish data.
- **Championship history:** instructions for editing `data/championships.json` and adding a champion photo directly to the repository.

## Championship history

Because this changes only once a year, direct GitHub editing is the recommended source of truth.

Add records to `frontend/public/data/championships.json`:

```json
[
  {
    "year": "2026-27",
    "house": "Gray",
    "houseHead": "Faculty/Staff Head",
    "studentLeader": "Student Head",
    "description": "Short championship description.",
    "image": "champions/2027.jpg"
  }
]
```

Photos go under `frontend/public/champions/`.

## Local development

```bash
cd frontend
npm install
npm run dev
```

The site reads the checked-in sample `points.csv`, so no Firebase credentials or environment variables are required.

## Important privacy rule

Treat the GitHub repository as public. Anything committed here must be safe for any member of the public to download. The website intentionally has no student-level lookup and no public student-identifying data.
