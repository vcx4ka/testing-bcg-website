import React from "react";

export default function ChampionshipUpload() {
  return <div className="page-shell section" style={{ maxWidth: 680 }}>
    <div className="eyebrow" style={{ marginBottom: 10 }}>Officer tools · annual update</div>
    <h1 style={{ fontSize: "1.6rem", marginBottom: 8 }}>Update championship history</h1>
    <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 24 }}>Because this changes only once a year, the cleanest and most reliable approach is to edit the public GitHub repository directly rather than maintain another database or upload service.</p>
    <div className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: "1.1rem", marginBottom: 12 }}>Add the champion</h2>
      <ol style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.7, paddingLeft: 22 }}>
        <li>Open <code>data/championships.json</code> in the GitHub repository.</li>
        <li>Add one object with <code>year</code>, <code>house</code>, <code>houseHead</code>, <code>studentLeader</code>, <code>description</code>, and optional <code>image</code>.</li>
        <li>If using a photo, add it to <code>frontend/public/champions/</code> and set <code>image</code> to <code>champions/filename.jpg</code>.</li>
        <li>Commit the changes to <code>main</code>. GitHub Actions will rebuild the site automatically.</li>
      </ol>
      <p style={{ marginTop: 18, fontSize: "0.82rem", color: "var(--muted)" }}>This page is intentionally instructional rather than a second write path. The repository itself is the source of truth for championship history.</p>
    </div>
  </div>;
}
