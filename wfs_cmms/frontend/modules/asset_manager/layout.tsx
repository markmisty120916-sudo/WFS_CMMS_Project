"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { canAccessAssetManagerUi } from "./asset-manager.rbac";
import { loadAssetManagerSession } from "./hooks/useAssetManagerApi";

export default function AssetManagerLayout(props: { readonly children: ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = loadAssetManagerSession();
    if (session === null) {
      setAllowed(false);
      setReady(true);
      return;
    }
    setAllowed(canAccessAssetManagerUi(session.role));
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
      <main style={mainStyle}>{props.children}</main>
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
