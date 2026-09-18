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

export function PmScheduleEditor() {
  const api = useAssetManagerApi();
  const [rows, setRows] = useState<readonly Readonly<Record<string, unknown>>[]>([]);
  const [asset_id, setAssetId] = useState("");
  const [name, setName] = useState("");
  const [interval_miles, setMiles] = useState("");
  const [interval_hours, setHours] = useState("");
  const [asset_group, setGroup] = useState("");
  const [selected, setSelected] = useState("");

  const reload = async () => {
    setRows(asRows(await api.request("GET", "/asset-manager/pm", {})));
  };

  useEffect(() => {
    void reload();
  }, [api.allowed]);

  if (api.allowed === false) {
    return null;
  }

  const body = {
    asset_id,
    name,
    interval_miles,
    interval_hours,
    due_miles: interval_miles,
    due_hours: interval_hours,
    asset_group,
    status: "scheduled",
  };

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>PM Schedule Editor</h2>
      <Input value={asset_id} onChange={(event) => setAssetId(event.target.value)} placeholder="asset_id" />
      <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="name" />
      <Input value={interval_miles} onChange={(event) => setMiles(event.target.value)} placeholder="interval_miles" />
      <Input value={interval_hours} onChange={(event) => setHours(event.target.value)} placeholder="interval_hours" />
      <Input value={asset_group} onChange={(event) => setGroup(event.target.value)} placeholder="asset_group" />
      <div style={rowStyle}>
        <Button type="button" onClick={() => void api.request("POST", "/asset-manager/pm", body).then(reload)}>
          create
        </Button>
        <Button type="button" onClick={() => void api.request("PUT", "/asset-manager/pm/" + selected, body).then(reload)}>
          update
        </Button>
        <Button type="button" onClick={() => void api.request("DELETE", "/asset-manager/pm/" + selected, {}).then(reload)}>
          delete
        </Button>
      </div>
      {rows.map((row) => (
        <p key={String(row.pm_schedule_id)} style={mutedStyle} onClick={() => setSelected(String(row.pm_schedule_id))}>
          {String(row.asset_id)} {String(row.status)} {String(row.asset_group)}
        </p>
      ))}
    </section>
  );
}
