import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { getStandings, getPointEntries, getEventSummaries } from "../api/dataApi.js";
import { HOUSES } from "../api/mockData.js";
import HouseBadge from "../components/HouseBadge.jsx";
import Loader from "../components/Loader.jsx";

export default function Leaderboard() {
  const [standings, setStandings] = useState(null);
  const [recentEvent, setRecentEvent] = useState(null);

  useEffect(() => {
    Promise.all([getStandings(), getPointEntries()])
      .then(([s, entries]) => {
        setStandings(s);
        setRecentEvent(getEventSummaries(entries)[0] || null);
      })
      .catch(() => { setStandings([]); setRecentEvent(null); });
  }, []);

  return <div className="page-shell section">
    <div className="eyebrow" style={{ marginBottom: 10 }}>House Cup</div>
    <h1 style={{ fontSize: "2rem", marginBottom: 28 }}>Standings</h1>
    {standings === null ? <Loader label="Loading standings…" /> : <Grid container spacing={2} sx={{ marginBottom: 6 }}>
      {[...standings].sort((a, b) => a.rank - b.rank).map((s) => {
        const h = HOUSES.find((x) => x.key === s.house);
        return <Grid key={s.house} size={{ xs: 12, sm: 6 }}><div className="card" style={{ padding: 24, display: "flex", alignItems: "center", gap: 18, border: s.rank === 1 ? `1.5px solid ${h?.color}` : undefined }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: h?.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-mono)", fontWeight: 700 }}>#{s.rank}</div>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{h?.label || s.house}</div><div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{s.rank === 1 ? "Leading the House Cup" : "Chasing the leader"}</div></div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy-800)" }}>{s.points.toLocaleString()}</div>
        </div></Grid>;
      })}
    </Grid>}

    <div className="eyebrow" style={{ marginBottom: 10 }}>Latest result</div>
    <h2 style={{ fontSize: "1.25rem", marginBottom: 16 }}>{recentEvent?.eventTitle || "No completed events yet"}</h2>
    {recentEvent ? <div className="card">
      <div style={{ padding: "14px 18px", color: "var(--muted)", fontSize: "0.82rem", borderBottom: "1px solid var(--line)" }}>{formatDate(recentEvent.date)}</div>
      {HOUSES.map((h, i) => <div key={h.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: i === HOUSES.length - 1 ? "none" : "1px solid var(--line)" }}>
        <HouseBadge house={h.key} size="sm" /><span style={{ flex: 1 }}>{h.label}</span><span className="mono" style={{ fontWeight: 700 }}>+{(recentEvent.houses[h.key] || 0).toLocaleString()}</span>
      </div>)}
    </div> : <div className="card" style={{ padding: 24, color: "var(--muted)" }}>No completed events yet.</div>}
  </div>;
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
