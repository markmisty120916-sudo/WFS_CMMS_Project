"use client";

import { DashboardIntegrationShell } from "../../../../wfs_cmms/frontend/modules/global_dashboard_integration";
import DriverPortalPage from "../../../../wfs_cmms/frontend/modules/driver_portal/page";

export default function DriverIntegrationPage() {
  return (
    <DashboardIntegrationShell dashboard="driver">
      <DriverPortalPage />
    </DashboardIntegrationShell>
  );
}
