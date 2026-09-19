"use client";

import { DashboardIntegrationShell } from "../../../../wfs_cmms/frontend/modules/global_dashboard_integration";
import SilentMasterKeyDashboardPage from "../../../../wfs_cmms/frontend/modules/silent_master_key_dashboard/page";

export default function SilentMasterKeyIntegrationPage() {
  return (
    <DashboardIntegrationShell dashboard="silent_master_key">
      <SilentMasterKeyDashboardPage />
    </DashboardIntegrationShell>
  );
}
