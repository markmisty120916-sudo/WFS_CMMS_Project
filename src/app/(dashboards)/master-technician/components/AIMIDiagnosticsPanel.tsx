"use client";

import type { CSSProperties } from "react";
import { useAIMIDiagnostics } from "../hooks/useAIMIDiagnostics";
import { masterTechWidgetLabel } from "../master-tech.widgets";

export function AIMIDiagnosticsPanel() {
  const feed = useAIMIDiagnostics();

  if (feed.allowed === false) {
    return null;
  }

  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>{masterTechWidgetLabel("aimi_diagnostics")}</h2>
      {feed.loading === true && feed.items.length === 0 ? <p style={mutedStyle}>loading</p> : null}
      <div style={listStyle}>
        {feed.items.map((item) => (
          <article key={item.diagnostic_flow_id + item.timestamp} style={cardStyle}>
            <p style={accentStyle}>{item.diagnostic_path}</p>
            <p style={mutedStyle}>flow {item.diagnostic_flow_id}</p>
            <p style={mutedStyle}>workorder {item.workorder_id}</p>
            <p style={mutedStyle}>step {item.current_step_id}</p>
            <p style={mutedStyle}>{item.diagnostic_reason}</p>
            <p style={mutedStyle}>{item.verification_complete === true ? "verified" : "unverified"}</p>
            <p style={mutedStyle}>{item.timestamp}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const panelStyle: CSSProperties = {
  background: "#12081f",
  border: "1px solid #7c3aed",
  boxShadow: "0 0 18px #7c3aed66",
  borderRadius: "12px",
  padding: "16px",
  color: "#f5f3ff",
  minHeight: "220px",
};

const titleStyle: CSSProperties = {
  color: "#c084fc",
  margin: "0 0 12px 0",
  fontSize: "18px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
};

const cardStyle: CSSProperties = {
  background: "#05010d",
  border: "1px solid #6d28d9",
  borderRadius: "8px",
  padding: "12px",
};

const mutedStyle: CSSProperties = {
  margin: "4px 0",
  color: "#c4b5fd",
};

const accentStyle: CSSProperties = {
  margin: "4px 0",
  color: "#22d3ee",
  fontWeight: 700,
};
