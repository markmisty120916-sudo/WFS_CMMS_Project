"use client";

import type { CSSProperties } from "react";
import { useAssetHealth } from "../hooks/useAssetHealth";
import { masterTechWidgetLabel } from "../master-tech.widgets";

export function AssetHealthPanel() {
  const health = useAssetHealth();

  if (health.allowed === false) {
    return null;
  }

  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>{masterTechWidgetLabel("asset_health")}</h2>
      {health.loading === true && health.items.length === 0 ? <p style={mutedStyle}>loading</p> : null}
      <div style={listStyle}>
        {health.items.map((item) => (
          <article key={item.asset_id} style={cardStyle}>
            <a href={"/assets/" + item.asset_id} style={linkStyle}>
              {item.unit_number || item.asset_id}
            </a>
            <p style={mutedStyle}>{item.status}</p>
            <p style={accentStyle}>health {item.health_score}</p>
            <p style={mutedStyle}>predictive {item.predictive_score}</p>
            <p style={mutedStyle}>{item.last_update}</p>
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

const linkStyle: CSSProperties = {
  color: "#22d3ee",
  textDecoration: "none",
  fontWeight: 700,
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
