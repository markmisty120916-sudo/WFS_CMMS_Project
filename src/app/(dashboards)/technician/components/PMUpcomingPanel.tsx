"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import { useMyWorkorders } from "../hooks/useMyWorkorders";
import { usePMUpcoming } from "../hooks/usePMUpcoming";
import { technicianWidgetLabel } from "../technician.widgets";

export function PMUpcomingPanel() {
  const filter = useMemo(() => {
    return { status: "", asset_id: "", severity: "" };
  }, []);
  const queue = useMyWorkorders(filter);
  const pm = usePMUpcoming(queue.items);

  if (pm.allowed === false) {
    return null;
  }

  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>{technicianWidgetLabel("pm_upcoming")}</h2>
      {pm.loading === true && pm.items.length === 0 ? <p style={mutedStyle}>loading</p> : null}
      <div style={listStyle}>
        {pm.items.map((item) => (
          <article key={item.pm_schedule_id} style={cardStyle}>
            <p style={accentStyle}>{item.status}</p>
            <p style={mutedStyle}>schedule {item.pm_schedule_id}</p>
            <p style={mutedStyle}>asset {item.asset_id}</p>
            <p style={mutedStyle}>template {item.pm_template_id}</p>
            <p style={mutedStyle}>due miles {item.due_miles}</p>
            <p style={mutedStyle}>due hours {item.due_hours}</p>
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
