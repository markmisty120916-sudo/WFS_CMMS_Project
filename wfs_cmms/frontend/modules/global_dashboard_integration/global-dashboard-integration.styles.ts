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
export const linkStyle: CSSProperties = { color: "#22d3ee", textDecoration: "none", fontWeight: 700 };
export const cardStyle: CSSProperties = {
  background: "#05010d",
  border: "1px solid #6d28d9",
  borderRadius: "8px",
  padding: "12px",
  marginBottom: "8px",
};

export const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "16px",
};

export function severityColorStyle(color: string): CSSProperties {
  if (color === "red") {
    return { color: "#f87171", margin: "4px 0", fontWeight: 700 };
  }
  if (color === "orange") {
    return { color: "#fb923c", margin: "4px 0", fontWeight: 700 };
  }
  if (color === "yellow") {
    return { color: "#facc15", margin: "4px 0", fontWeight: 700 };
  }
  return { color: "#4ade80", margin: "4px 0", fontWeight: 700 };
}
