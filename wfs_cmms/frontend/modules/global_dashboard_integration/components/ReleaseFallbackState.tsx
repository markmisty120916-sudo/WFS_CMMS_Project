"use client";

import { mutedStyle, panelStyle, titleStyle } from "../global-dashboard-integration.styles";
import { releasePrepLabel } from "../global-dashboard-integration.release-prep";

export function ReleaseFallbackState(props: { readonly reason: string }) {
  const title = props.reason === "api_base" || props.reason === "mock" ? "env_invalid" : "preflight_failed";
  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{releasePrepLabel(title)}</h2>
      <p style={mutedStyle}>{releasePrepLabel("preflight")}</p>
    </section>
  );
}
