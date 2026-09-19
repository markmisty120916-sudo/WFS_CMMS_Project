"use client";

import { DashboardIntegrationShell } from "../../../../wfs_cmms/frontend/modules/global_dashboard_integration";
import PartsManagerDashboardPage from "../../../../wfs_cmms/frontend/modules/parts_manager_dashboard/page";

export default function PartsManagerIntegrationPage() {
  return (
    <DashboardIntegrationShell dashboard="parts_manager">
      <PartsManagerDashboardPage />
    </DashboardIntegrationShell>
  );
}
