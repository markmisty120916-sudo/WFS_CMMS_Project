"use client";

import type { CSSProperties } from "react";
import { useMultilingual } from "../hooks/useMultilingual";
import { useNeonHUD } from "../hooks/useNeonHUD";
import { canOpenMasterTechFleetVisualization } from "../master-tech.rbac";
import { masterTechWidgetLabel } from "../master-tech.widgets";
import { MultilingualToggle } from "./MultilingualToggle";
import { VoiceCommandButton } from "./VoiceCommandButton";

export function NeonHUDBar() {
  const multilingual = useMultilingual();
  const hud = useNeonHUD(multilingual.language, true, true);
  const visualizationAllowed = hud.session !== null && canOpenMasterTechFleetVisualization(hud.session.role);

  if (hud.allowed === false) {
    return null;
  }

  return (
    <header style={hud.hud.enabled === true ? barStyle : barDimStyle}>
      <div style={clusterStyle}>
        <p style={brandStyle}>{masterTechWidgetLabel("neon_hud")}</p>
        <button style={buttonStyle} type="button" onClick={hud.toggleHud}>
          {hud.hud.enabled === true ? "HUD ON" : "HUD OFF"}
        </button>
        {visualizationAllowed === true ? (
          <a href="/visualization/fleet" style={linkStyle}>
            {masterTechWidgetLabel("fleet_visualization")}
          </a>
        ) : null}
      </div>
      <div style={clusterStyle}>
        <VoiceCommandButton />
        <MultilingualToggle />
      </div>
    </header>
  );
}

const barStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  background: "#05010d",
  borderBottom: "1px solid #c084fc",
  boxShadow: "0 0 24px #c084fc88",
  padding: "16px",
};

const barDimStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  background: "#05010d",
  borderBottom: "1px solid #4c1d95",
  padding: "16px",
};

const clusterStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const brandStyle: CSSProperties = {
  color: "#c084fc",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  fontWeight: 700,
  margin: "8px 0",
};

const buttonStyle: CSSProperties = {
  color: "#05010d",
  background: "#22d3ee",
  boxShadow: "0 0 12px #22d3ee",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

const linkStyle: CSSProperties = {
  color: "#05010d",
  background: "#c084fc",
  boxShadow: "0 0 12px #c084fc",
  borderRadius: "8px",
  padding: "10px 16px",
  textDecoration: "none",
  fontWeight: 700,
};
