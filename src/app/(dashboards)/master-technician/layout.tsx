"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { NeonHUDBar } from "./components/NeonHUDBar";
import { canAccessMasterTechnicianDashboard } from "./master-tech.rbac";
import { loadMasterTechSession } from "./utils/master-tech-normalizer";

export default function MasterTechnicianLayout(props: { readonly children: ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = loadMasterTechSession();
    if (session === null) {
      setAllowed(false);
      setReady(true);
      return;
    }
    setAllowed(canAccessMasterTechnicianDashboard(session.role));
    setReady(true);
  }, []);

  if (ready === false) {
    return <div style={shellStyle} />;
  }

  if (allowed === false) {
    return (
      <div style={shellStyle}>
        <p style={deniedStyle}>role unauthorized</p>
      </div>
    );
  }

  return (
    <div style={shellStyle}>
      <NeonHUDBar />
      <main style={mainStyle}>{props.children}</main>
    </div>
  );
}

const shellStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#05010d",
  color: "#f5f3ff",
};

const mainStyle: CSSProperties = {
  padding: "16px",
};

const deniedStyle: CSSProperties = {
  color: "#c084fc",
  textAlign: "center",
  paddingTop: "48px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};
