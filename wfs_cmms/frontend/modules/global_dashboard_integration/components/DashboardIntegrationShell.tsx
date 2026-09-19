"use client";

import type { ReactNode } from "react";
import type { IntegrationDashboard } from "../global-dashboard-integration.interface";
import { showConfigurationPacks, showFindVehicle, showImportHistory } from "../global-dashboard-integration.rbac";
import { gridStyle } from "../global-dashboard-integration.styles";
import { AimiInsightsPanel } from "./AimiInsightsPanel";
import { CompliancePredictionsPanel } from "./CompliancePredictionsPanel";
import { ConfigurationPackEffectsPanel } from "./ConfigurationPackEffectsPanel";
import { FindVehicleMap } from "./FindVehicleMap";
import { ImportHistoryReferencePanel } from "./ImportHistoryReferencePanel";
import { IntegrationGuard } from "./IntegrationGuard";
import { PartsUsagePredictionsPanel } from "./PartsUsagePredictionsPanel";

export function DashboardIntegrationShell(props: {
  readonly dashboard: IntegrationDashboard;
  readonly children: ReactNode;
}) {
  return (
    <div>
      {props.children}
      <IntegrationGuard>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2" style={gridStyle}>
          {showFindVehicle(props.dashboard) === true ? <FindVehicleMap /> : null}
          <AimiInsightsPanel />
          <PartsUsagePredictionsPanel />
          <CompliancePredictionsPanel />
          {showConfigurationPacks(props.dashboard) === true ? <ConfigurationPackEffectsPanel /> : null}
          {showImportHistory(props.dashboard) === true ? <ImportHistoryReferencePanel /> : null}
        </div>
      </IntegrationGuard>
    </div>
  );
}
