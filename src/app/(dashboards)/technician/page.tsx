"use client";

import type { CSSProperties } from "react";
import { AIMIDiagnosticsPanel } from "./components/AIMIDiagnosticsPanel";
import { AIMIPredictivePanel } from "./components/AIMIPredictivePanel";
import { AIMISeverityPanel } from "./components/AIMISeverityPanel";
import { AssignedTasks } from "./components/AssignedTasks";
import { AssetHealthPanel } from "./components/AssetHealthPanel";
import { ComplianceFlagsPanel } from "./components/ComplianceFlagsPanel";
import { MultilingualToggle } from "./components/MultilingualToggle";
import { MyWorkorders } from "./components/MyWorkorders";
import { PartsNeededPanel } from "./components/PartsNeededPanel";
import { PMUpcomingPanel } from "./components/PMUpcomingPanel";
import { VoiceCommandButton } from "./components/VoiceCommandButton";

export default function TechnicianPage() {
  return (
    <div style={gridStyle}>
      <MyWorkorders />
      <AssignedTasks />
      <AIMISeverityPanel />
      <AIMIDiagnosticsPanel />
      <AIMIPredictivePanel />
      <AssetHealthPanel />
      <PMUpcomingPanel />
      <PartsNeededPanel />
      <ComplianceFlagsPanel />
      <VoiceCommandButton />
      <MultilingualToggle />
    </div>
  );
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "16px",
};
