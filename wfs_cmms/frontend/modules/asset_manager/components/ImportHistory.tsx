"use client";

import { useEffect, useState } from "react";
import { useAssetManagerApi } from "../hooks/useAssetManagerApi";
import { mutedStyle, panelStyle, titleStyle } from "../asset-manager.styles";

function asRows(payload: unknown): readonly Readonly<Record<string, unknown>>[] {
  if (payload === null || typeof payload !== "object") {
    return [];
  }
  const value = (payload as { value?: unknown }).value;
  if (Array.isArray(value) === false) {
    return [];
  }
  return value as readonly Readonly<Record<string, unknown>>[];
}

export function ImportHistory() {
  const api = useAssetManagerApi();
  const [rows, setRows] = useState<readonly Readonly<Record<string, unknown>>[]>([]);

  useEffect(() => {
    void (async () => {
      setRows(asRows(await api.request("GET", "/asset-manager/imports", {})));
    })();
  }, [api.allowed]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>Import History</h2>
      {rows.map((row) => (
        <p key={String(row.import_id)} style={mutedStyle}>
          {String(row.status)} {String(row.data_type)} {String(row.created_by)} {String(row.created_at)} {String(row.audit_summary)}
        </p>
      ))}
    </section>
  );
}
