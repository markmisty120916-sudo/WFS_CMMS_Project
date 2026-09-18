"use client";

import { useEffect, useState } from "react";
import { useAssetManagerApi } from "../hooks/useAssetManagerApi";
import { mutedStyle, panelStyle, rowStyle, titleStyle } from "../asset-manager.styles";
import { Button, Input } from "./ui/controls";

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

export function VendorEditor() {
  const api = useAssetManagerApi();
  const [rows, setRows] = useState<readonly Readonly<Record<string, unknown>>[]>([]);
  const [vendor_name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [selected, setSelected] = useState("");

  const reload = async () => {
    setRows(asRows(await api.request("GET", "/asset-manager/vendors", {})));
  };

  useEffect(() => {
    void reload();
  }, [api.allowed]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>Vendor Editor</h2>
      <Input value={vendor_name} onChange={(event) => setName(event.target.value)} placeholder="vendor_name" />
      <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="location" />
      <div style={rowStyle}>
        <Button type="button" onClick={() => void api.request("POST", "/asset-manager/vendors", { vendor_name, location }).then(reload)}>
          create
        </Button>
        <Button type="button" onClick={() => void api.request("DELETE", "/asset-manager/vendors/" + selected, {}).then(reload)}>
          delete
        </Button>
      </div>
      {rows.map((row) => (
        <p key={String(row.vendor_id)} style={mutedStyle} onClick={() => setSelected(String(row.vendor_id))}>
          {String(row.vendor_name)} {String(row.location)}
        </p>
      ))}
    </section>
  );
}
