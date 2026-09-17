"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import { useMyWorkorders } from "../hooks/useMyWorkorders";
import { usePartsNeeded } from "../hooks/usePartsNeeded";
import { technicianWidgetLabel } from "../technician.widgets";

export function PartsNeededPanel() {
  const filter = useMemo(() => {
    return { status: "", asset_id: "", severity: "" };
  }, []);
  const queue = useMyWorkorders(filter);
  const parts = usePartsNeeded(queue.items);

  if (parts.allowed === false) {
    return null;
  }

  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>{technicianWidgetLabel("parts_needed")}</h2>
      {parts.loading === true && parts.items.length === 0 ? <p style={mutedStyle}>loading</p> : null}
      <div style={listStyle}>
        {parts.items.map((item) => (
          <article key={item.request_id} style={cardStyle}>
            <p style={accentStyle}>{item.status}</p>
            <p style={mutedStyle}>request {item.request_id}</p>
            <p style={mutedStyle}>workorder {item.workorder_id}</p>
            <p style={mutedStyle}>part {item.part_id}</p>
            <p style={mutedStyle}>qty {item.quantity}</p>
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
