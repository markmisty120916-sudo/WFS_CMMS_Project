"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useAssetManagerApi } from "../hooks/useAssetManagerApi";

export function EmployeeEditor() {
  const api = useAssetManagerApi();
  const [rows, setRows] = useState<readonly Readonly<Record<string, unknown>>[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("TECHNICIAN");

  useEffect(() => {
    void (async () => {
      const payload = (await api.request("GET", "/asset-manager/employees", {})) as { value?: readonly Readonly<Record<string, unknown>>[] } | null;
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
      <h2 style={titleStyle}>Employee Editor</h2>
      <input style={inputStyle} value={name} onChange={(event) => setName(event.target.value)} placeholder="name" />
      <input style={inputStyle} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email" />
      <select style={inputStyle} value={role} onChange={(event) => setRole(event.target.value)}>
        <option value="DRIVER">DRIVER</option>
        <option value="TECHNICIAN">TECHNICIAN</option>
        <option value="MASTER TECHNICIAN">MASTER TECHNICIAN</option>
        <option value="PARTS MANAGER">PARTS MANAGER</option>
        <option value="FLEET MANAGER">FLEET MANAGER</option>
        <option value="COMPLIANCE OFFICER">COMPLIANCE OFFICER</option>
        <option value="ADMIN">ADMIN</option>
        <option value="SysAdmin">SysAdmin</option>
      </select>
      <button style={buttonStyle} type="button" onClick={() => void api.request("POST", "/asset-manager/employees", { name, email, role, status: "active" })}>
        create
      </button>
      {rows.map((row) => (
        <p key={String(row.user_id)} style={mutedStyle}>
          {String(row.name)} {String(row.role)}
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
