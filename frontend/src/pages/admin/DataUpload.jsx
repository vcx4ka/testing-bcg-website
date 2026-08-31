import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function DataUpload() {
  const [formFile, setFormFile] = useState(null);
  const [rosterFile, setRosterFile] = useState(null);
  const [event, setEvent] = useState({ id: "", name: "", date: "", points: 1 });
  const [result, setResult] = useState(null);

  async function buildFallback(e) {
    e.preventDefault();
    setResult(null);
    if (!formFile || !rosterFile || !event.id.trim() || !event.name.trim() || !event.date) {
      setResult({ error: "Provide the Forms export, student roster CSV, event ID, event name, and event date." });
      return;
    }
    try {
      const workbook = XLSX.read(await formFile.arrayBuffer(), { type: "array", cellDates: true });
      const forms = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
      const rosterText = await rosterFile.text();
      const rosterRows = parseSimpleCsv(rosterText);
      const roster = new Map(rosterRows.map((r) => [String(r.email || "").trim().toLowerCase(), String(r.house_name || "").trim()]));
      const emailHeader = Object.keys(forms[0] || {}).find((h) => h.toLowerCase().includes("email"));
      if (!emailHeader) throw new Error('Could not find an email column in the Forms export.');
      const rows = forms.map((r) => {
        const email = String(r[emailHeader] || "").trim().toLowerCase();
        return { email, house: roster.get(email) || "", points: Number(event.points) || 0 };
      }).filter((r) => r.email && r.house);
      const csv = ["event_id,event_name,date,house,points", ...rows.map((r) => [event.id, event.name, event.date, r.house, r.points].map(csvEscape).join(","))].join("\n") + "\n";
      setResult({ count: rows.length, csv, note: "This fallback tool only creates a public-safe CSV in your browser. It does not upload anything or publish student data." });
    } catch (err) { setResult({ error: err.message || "Couldn't create the fallback export." }); }
  }

  function download() {
    const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${event.id.trim()}-public-points.csv`; a.click(); URL.revokeObjectURL(url);
  }

  return <div className="page-shell section" style={{ maxWidth: 680 }}>
    <div className="eyebrow" style={{ marginBottom: 10 }}>Officer tools · fallback</div>
    <h1 style={{ fontSize: "1.6rem", marginBottom: 8 }}>Manual Excel export</h1>
    <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 18 }}>The normal path is the automated Microsoft Forms → Power Automate pipeline. This page is a backup for a less-technical officer: it joins a Forms export to the private roster entirely in the browser and produces a public-safe CSV. It never sends the roster or student identifiers to the website.</p>
    <form onSubmit={buildFallback} className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <Field label="Microsoft Forms export (.xlsx)"><input required type="file" accept=".xlsx" onChange={(e) => setFormFile(e.target.files?.[0] || null)} /></Field>
      <Field label="Private student roster (.csv)"><input required type="file" accept=".csv,text/csv" onChange={(e) => setRosterFile(e.target.files?.[0] || null)} /></Field>
      <Field label="Event ID"><input required style={inputStyle} value={event.id} onChange={(e) => setEvent({ ...event, id: e.target.value })} placeholder="BCG-2026-001" /></Field>
      <Field label="Event name"><input required style={inputStyle} value={event.name} onChange={(e) => setEvent({ ...event, name: e.target.value })} placeholder="Community Dinner" /></Field>
      <Field label="Event date"><input required type="date" style={inputStyle} value={event.date} onChange={(e) => setEvent({ ...event, date: e.target.value })} /></Field>
      <Field label="Points per participant"><input required type="number" min="0" style={inputStyle} value={event.points} onChange={(e) => setEvent({ ...event, points: Number(e.target.value) })} /></Field>
      <button className="btn btn-primary" type="submit">Create public-safe CSV</button>
    </form>
    {result?.error && <div className="card" style={{ marginTop: 18, padding: 18, color: "var(--danger)" }}>{result.error}</div>}
    {result?.csv && <div className="card" style={{ marginTop: 18, padding: 18 }}><strong>{result.count} rows prepared.</strong><p style={{ color: "var(--muted)", fontSize: "0.86rem", margin: "8px 0 14px" }}>{result.note}</p><button className="btn btn-secondary" onClick={download}>Download CSV</button></div>}
  </div>;
}

function Field({ label, children }) { return <label style={{ display: "block" }}><span style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 6 }}>{label}</span>{children}</label>; }
const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", fontSize: "0.9rem", fontFamily: "var(--font-body)" };
function csvEscape(value) { const s = String(value ?? ""); return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s; }
function parseSimpleCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean); if (!lines.length) return [];
  const parse = (line) => line.split(",").map((x) => x.trim().replace(/^"|"$/g, ""));
  const headers = parse(lines[0]); return lines.slice(1).map((line) => Object.fromEntries(parse(line).map((v, i) => [headers[i], v])));
}
