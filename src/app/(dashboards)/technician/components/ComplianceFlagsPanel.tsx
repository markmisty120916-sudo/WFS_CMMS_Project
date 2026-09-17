"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import { useComplianceFlags } from "../hooks/useComplianceFlags";
import { useMyWorkorders } from "../hooks/useMyWorkorders";
import { technicianWidgetLabel } from "../technician.widgets";

export function ComplianceFlagsPanel() {
  const filter = useMemo(() => {
    return { status: "", asset_id: "", severity: "" };
  }, []);
  const queue = useMyWorkorders(filter);
  const flags = useComplianceFlags(queue.items);

  if (flags.allowed === false) {
    return null;
  }

  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>{technicianWidgetLabel("compliance_flags")}</h2>
      {flags.loading === true && flags.items.length === 0 ? <p style={mutedStyle}>loading</p> : null}
      <div style={listStyle}>
        {flags.items.map((item) => (
          <article key={item.workorder_id + item.flag_type + item.timestamp} style={cardStyle}>
            <p style={accentStyle}>{item.flag_type}</p>
            <p style={mutedStyle}>workorder {item.workorder_id}</p>
            <p style={mutedStyle}>asset {item.asset_id}</p>
            <p style={mutedStyle}>{item.status}</p>
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
