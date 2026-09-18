"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useAssetManagerApi } from "../hooks/useAssetManagerApi";

export function ImportHistory() {
  const api = useAssetManagerApi();
  const [rows, setRows] = useState<readonly Readonly<Record<string, unknown>>[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request("GET", "/asset-manager/imports", {})) as { value?: readonly Readonly<Record<string, unknown>>[] } | null;
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
      <h2 style={titleStyle}>Import History</h2>
      {rows.map((row) => (
        <p key={String(row.import_id)} style={mutedStyle}>
          {String(row.import_id)} {String(row.status)} {String(row.created_by)} {String(row.created_at)}
        </p>
      ))}
    </section>
  );
}

const panelStyle: CSSProperties = { background: "#12081f", border: "1px solid #7c3aed", borderRadius: "12px", padding: "16px", color: "#f5f3ff" };
const titleStyle: CSSProperties = { color: "#c084fc", textTransform: "uppercase" };
const mutedStyle: CSSProperties = { color: "#c4b5fd" };
