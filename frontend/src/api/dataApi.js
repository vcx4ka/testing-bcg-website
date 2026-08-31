import { HOUSES } from "./mockData.js";

const DATA_URL = `${import.meta.env.BASE_URL}data/points.csv`;
const CHAMPIONSHIPS_URL = `${import.meta.env.BASE_URL}data/championships.json`;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1)
    .filter((r) => r.some((v) => String(v).trim() !== ""))
    .map((r, index) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""]))
      )
    .map((r, index) => ({
      entryId: `${r.event_id || "event"}-${r.house || "house"}-${r.date || index}-${index}`,
      eventId: r.event_id,
      eventTitle: r.event_name,
      date: r.date,
      house: normalizeHouse(r.house),
      points: Number(r.points) || 0,
    }))
    .filter((r) => r.eventTitle && r.house && Number.isFinite(r.points));
}

function normalizeHouse(value) {
  const raw = String(value || "").trim().toLowerCase();
  const found = HOUSES.find((h) => h.key === raw || h.label.toLowerCase() === raw || h.label.toLowerCase().replace(" house", "") === raw);
  return found?.key || raw;
}

export async function getPointEntries() {
  const response = await fetch(DATA_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Couldn't load the public points data.");
  return parseCsv(await response.text());
}

export async function getStandings() {
  const entries = await getPointEntries();
  return HOUSES.map((house) => ({
    house: house.key,
    points: entries.filter((e) => e.house === house.key).reduce((sum, e) => sum + e.points, 0),
  }))
    .sort((a, b) => b.points - a.points)
    .map((row, index, rows) => ({
      ...row,
      rank: index > 0 && row.points === rows[index - 1].points ? rows[index - 1].rank : index + 1,
    }));
}

export function getEventSummaries(entries) {
  const byId = new Map();
  entries.forEach((entry) => {
    const current = byId.get(entry.eventId) || {
      eventId: entry.eventId,
      eventTitle: entry.eventTitle,
      date: entry.date,
      houses: Object.fromEntries(HOUSES.map((h) => [h.key, 0])),
      totalPoints: 0,
    };
    current.houses[entry.house] = (current.houses[entry.house] || 0) + entry.points;
    current.totalPoints += entry.points;
    if (entry.date > current.date) current.date = entry.date;
    byId.set(entry.eventId, current);
  });
  return [...byId.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getChampionshipHistory() {
  const response = await fetch(CHAMPIONSHIPS_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Couldn't load championship history.");
  return response.json();
}
