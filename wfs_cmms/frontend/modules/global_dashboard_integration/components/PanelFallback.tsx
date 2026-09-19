"use client";

import type { CSSProperties } from "react";
import { mutedStyle, panelStyle, titleStyle } from "../global-dashboard-integration.styles";
import { integrationWidgetLabel } from "../global-dashboard-integration.widgets";

export function PanelFallback(props: { readonly title: string; readonly state: "loading" | "empty" | "error" }) {
  const label =
    props.state === "loading"
      ? integrationWidgetLabel("loading")
      : props.state === "empty"
        ? integrationWidgetLabel("empty")
        : integrationWidgetLabel("error");
  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{props.title}</h2>
      <p style={mutedStyle}>{label}</p>
    </section>
  );
}

export function PaginationControls(props: {
  readonly page: number;
  readonly hasMore: boolean;
  readonly onPage: (page: number) => void;
}) {
  const rowStyle: CSSProperties = { display: "flex", gap: "8px", marginTop: "8px" };
  return (
    <div style={rowStyle}>
      <button type="button" disabled={props.page <= 1} onClick={() => props.onPage(props.page - 1)}>
        {integrationWidgetLabel("previous")}
      </button>
      <button type="button" disabled={props.hasMore === false} onClick={() => props.onPage(props.page + 1)}>
        {integrationWidgetLabel("next")}
      </button>
    </div>
  );
}
