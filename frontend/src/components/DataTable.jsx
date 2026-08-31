import React from "react";

/**
 * columns: [{ key, label, render?: (row) => node, mono?: boolean }]
 * rows: array of objects, each needs a stable `id` field passed via rowKey
 * actions: optional (row) => node, rendered as a final unlabeled column
 */
export default function DataTable({ columns, rows, rowKey = "id", actions, emptyMessage = "No records yet." }) {
  if (!rows.length) {
    return (
      <div
        className="card"
        style={{ padding: "40px 24px", textAlign: "center", color: "var(--muted)", fontSize: "0.92rem" }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="card" style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--line)" }}>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </th>
            ))}
            {actions && <th style={{ padding: "12px 16px" }} />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row[rowKey]}
              style={{
                borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--line)",
                background: i % 2 === 1 ? "var(--surface-alt)" : "transparent",
              }}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={c.mono ? "mono" : undefined}
                  style={{ padding: "12px 16px", color: "var(--ink)", whiteSpace: "nowrap" }}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
              {actions && (
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
