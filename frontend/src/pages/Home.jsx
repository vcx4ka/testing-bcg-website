import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { getStandings, getPointEntries, getEventSummaries } from "../api/dataApi.js";
import { HOUSES } from "../api/mockData.js";
import HouseBadge from "../components/HouseBadge.jsx";
import Loader from "../components/Loader.jsx";

export default function Home() {
  const [standings, setStandings] = useState(null);
  const [recentEvent, setRecentEvent] = useState(null);

  useEffect(() => {
    Promise.all([getStandings(), getPointEntries()])
      .then(([s, entries]) => {
        setStandings(s);
        setRecentEvent(getEventSummaries(entries)[0] || null);
      })
      .catch(() => {
        setStandings([]);
        setRecentEvent(null);
      });
  }, []);

  return (
    <div>
      <section style={{ background: "var(--navy-900)", color: "#fff" }}>
        <div className="page-shell" style={{ paddingTop: "clamp(48px, 10vw, 88px)", paddingBottom: "clamp(40px, 8vw, 64px)" }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>UDSC · A community initiative</div>
          <h1 style={{ fontSize: "clamp(1.9rem, 5vw, 2.6rem)", maxWidth: 640, marginBottom: 18 }}>Four houses. One community. One Cup.</h1>
          <p style={{ fontSize: "1.05rem", color: "#c9d2e3", maxWidth: 560, marginBottom: 32 }}>
            Bourne Community Groups is a community-building initiative of the University of Virginia School of Data Science. Every student belongs to a house — this is where the year's story gets tallied, point by point.
          </p>
          <Link to="/leaderboard" className="btn btn-primary">See the standings</Link>
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ fontSize: "1.4rem" }}>Right now in the House Cup</h2>
            <Link to="/leaderboard" style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--orange)", textDecoration: "none" }}>Full leaderboard →</Link>
          </div>
          {standings === null ? <Loader label="Loading standings…" /> : (
            <Grid container spacing={2}>
              {HOUSES.map((h) => {
                const s = standings.find((x) => x.house === h.key);
                return <Grid key={h.key} size={{ xs: 6, sm: 3 }}><div className="card" style={{ padding: 20, height: "100%" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: h.color, display: "inline-block", marginBottom: 10 }} />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h.label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.6rem", fontWeight: 600, color: "var(--navy-800)" }}>{s?.points?.toLocaleString() ?? "—"}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>points · rank #{s?.rank ?? "–"}</div>
                </div></Grid>;
              })}
            </Grid>
          )}
        </div>
      </section>

      <section className="section" style={{ background: "var(--surface-alt)" }}>
        <div className="page-shell">
          <div className="eyebrow" style={{ marginBottom: 10 }}>Most recent event</div>
          <h2 style={{ fontSize: "1.4rem", marginBottom: 18 }}>{recentEvent?.eventTitle || "No completed events yet"}</h2>
          {recentEvent && <>
            <p style={{ color: "var(--muted)", marginBottom: 18 }}>{formatDate(recentEvent.date)} · {recentEvent.totalPoints.toLocaleString()} total points awarded</p>
            <div className="card" style={{ overflow: "hidden" }}>
              {HOUSES.map((h, i) => <div key={h.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: i === HOUSES.length - 1 ? "none" : "1px solid var(--line)" }}>
                <HouseBadge house={h.key} size="sm" />
                <span style={{ flex: 1 }}>{h.label}</span>
                <span className="mono" style={{ fontWeight: 700 }}>+{(recentEvent.houses[h.key] || 0).toLocaleString()}</span>
              </div>)}
            </div>
          </>}
        </div>
      </section>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
