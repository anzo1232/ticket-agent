"use client";
import { useEffect } from "react";

export default function Modal({ title, onClose, children, width = 520 }) {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{
        background: "#1a1d27", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14, padding: "28px 30px",
        width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 6, width: 28, height: 28, cursor: "pointer", color: "#94a3b8", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
