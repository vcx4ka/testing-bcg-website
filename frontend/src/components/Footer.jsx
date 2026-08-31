import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return <footer style={{ background: "var(--navy-900)", color: "#c9d2e3", marginTop: 64 }}>
    <div className="page-shell" style={{ paddingTop: 32, paddingBottom: 32, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
      <div><div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#fff", marginBottom: 4 }}>Bourne Community Groups</div><div style={{ fontSize: "0.82rem" }}>UVA School of Data Science · Undergraduate Council</div></div>
      <Link to="/officer/upload" style={{ color: "#6f82a8", textDecoration: "none", fontSize: "0.76rem" }}>Officer tools</Link>
    </div>
  </footer>;
}
