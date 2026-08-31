import React from "react";
import { NavLink, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/points", label: "Points Table" },
  { to: "/championships", label: "Championship History" },
];

function linkStyle({ isActive }) { return { fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", color: isActive ? "var(--orange)" : "var(--muted)", padding: "6px 2px", borderBottom: isActive ? "2px solid var(--orange)" : "2px solid transparent", whiteSpace: "nowrap" }; }

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const narrow = useMediaQuery(theme.breakpoints.down("md"));
  return <AppBar position="static" elevation={0} sx={{ background: "var(--surface)", borderBottom: "1px solid var(--line)", color: "inherit" }}>
    <Toolbar disableGutters sx={{ minHeight: 72 }}><div className="page-shell" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 16 }}>
      <Link to="/" style={{ display: "flex", alignItems: "baseline", gap: 8, textDecoration: "none", minWidth: 0 }}><span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", color: "var(--navy-800)" }}>Bourne</span><span className="mono" style={{ fontSize: "0.75rem", color: "var(--orange)", fontWeight: 600, whiteSpace: "nowrap" }}>Community Groups</span></Link>
      {!narrow && <nav style={{ display: "flex", gap: 22 }}>{LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.end} style={linkStyle}>{l.label}</NavLink>)}</nav>}
      {narrow && <IconButton aria-label="Open menu" onClick={() => setOpen(true)} sx={{ color: "var(--navy-800)" }}><MenuIcon /></IconButton>}
    </div></Toolbar>
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}><div style={{ width: 260, paddingTop: 8 }}><div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 8px" }}><IconButton aria-label="Close menu" onClick={() => setOpen(false)}><CloseIcon /></IconButton></div><List>{LINKS.map((l) => <ListItemButton key={l.to} component={NavLink} to={l.to} end={l.end} onClick={() => setOpen(false)}><ListItemText primary={l.label} primaryTypographyProps={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", fontWeight: 600 }} /></ListItemButton>)}</List></div></Drawer>
  </AppBar>;
}
