import React from "react";

export default function Loader({ label = "Loading…" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: "0.88rem", padding: "24px 0" }}>
      <span
        style={{
          width: 16,
          height: 16,
          border: "2px solid var(--line)",
          borderTopColor: "var(--orange)",
          borderRadius: "50%",
          display: "inline-block",
          animation: "bcg-spin 0.7s linear infinite",
        }}
      />
      {label}
      <style>{`@keyframes bcg-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
