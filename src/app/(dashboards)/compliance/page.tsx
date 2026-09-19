"use client";

import { DashboardIntegrationShell } from "../../../../wfs_cmms/frontend/modules/global_dashboard_integration";
import ComplianceDashboardPage from "../../../../wfs_cmms/frontend/modules/compliance_dashboard/page";

export default function ComplianceIntegrationPage() {
  return (
    <DashboardIntegrationShell dashboard="compliance">
      <ComplianceDashboardPage />
    </DashboardIntegrationShell>
  );
}
