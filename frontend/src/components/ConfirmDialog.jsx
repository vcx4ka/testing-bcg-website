import React from "react";
import Modal from "./Modal.jsx";

export default function ConfirmDialog({ open, title, message, confirmLabel = "Delete", busy = false, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} width={420}>
      <p style={{ color: "var(--muted)", fontSize: "0.92rem" }}>{message}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
        <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
          {busy ? "Deleting…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
