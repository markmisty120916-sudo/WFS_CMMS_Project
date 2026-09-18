import type { CSSProperties } from "react";

export const panelStyle: CSSProperties = {
  background: "#12081f",
  border: "1px solid #7c3aed",
  boxShadow: "0 0 18px #7c3aed66",
  borderRadius: "12px",
  padding: "16px",
  color: "#f5f3ff",
};

export const titleStyle: CSSProperties = {
  color: "#c084fc",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  margin: "0 0 12px 0",
};

export const mutedStyle: CSSProperties = { color: "#c4b5fd", margin: "4px 0" };

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
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
  marginRight: "8px",
};

export const dangerButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "#22d3ee",
};

export const rowStyle: CSSProperties = { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" };
