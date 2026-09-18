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

export function PartsEditor() {
  const api = useAssetManagerApi();
  const [rows, setRows] = useState<readonly Readonly<Record<string, unknown>>[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [reorder_point, setReorder] = useState("");
  const [vendor_id, setVendor] = useState("");
  const [selected, setSelected] = useState("");

  const reload = async () => {
    setRows(asRows(await api.request("GET", "/asset-manager/parts", {})));
  };

  useEffect(() => {
    void reload();
  }, [api.allowed]);

  if (api.allowed === false) {
    return null;
  }

  const body = { name, quantity, location, reorder_point, vendor_id, description: "" };

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>Parts Editor</h2>
      <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="name" />
      <Input value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="quantity" />
      <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="location" />
      <Input value={reorder_point} onChange={(event) => setReorder(event.target.value)} placeholder="reorder_point" />
      <Input value={vendor_id} onChange={(event) => setVendor(event.target.value)} placeholder="vendor_id" />
      <div style={rowStyle}>
        <Button type="button" onClick={() => void api.request("POST", "/asset-manager/parts", body).then(reload)}>
          create
        </Button>
        <Button type="button" onClick={() => void api.request("PUT", "/asset-manager/parts/" + selected, body).then(reload)}>
          update
        </Button>
        <Button type="button" onClick={() => void api.request("DELETE", "/asset-manager/parts/" + selected, {}).then(reload)}>
          delete
        </Button>
      </div>
      {rows.map((row) => (
        <p key={String(row.part_id)} style={mutedStyle} onClick={() => setSelected(String(row.part_id))}>
          {String(row.name)} {String(row.quantity)} {String(row.vendor_id)}
        </p>
      ))}
    </section>
  );
}
