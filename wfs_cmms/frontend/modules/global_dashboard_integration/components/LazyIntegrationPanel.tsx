"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { PanelFallback } from "./PanelFallback";

export function LazyIntegrationPanel(props: { readonly title: string; readonly children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReady(true);
    }, 0);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);
  if (ready === false) {
    return <PanelFallback title={props.title} state="loading" />;
  }
  return <>{props.children}</>;
}
