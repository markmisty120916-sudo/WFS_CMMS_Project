"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useAssetManagerApi } from "../hooks/useAssetManagerApi";

export function AssetEditor() {
  const api = useAssetManagerApi();
  const [rows, setRows] = useState<readonly Readonly<Record<string, unknown>>[]>([]);
  const [vin, setVin] = useState("");
  const [unit_number, setUnit] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    void (async () => {
      const payload = (await api.request("GET", "/asset-manager/assets", {})) as { value?: readonly Readonly<Record<string, unknown>>[] } | null;
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
      <h2 style={titleStyle}>Asset Editor</h2>
      <input style={inputStyle} value={vin} onChange={(event) => setVin(event.target.value)} placeholder="vin" />
      <input style={inputStyle} value={unit_number} onChange={(event) => setUnit(event.target.value)} placeholder="unit_number" />
      <input style={inputStyle} value={make} onChange={(event) => setMake(event.target.value)} placeholder="make" />
      <input style={inputStyle} value={model} onChange={(event) => setModel(event.target.value)} placeholder="model" />
      <input style={inputStyle} value={year} onChange={(event) => setYear(event.target.value)} placeholder="year" />
      <button
        style={buttonStyle}
        type="button"
        onClick={() => {
          void api.request("POST", "/asset-manager/assets", { vin, unit_number, make, model, year });
        }}
      >
        create
      </button>
      <div>
        {rows.map((row) => (
          <p key={String(row.asset_id)} style={mutedStyle}>
            {String(row.unit_number)} {String(row.vin)}
          </p>
        ))}
      </div>
    </section>
  );
}

const panelStyle: CSSProperties = {
  background: "#12081f",
  border: "1px solid #7c3aed",
  borderRadius: "12px",
  padding: "16px",
  color: "#f5f3ff",
};
const titleStyle: CSSProperties = { color: "#c084fc", textTransform: "uppercase" };
const mutedStyle: CSSProperties = { color: "#c4b5fd" };
const inputStyle: CSSProperties = {
  background: "#05010d",
  border: "1px solid #a855f7",
  color: "#f5f3ff",
  borderRadius: "8px",
  padding: "8px",
  width: "100%",
  marginBottom: "8px",
};
const buttonStyle: CSSProperties = {
  color: "#05010d",
  background: "#c084fc",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  fontWeight: 700,
};
