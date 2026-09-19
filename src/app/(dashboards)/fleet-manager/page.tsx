"use client";

import { DashboardIntegrationShell } from "../../../../wfs_cmms/frontend/modules/global_dashboard_integration";
import FleetManagerDashboardPage from "../../../../wfs_cmms/frontend/modules/fleet_manager_dashboard/page";

export default function FleetManagerIntegrationPage() {
  return (
    <DashboardIntegrationShell dashboard="fleet_manager">
      <FleetManagerDashboardPage />
    </DashboardIntegrationShell>
  );
}
