import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { getChampionshipHistory } from "../api/dataApi.js";
import Loader from "../components/Loader.jsx";

export default function ChampionshipHistory() {
  const [records, setRecords] = useState(null);
  useEffect(() => { getChampionshipHistory().then(setRecords).catch(() => setRecords([])); }, []);
  return <div className="page-shell section">
    <div className="eyebrow" style={{ marginBottom: 10 }}>Hall of fame</div>
    <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>Championship history</h1>
    <p style={{ color: "var(--muted)", maxWidth: 650, marginBottom: 28 }}>A permanent record of House Cup champions. Championship records live in the public GitHub repository alongside the site, which makes an annual update simple and transparent.</p>
    {records === null ? <Loader label="Loading history…" /> : records.length === 0 ? <div className="card" style={{ padding: 32, color: "var(--muted)" }}>No champions have been added yet — this page will fill in after the first House Cup Celebration.</div> : <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>{[...records].sort((a,b) => String(b.year).localeCompare(String(a.year))).map((r) => <Box key={r.year} className="card" sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2.75, padding: 2.75 }}>
      <div style={{ width: 140, height: 140, borderRadius: "var(--radius-sm)", background: r.image ? `url(${import.meta.env.BASE_URL}${r.image}) center/cover` : "var(--surface-alt)", flexShrink: 0, border: "1px solid var(--line)" }} />
      <div style={{ flex: 1 }}><div className="mono" style={{ fontSize: "0.78rem", color: "var(--orange)", fontWeight: 700, marginBottom: 4 }}>{r.year}</div><h2 style={{ fontSize: "1.3rem", marginBottom: 8 }}>{r.house}</h2><p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: 12 }}>{r.description}</p><div style={{ display: "flex", gap: 24, fontSize: "0.82rem", flexWrap: "wrap" }}><span><strong>Faculty/Staff Head:</strong> {r.houseHead}</span><span><strong>Student Head:</strong> {r.studentLeader}</span></div></div>
    </Box>)}</div>}
  </div>;
}
