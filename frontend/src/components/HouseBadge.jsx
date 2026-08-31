import React from "react";
import { HOUSES } from "../api/mockData.js";

export default function HouseBadge({ house, size = "md" }) {
  const info = HOUSES.find((h) => h.key === house) || { label: house, mascot: "", color: "var(--muted)" };
  const small = size === "sm";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-mono)",
        fontSize: small ? "0.72rem" : "0.8rem",
        fontWeight: 600,
        color: "var(--ink)",
        background: "var(--surface-alt)",
        border: "1px solid var(--line)",
        borderRadius: 999,
        padding: small ? "2px 8px" : "4px 10px",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: info.color, flexShrink: 0 }} />
      {info.label}
    </span>
  );
}
