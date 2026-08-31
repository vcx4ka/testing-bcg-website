import React, { useEffect, useMemo, useState } from "react";
import { getPointEntries, getEventSummaries } from "../api/dataApi.js";
import { HOUSES } from "../api/mockData.js";
import HouseBadge from "../components/HouseBadge.jsx";
import Loader from "../components/Loader.jsx";

export default function PointsLookup() {
  const [entries, setEntries] = useState(null);
  const [eventId, setEventId] = useState("");

  useEffect(() => { getPointEntries().then(setEntries).catch(() => setEntries([])); }, []);

  const events = useMemo(() => entries ? getEventSummaries(entries) : [], [entries]);
  const selected = events.find((e) => e.eventId === eventId) || events[0];
  useEffect(() => { if (!eventId && events[0]) setEventId(events[0].eventId); }, [events, eventId]);

  return <div className="page-shell section">
    <div className="eyebrow" style={{ marginBottom: 10 }}>Transparency</div>
    <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>Points by event</h1>
    <p style={{ color: "var(--muted)", marginBottom: 28, maxWidth: 640 }}>Compare how many points each house earned at any completed event. Individual student records are never published.</p>

    {entries === null ? <Loader label="Loading events…" /> : events.length === 0 ? <div className="card" style={{ padding: 24, color: "var(--muted)" }}>No completed events yet.</div> : <>
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 8 }} htmlFor="event-select">Compare an event</label>
        <select id="event-select" value={selected?.eventId || ""} onChange={(e) => setEventId(e.target.value)} style={inputStyle}>
          {events.map((event) => <option key={event.eventId} value={event.eventId}>{event.eventTitle} · {formatDate(event.date)}</option>)}
        </select>
      </div>

      {selected && <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: 20, borderBottom: "1px solid var(--line)" }}><h2 style={{ fontSize: "1.2rem", marginBottom: 5 }}>{selected.eventTitle}</h2><span className="mono" style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{formatDate(selected.date)} · {selected.totalPoints.toLocaleString()} total points</span></div>
        {HOUSES.map((h, i) => <div key={h.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 20px", borderBottom: i === HOUSES.length - 1 ? "none" : "1px solid var(--line)" }}><HouseBadge house={h.key} size="sm" /><span style={{ flex: 1 }}>{h.label}</span><span className="mono" style={{ fontWeight: 700, fontSize: "1.05rem" }}>+{(selected.houses[h.key] || 0).toLocaleString()}</span></div>)}
      </div>
      }
    </>}
  </div>;
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", fontSize: "0.9rem", fontFamily: "var(--font-body)" };
