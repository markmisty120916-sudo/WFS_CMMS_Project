"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useMyWorkorders } from "../hooks/useMyWorkorders";
import { technicianWidgetLabel } from "../technician.widgets";

export function MyWorkorders() {
  const [status, setStatus] = useState("");
  const [asset_id, setAssetId] = useState("");
  const [severity, setSeverity] = useState("");
  const filter = useMemo(() => {
    return { status, asset_id, severity };
  }, [asset_id, severity, status]);
  const queue = useMyWorkorders(filter);

  if (queue.allowed === false) {
    return null;
  }

  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>{technicianWidgetLabel("my_workorders")}</h2>
      <div style={filterRowStyle}>
        <input
          style={inputStyle}
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
          }}
          placeholder="status"
        />
        <input
          style={inputStyle}
          value={asset_id}
          onChange={(event) => {
            setAssetId(event.target.value);
          }}
          placeholder="asset_id"
        />
        <input
          style={inputStyle}
          value={severity}
          onChange={(event) => {
            setSeverity(event.target.value);
          }}
          placeholder="severity"
        />
      </div>
      {queue.loading === true && queue.items.length === 0 ? <p style={mutedStyle}>loading</p> : null}
      <div style={listStyle}>
        {queue.items.map((item) => (
          <article key={item.workorder_id} style={cardStyle}>
            <a href={"/workorders/" + item.workorder_id} style={linkStyle}>
              {item.workorder_id}
            </a>
            <p style={mutedStyle}>asset {item.asset_id}</p>
            <p style={accentStyle}>{item.severity}</p>
            <p style={mutedStyle}>tech {item.routing_tech_id}</p>
            <p style={mutedStyle}>bay {item.routing_bay_id}</p>
            <p style={mutedStyle}>
              {item.scheduled_start} — {item.scheduled_end}
            </p>
            <p style={mutedStyle}>predictive {item.predictive_risk}</p>
            <p style={mutedStyle}>pm {item.pm_conflict}</p>
            <p style={mutedStyle}>{item.status}</p>
            <a href={"/hud?workorder_id=" + encodeURIComponent(item.workorder_id)} style={buttonStyle}>
              HUD Mode
            </a>
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

const filterRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  marginBottom: "12px",
};

const inputStyle: CSSProperties = {
  background: "#05010d",
  border: "1px solid #a855f7",
  color: "#f5f3ff",
  borderRadius: "8px",
  padding: "8px",
  flex: 1,
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

const buttonStyle: CSSProperties = {
  display: "inline-block",
  marginTop: "8px",
  color: "#05010d",
  background: "#c084fc",
  boxShadow: "0 0 12px #c084fc",
  borderRadius: "8px",
  padding: "8px 12px",
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
