"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useAssetManagerApi } from "../hooks/useAssetManagerApi";

export function PartsEditor() {
  const api = useAssetManagerApi();
  const [rows, setRows] = useState<readonly Readonly<Record<string, unknown>>[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    void (async () => {
      const payload = (await api.request("GET", "/asset-manager/parts", {})) as { value?: readonly Readonly<Record<string, unknown>>[] } | null;
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
      <h2 style={titleStyle}>Parts Editor</h2>
      <input style={inputStyle} value={name} onChange={(event) => setName(event.target.value)} placeholder="name" />
      <input style={inputStyle} value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="quantity" />
      <input style={inputStyle} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="location" />
      <button style={buttonStyle} type="button" onClick={() => void api.request("POST", "/asset-manager/parts", { name, quantity, location, description: "" })}>
        create
      </button>
      {rows.map((row) => (
        <p key={String(row.part_id)} style={mutedStyle}>
          {String(row.name)} {String(row.quantity)}
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
