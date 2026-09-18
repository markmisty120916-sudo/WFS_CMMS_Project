"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useAssetManagerApi } from "../hooks/useAssetManagerApi";

export function ConfigurationPackBuilder() {
  const api = useAssetManagerApi();
  const [name, setName] = useState("");
  const [pm_template_name, setTemplate] = useState("");
  const [interval_miles, setMiles] = useState("");
  const [interval_hours, setHours] = useState("");
  const [severity_default, setSeverity] = useState("S3");
  const [packs, setPacks] = useState<readonly Readonly<Record<string, unknown>>[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request("GET", "/asset-manager/packs", {})) as { value?: readonly Readonly<Record<string, unknown>>[] } | null;
      if (payload && payload.value) {
        setPacks(payload.value);
      }
    })();
  }, [api]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>Configuration Pack Builder</h2>
      <input style={inputStyle} value={name} onChange={(event) => setName(event.target.value)} placeholder="name" />
      <input style={inputStyle} value={pm_template_name} onChange={(event) => setTemplate(event.target.value)} placeholder="pm_template_name" />
      <input style={inputStyle} value={interval_miles} onChange={(event) => setMiles(event.target.value)} placeholder="interval_miles" />
      <input style={inputStyle} value={interval_hours} onChange={(event) => setHours(event.target.value)} placeholder="interval_hours" />
      <select style={inputStyle} value={severity_default} onChange={(event) => setSeverity(event.target.value)}>
        <option value="S1">S1</option>
        <option value="S2">S2</option>
        <option value="S3">S3</option>
        <option value="S4">S4</option>
        <option value="S5">S5</option>
      </select>
      <button
        style={buttonStyle}
        type="button"
        onClick={() =>
          void api.request("POST", "/asset-manager/packs", {
            name,
            pm_template_name,
            interval_miles,
            interval_hours,
            severity_default,
            workorder_source: "pm",
            telematics_fault_code: "",
            telematics_severity: "",
          })
        }
      >
        create pack
      </button>
      {packs.map((pack) => (
        <p key={String(pack.pack_id)} style={mutedStyle}>
          {String(pack.name)}
          <button style={buttonStyle} type="button" onClick={() => void api.request("POST", "/asset-manager/packs/" + String(pack.pack_id) + "/apply", {})}>
            apply
          </button>
        </p>
      ))}
    </section>
  );
}

const panelStyle: CSSProperties = { background: "#12081f", border: "1px solid #7c3aed", borderRadius: "12px", padding: "16px", color: "#f5f3ff" };
const titleStyle: CSSProperties = { color: "#c084fc", textTransform: "uppercase" };
const mutedStyle: CSSProperties = { color: "#c4b5fd" };
const inputStyle: CSSProperties = { background: "#05010d", border: "1px solid #a855f7", color: "#f5f3ff", borderRadius: "8px", padding: "8px", width: "100%", marginBottom: "8px" };
const buttonStyle: CSSProperties = { color: "#05010d", background: "#c084fc", border: "none", borderRadius: "8px", padding: "8px 12px", fontWeight: 700, marginLeft: "8px" };
