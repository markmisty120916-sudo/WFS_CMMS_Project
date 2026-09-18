import type { CSSProperties } from "react";

export const panelStyle: CSSProperties = {
  background: "#12081f",
  border: "1px solid #7c3aed",
  boxShadow: "0 0 18px #7c3aed66",
  borderRadius: "12px",
  padding: "16px",
  color: "#f5f3ff",
  minHeight: "220px",
};

export const titleStyle: CSSProperties = {
  color: "#c084fc",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  margin: "0 0 12px 0",
};

export const mutedStyle: CSSProperties = { color: "#c4b5fd", margin: "4px 0" };
export const accentStyle: CSSProperties = { color: "#22d3ee", margin: "4px 0", fontWeight: 700 };

export const inputStyle: CSSProperties = {
  background: "#05010d",
  border: "1px solid #a855f7",
  color: "#f5f3ff",
  borderRadius: "8px",
  padding: "8px",
  width: "100%",
  marginBottom: "8px",
};

export const buttonStyle: CSSProperties = {
  color: "#05010d",
  background: "#c084fc",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-block",
  marginRight: "8px",
};

export const linkStyle: CSSProperties = { color: "#22d3ee", textDecoration: "none", fontWeight: 700 };
export const filterRowStyle: CSSProperties = { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" };
export const cardStyle: CSSProperties = { background: "#05010d", border: "1px solid #6d28d9", borderRadius: "8px", padding: "12px", marginBottom: "8px" };
