"use client";

import type { CSSProperties } from "react";
import { DashboardIntegrationShell } from "../../../../wfs_cmms/frontend/modules/global_dashboard_integration";
import { AIMIDiagnosticsPanel } from "./components/AIMIDiagnosticsPanel";
import { AIMIPredictivePanel } from "./components/AIMIPredictivePanel";
import { AIMISeverityPanel } from "./components/AIMISeverityPanel";
import { AssetHealthPanel } from "./components/AssetHealthPanel";
import { ComplianceStatusPanel } from "./components/ComplianceStatusPanel";
import { MultilingualToggle } from "./components/MultilingualToggle";
import { PartsStatusPanel } from "./components/PartsStatusPanel";
import { PMStatusPanel } from "./components/PMStatusPanel";
import { VoiceCommandButton } from "./components/VoiceCommandButton";
import { WorkorderQueue } from "./components/WorkorderQueue";

export default function MasterTechnicianPage() {
  return (
    <DashboardIntegrationShell dashboard="master_technician">
      <div style={gridStyle}>
        <WorkorderQueue />
        <AIMISeverityPanel />
        <AIMIDiagnosticsPanel />
        <AIMIPredictivePanel />
        <AssetHealthPanel />
        <PMStatusPanel />
        <PartsStatusPanel />
        <ComplianceStatusPanel />
        <VoiceCommandButton />
        <MultilingualToggle />
      </div>
    </DashboardIntegrationShell>
  );
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "16px",
};
