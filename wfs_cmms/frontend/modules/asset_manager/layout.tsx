"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { canAccessAssetManagerUi } from "./asset-manager.rbac";
import { loadAssetManagerSession } from "./hooks/useAssetManagerApi";

export default function AssetManagerLayout(props: { readonly children: ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [tenant_id, setTenant] = useState("");

  useEffect(() => {
    const session = loadAssetManagerSession();
    if (session === null) {
      setAllowed(false);
      setReady(true);
      return;
    }
    setTenant(session.tenant_id);
    setAllowed(canAccessAssetManagerUi(session.role) && session.tenant_id !== "");
    setReady(true);
  }, []);

  if (ready === false) {
    return <div className="min-h-screen bg-[#05010d]" style={shellStyle} />;
  }

  if (allowed === false) {
    return (
      <div className="min-h-screen bg-[#05010d]" style={shellStyle}>
        <p style={deniedStyle}>role unauthorized</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05010d] text-[#f5f3ff]" style={shellStyle}>
      <header style={barStyle}>
        <p style={brandStyle}>Asset Manager</p>
        <p style={tenantStyle}>tenant {tenant_id}</p>
      </header>
      <main className="p-4" style={mainStyle}>
        {props.children}
      </main>
    </div>
  );
}

const shellStyle: CSSProperties = { minHeight: "100vh", background: "#05010d", color: "#f5f3ff" };
const mainStyle: CSSProperties = { padding: "16px" };
const deniedStyle: CSSProperties = {
  color: "#c084fc",
  textAlign: "center",
  paddingTop: "48px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};
const barStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #c084fc",
  boxShadow: "0 0 24px #c084fc88",
  padding: "16px",
};
const brandStyle: CSSProperties = {
  color: "#c084fc",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  fontWeight: 700,
  margin: 0,
};
const tenantStyle: CSSProperties = { color: "#22d3ee", margin: 0 };
