"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useAssetManagerApi } from "../hooks/useAssetManagerApi";

export function PmScheduleEditor() {
  const api = useAssetManagerApi();
  const [rows, setRows] = useState<readonly Readonly<Record<string, unknown>>[]>([]);
  const [asset_id, setAssetId] = useState("");
  const [name, setName] = useState("");
  const [interval_miles, setMiles] = useState("");
  const [interval_hours, setHours] = useState("");

  useEffect(() => {
    void (async () => {
      const payload = (await api.request("GET", "/asset-manager/pm", {})) as { value?: readonly Readonly<Record<string, unknown>>[] } | null;
      if (payload && payload.value) {
        setRows(payload.value);
      }
    })();
  }, [api]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>PM Schedule Editor</h2>
      <input style={inputStyle} value={asset_id} onChange={(event) => setAssetId(event.target.value)} placeholder="asset_id" />
      <input style={inputStyle} value={name} onChange={(event) => setName(event.target.value)} placeholder="name" />
      <input style={inputStyle} value={interval_miles} onChange={(event) => setMiles(event.target.value)} placeholder="interval_miles" />
      <input style={inputStyle} value={interval_hours} onChange={(event) => setHours(event.target.value)} placeholder="interval_hours" />
      <button
        style={buttonStyle}
        type="button"
        onClick={() =>
          void api.request("POST", "/asset-manager/pm", {
            asset_id,
            name,
            interval_miles,
            interval_hours,
            due_miles: interval_miles,
            due_hours: interval_hours,
            status: "scheduled",
          })
        }
      >
        create
      </button>
      {rows.map((row) => (
        <p key={String(row.pm_schedule_id)} style={mutedStyle}>
          {String(row.asset_id)} {String(row.status)}
        </p>
      ))}
    </section>
  );
}

const panelStyle: CSSProperties = { background: "#12081f", border: "1px solid #7c3aed", borderRadius: "12px", padding: "16px", color: "#f5f3ff" };
const titleStyle: CSSProperties = { color: "#c084fc", textTransform: "uppercase" };
const mutedStyle: CSSProperties = { color: "#c4b5fd" };
const inputStyle: CSSProperties = { background: "#05010d", border: "1px solid #a855f7", color: "#f5f3ff", borderRadius: "8px", padding: "8px", width: "100%", marginBottom: "8px" };
const buttonStyle: CSSProperties = { color: "#05010d", background: "#c084fc", border: "none", borderRadius: "8px", padding: "10px 16px", fontWeight: 700 };
