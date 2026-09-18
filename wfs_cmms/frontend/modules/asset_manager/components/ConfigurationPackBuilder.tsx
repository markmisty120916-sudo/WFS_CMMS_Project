"use client";

import { useEffect, useState } from "react";
import { useAssetManagerApi } from "../hooks/useAssetManagerApi";
import { mutedStyle, panelStyle, titleStyle } from "../asset-manager.styles";
import { Button, Input, Select } from "./ui/controls";

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

export function ConfigurationPackBuilder() {
  const api = useAssetManagerApi();
  const [name, setName] = useState("");
  const [pm_template_name, setTemplate] = useState("");
  const [interval_miles, setMiles] = useState("");
  const [interval_hours, setHours] = useState("");
  const [severity_default, setSeverity] = useState("S3");
  const [workorder_source, setSource] = useState("pm");
  const [telematics_fault_code, setFault] = useState("");
  const [telematics_severity, setTelematicsSeverity] = useState("");
  const [packs, setPacks] = useState<readonly Readonly<Record<string, unknown>>[]>([]);

  const reload = async () => {
    setPacks(asRows(await api.request("GET", "/asset-manager/packs", {})));
  };

  useEffect(() => {
    void reload();
  }, [api.allowed]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>Configuration Pack Builder</h2>
      <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="name" />
      <Input value={pm_template_name} onChange={(event) => setTemplate(event.target.value)} placeholder="pm_template_name" />
      <Input value={interval_miles} onChange={(event) => setMiles(event.target.value)} placeholder="interval_miles" />
      <Input value={interval_hours} onChange={(event) => setHours(event.target.value)} placeholder="interval_hours" />
      <Select value={severity_default} onChange={(event) => setSeverity(event.target.value)}>
        <option value="S1">S1</option>
        <option value="S2">S2</option>
        <option value="S3">S3</option>
        <option value="S4">S4</option>
        <option value="S5">S5</option>
      </Select>
      <Input value={workorder_source} onChange={(event) => setSource(event.target.value)} placeholder="workorder_source" />
      <Input value={telematics_fault_code} onChange={(event) => setFault(event.target.value)} placeholder="telematics_fault_code" />
      <Input value={telematics_severity} onChange={(event) => setTelematicsSeverity(event.target.value)} placeholder="telematics_severity" />
      <Button
        type="button"
        onClick={() =>
          void api
            .request("POST", "/asset-manager/packs", {
              name,
              pm_template_name,
              interval_miles,
              interval_hours,
              severity_default,
              workorder_source,
              telematics_fault_code,
              telematics_severity,
            })
            .then(reload)
        }
      >
        create pack
      </Button>
      {packs.map((pack) => (
        <p key={String(pack.pack_id)} style={mutedStyle}>
          {String(pack.name)} {String(pack.severity_default)}
          <Button type="button" onClick={() => void api.request("POST", "/asset-manager/packs/" + String(pack.pack_id) + "/apply", {})}>
            apply
          </Button>
        </p>
      ))}
    </section>
  );
}
