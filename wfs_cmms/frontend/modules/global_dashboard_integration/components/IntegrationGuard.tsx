"use client";

import type { ReactNode } from "react";
import type { IntegrationDashboard } from "../global-dashboard-integration.interface";
import {
  canAccessGlobalDashboardIntegration,
  canAccessIntegrationDashboard,
} from "../global-dashboard-integration.rbac";
import { loadGlobalDashboardIntegrationSession } from "../hooks/useGlobalDashboardIntegrationApi";

export function IntegrationGuard(props: { readonly dashboard: IntegrationDashboard; readonly children: ReactNode }) {
  const session = typeof window === "undefined" ? null : loadGlobalDashboardIntegrationSession();
  if (session === null) {
    return null;
  }
  if (session.tenant_id === "") {
    return null;
  }
  if (canAccessGlobalDashboardIntegration(session.role) === false) {
    return null;
  }
  if (canAccessIntegrationDashboard(props.dashboard, session.role) === false) {
    return null;
  }
  return <>{props.children}</>;
}
