"use client";

import { useEffect, useState } from "react";
import { useAssetManagerApi } from "../hooks/useAssetManagerApi";
import { mutedStyle, panelStyle, rowStyle, titleStyle } from "../asset-manager.styles";
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

export function EmployeeEditor() {
  const api = useAssetManagerApi();
  const [rows, setRows] = useState<readonly Readonly<Record<string, unknown>>[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("TECHNICIAN");
  const [selected, setSelected] = useState("");

  const reload = async () => {
    setRows(asRows(await api.request("GET", "/asset-manager/employees", {})));
  };

  useEffect(() => {
    void reload();
  }, [api.allowed]);

  if (api.allowed === false) {
    return null;
  }

  const body = { name, email, role, status: "active" };

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>Employee Editor</h2>
      <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="name" />
      <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email" />
      <Select value={role} onChange={(event) => setRole(event.target.value)}>
        <option value="DRIVER">DRIVER</option>
        <option value="TECHNICIAN">TECHNICIAN</option>
        <option value="MASTER TECHNICIAN">MASTER TECHNICIAN</option>
        <option value="PARTS MANAGER">PARTS MANAGER</option>
        <option value="FLEET MANAGER">FLEET MANAGER</option>
        <option value="COMPLIANCE OFFICER">COMPLIANCE OFFICER</option>
        <option value="ADMIN">ADMIN</option>
        <option value="SysAdmin">SysAdmin</option>
      </Select>
      <div style={rowStyle}>
        <Button type="button" onClick={() => void api.request("POST", "/asset-manager/employees", body).then(reload)}>
          create
        </Button>
        <Button type="button" onClick={() => void api.request("PUT", "/asset-manager/employees/" + selected, body).then(reload)}>
          update
        </Button>
        <Button type="button" onClick={() => void api.request("DELETE", "/asset-manager/employees/" + selected, {}).then(reload)}>
          delete
        </Button>
      </div>
      {rows.map((row) => (
        <p key={String(row.user_id)} style={mutedStyle} onClick={() => setSelected(String(row.user_id))}>
          {String(row.name)} {String(row.role)}
        </p>
      ))}
    </section>
  );
}
