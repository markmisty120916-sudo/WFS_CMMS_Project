import type { CSSProperties } from "react";

export const shellStyle: CSSProperties = {
  minHeight: "100vh",
  margin: 0,
  background: "#05010d",
  color: "#f5f3ff",
  fontFamily: "Segoe UI, sans-serif",
};

export const headerStyle: CSSProperties = {
  borderBottom: "1px solid #7c3aed",
  padding: "16px 24px",
  color: "#c084fc",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

export const layoutStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "240px 1fr",
  minHeight: "calc(100vh - 64px)",
};

export const sidebarStyle: CSSProperties = {
  borderRight: "1px solid #6d28d9",
  padding: "16px",
};

export const linkStyle: CSSProperties = {
  display: "block",
  color: "#22d3ee",
  textDecoration: "none",
  fontWeight: 700,
  marginBottom: "12px",
};

export const mainStyle: CSSProperties = {
  padding: "24px",
};

export const panelStyle: CSSProperties = {
  background: "#12081f",
  border: "1px solid #7c3aed",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "16px",
};

export const mutedStyle: CSSProperties = { color: "#c4b5fd", margin: "8px 0" };

export const preStyle: CSSProperties = {
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  color: "#e9d5ff",
  fontSize: "12px",
};
