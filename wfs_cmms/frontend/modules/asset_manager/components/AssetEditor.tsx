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

export function AssetEditor() {
  const api = useAssetManagerApi();
  const [rows, setRows] = useState<readonly Readonly<Record<string, unknown>>[]>([]);
  const [vin, setVin] = useState("");
  const [unit_number, setUnit] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [telematics_id, setTelematics] = useState("");
  const [vendor_id, setVendor] = useState("");
  const [selected, setSelected] = useState("");

  const reload = async () => {
    setRows(asRows(await api.request("GET", "/asset-manager/assets", {})));
  };

  useEffect(() => {
    void reload();
  }, [api.allowed]);

  if (api.allowed === false) {
    return null;
  }

  const body = { vin, unit_number, make, model, year, telematics_id, vendor_id, mileage: "", hours: "", status: "active" };

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>Asset Editor</h2>
      <Input value={vin} onChange={(event) => setVin(event.target.value)} placeholder="vin" />
      <Input value={unit_number} onChange={(event) => setUnit(event.target.value)} placeholder="unit_number" />
      <Input value={make} onChange={(event) => setMake(event.target.value)} placeholder="make" />
      <Input value={model} onChange={(event) => setModel(event.target.value)} placeholder="model" />
      <Input value={year} onChange={(event) => setYear(event.target.value)} placeholder="year" />
      <Input value={telematics_id} onChange={(event) => setTelematics(event.target.value)} placeholder="telematics_id" />
      <Input value={vendor_id} onChange={(event) => setVendor(event.target.value)} placeholder="vendor_id" />
      <div style={rowStyle}>
        <Button type="button" onClick={() => void api.request("POST", "/asset-manager/assets", body).then(reload)}>
          create
        </Button>
        <Button type="button" onClick={() => void api.request("PUT", "/asset-manager/assets/" + selected, body).then(reload)}>
          update
        </Button>
        <Button type="button" onClick={() => void api.request("DELETE", "/asset-manager/assets/" + selected, {}).then(reload)}>
          delete
        </Button>
      </div>
      {rows.map((row) => (
        <p key={String(row.asset_id)} style={mutedStyle} onClick={() => setSelected(String(row.asset_id))}>
          {String(row.unit_number)} {String(row.vin)} {String(row.telematics_id)}
        </p>
      ))}
    </section>
  );
}
