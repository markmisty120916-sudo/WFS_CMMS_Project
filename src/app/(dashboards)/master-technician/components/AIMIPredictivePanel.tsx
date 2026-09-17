"use client";

import type { CSSProperties } from "react";
import { useAIMIPredictive } from "../hooks/useAIMIPredictive";
import { masterTechWidgetLabel } from "../master-tech.widgets";

export function AIMIPredictivePanel() {
  const feed = useAIMIPredictive();

  if (feed.allowed === false) {
    return null;
  }

  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>{masterTechWidgetLabel("aimi_predictive")}</h2>
      {feed.loading === true && feed.items.length === 0 ? <p style={mutedStyle}>loading</p> : null}
      <div style={listStyle}>
        {feed.items.map((item) => (
          <article key={item.asset_id + item.timestamp} style={cardStyle}>
            <p style={accentStyle}>{item.failure_risk}</p>
            <p style={mutedStyle}>asset {item.asset_id}</p>
            <p style={mutedStyle}>workorder {item.workorder_id}</p>
            <p style={mutedStyle}>score {item.predictive_score}</p>
            <p style={mutedStyle}>{item.predictive_reason}</p>
            <p style={mutedStyle}>{item.timestamp}</p>
          </article>
        ))}
      </div>
      <h3 style={subTitleStyle}>{masterTechWidgetLabel("aimi_insight_feed")}</h3>
      <div style={listStyle}>
        {feed.insights.map((item) => (
          <article key={item.insight_id} style={cardStyle}>
            <p style={accentStyle}>{item.insight_type}</p>
            <p style={mutedStyle}>asset {item.asset_id}</p>
            <p style={mutedStyle}>workorder {item.workorder_id}</p>
            <p style={mutedStyle}>{item.reason}</p>
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

const subTitleStyle: CSSProperties = {
  color: "#22d3ee",
  margin: "16px 0 8px 0",
  fontSize: "14px",
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
