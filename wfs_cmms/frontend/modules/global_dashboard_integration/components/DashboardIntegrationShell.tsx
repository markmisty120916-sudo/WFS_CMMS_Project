"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { reportIntegrationTelemetry } from "../global-dashboard-integration.hardening";
import type { IntegrationDashboard } from "../global-dashboard-integration.interface";
import { showConfigurationPacks, showFindVehicle, showImportHistory } from "../global-dashboard-integration.rbac";
import { gridStyle } from "../global-dashboard-integration.styles";
import { integrationWidgetLabel } from "../global-dashboard-integration.widgets";
import { AimiInsightsPanel } from "./AimiInsightsPanel";
import { CompliancePredictionsPanel } from "./CompliancePredictionsPanel";
import { ConfigurationPackEffectsPanel } from "./ConfigurationPackEffectsPanel";
import { FindVehicleMap } from "./FindVehicleMap";
import { ImportHistoryReferencePanel } from "./ImportHistoryReferencePanel";
import { IntegrationGuard } from "./IntegrationGuard";
import { LazyIntegrationPanel } from "./LazyIntegrationPanel";
import { MaintenanceModeBanner } from "./MaintenanceModeBanner";
import { PartsUsagePredictionsPanel } from "./PartsUsagePredictionsPanel";

export function DashboardIntegrationShell(props: {
  readonly dashboard: IntegrationDashboard;
  readonly children: ReactNode;
}) {
  useEffect(() => {
    reportIntegrationTelemetry(props.dashboard, "view");
  }, [props.dashboard]);

  return (
    <div>
      <MaintenanceModeBanner />
      {props.children}
      <IntegrationGuard dashboard={props.dashboard}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2" style={gridStyle}>
          {showFindVehicle(props.dashboard) === true ? (
            <LazyIntegrationPanel title={integrationWidgetLabel("find_vehicle")}>
              <FindVehicleMap />
            </LazyIntegrationPanel>
          ) : null}
          <LazyIntegrationPanel title={integrationWidgetLabel("aimi")}>
            <AimiInsightsPanel dashboard={props.dashboard} />
          </LazyIntegrationPanel>
          <LazyIntegrationPanel title={integrationWidgetLabel("parts_predictions")}>
            <PartsUsagePredictionsPanel dashboard={props.dashboard} />
          </LazyIntegrationPanel>
          <LazyIntegrationPanel title={integrationWidgetLabel("compliance_predictions")}>
            <CompliancePredictionsPanel dashboard={props.dashboard} />
          </LazyIntegrationPanel>
          {showConfigurationPacks(props.dashboard) === true ? (
            <LazyIntegrationPanel title={integrationWidgetLabel("packs")}>
              <ConfigurationPackEffectsPanel />
            </LazyIntegrationPanel>
          ) : null}
          {showImportHistory(props.dashboard) === true ? (
            <LazyIntegrationPanel title={integrationWidgetLabel("imports")}>
              <ImportHistoryReferencePanel />
            </LazyIntegrationPanel>
          ) : null}
        </div>
      </IntegrationGuard>
    </div>
  );
}
