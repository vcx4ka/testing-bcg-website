import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import PointsLookup from "./pages/PointsLookup.jsx";
import ChampionshipHistory from "./pages/ChampionshipHistory.jsx";
import DataUpload from "./pages/admin/DataUpload.jsx";
import ChampionshipUpload from "./pages/admin/ChampionshipUpload.jsx";

function OfficerTabs() {
  const tabStyle = ({ isActive }) => ({
    fontSize: "0.85rem",
    fontWeight: 600,
    textDecoration: "none",
    color: isActive ? "var(--orange)" : "var(--muted)",
    padding: "8px 4px",
    borderBottom: isActive ? "2px solid var(--orange)" : "2px solid transparent",
  });
  return (
    <div style={{ background: "var(--surface-alt)", borderBottom: "1px solid var(--line)" }}>
      <div className="page-shell" style={{ display: "flex", gap: 24, paddingTop: 14 }}>
        <NavLink to="/officer/upload" style={tabStyle}>Upload Excel (fallback)</NavLink>
        <NavLink to="/officer/championships" style={tabStyle}>Championship history</NavLink>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/points" element={<PointsLookup />} />
          <Route path="/championships" element={<ChampionshipHistory />} />
          <Route path="/officer/upload" element={<><OfficerTabs /><DataUpload /></>} />
          <Route path="/officer/championships" element={<><OfficerTabs /><ChampionshipUpload /></>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
