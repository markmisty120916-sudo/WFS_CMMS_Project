import type { CSSProperties } from "react";

export const panelStyle: CSSProperties = {
  background: "#12081f",
  border: "1px solid #7c3aed",
  boxShadow: "0 0 18px #7c3aed66",
  borderRadius: "12px",
  padding: "20px",
  color: "#f5f3ff",
  minHeight: "220px",
};

export const alertOverrideStyle: CSSProperties = {
  background: "#1a0510",
  border: "2px solid #fb7185",
  boxShadow: "0 0 28px #fb718588",
  borderRadius: "12px",
  padding: "20px",
  color: "#fff1f2",
  minHeight: "180px",
  marginBottom: "16px",
};

export const titleStyle: CSSProperties = {
  color: "#c084fc",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  margin: "0 0 12px 0",
  fontSize: "1.05rem",
};

export const mutedStyle: CSSProperties = { color: "#c4b5fd", margin: "8px 0", fontSize: "1rem" };
export const accentStyle: CSSProperties = { color: "#22d3ee", margin: "8px 0", fontWeight: 700, fontSize: "1.05rem" };

export const inputStyle: CSSProperties = {
  background: "#05010d",
  border: "1px solid #a855f7",
  color: "#f5f3ff",
  borderRadius: "10px",
  padding: "14px",
  width: "100%",
  marginBottom: "10px",
  fontSize: "1rem",
  minHeight: "48px",
};

export const buttonStyle: CSSProperties = {
  color: "#05010d",
  background: "#c084fc",
  border: "none",
  borderRadius: "10px",
  padding: "16px 20px",
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-block",
  marginRight: "8px",
  marginTop: "8px",
  fontSize: "1rem",
  minHeight: "52px",
  minWidth: "160px",
  cursor: "pointer",
};

export const cardStyle: CSSProperties = {
  background: "#05010d",
  border: "1px solid #6d28d9",
  borderRadius: "10px",
  padding: "14px",
  marginBottom: "10px",
};

export const stackStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: "16px" };
