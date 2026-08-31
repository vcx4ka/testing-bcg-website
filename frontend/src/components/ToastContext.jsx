import React, { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  // status: "success" | "error" | "info"
  const showToast = useCallback(
    (message, status = "success", duration = 4000) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, status }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 1000,
          width: 340,
          maxWidth: "calc(100vw - 32px)",
        }}
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            style={{
              background: t.status === "error" ? "#fdecea" : t.status === "info" ? "#eef2ff" : "#eafaf1",
              border: `1px solid ${t.status === "error" ? "#f6c6c2" : t.status === "info" ? "#c7d2fe" : "#b7e4c7"}`,
              color: t.status === "error" ? "#8a231c" : t.status === "info" ? "#33379e" : "#186a41",
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: "0.88rem",
              fontFamily: "var(--font-body)",
              boxShadow: "0 8px 24px rgba(22,33,62,0.14)",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              animation: "bcg-toast-in 0.18s ease",
            }}
          >
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                fontSize: "1rem",
                lineHeight: 1,
                opacity: 0.6,
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes bcg-toast-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
