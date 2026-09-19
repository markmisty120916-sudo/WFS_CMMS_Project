"use client";

import type { ReactNode } from "react";
import { canAccessGlobalDashboardIntegration } from "../global-dashboard-integration.rbac";
import { loadGlobalDashboardIntegrationSession } from "../hooks/useGlobalDashboardIntegrationApi";

export function IntegrationGuard(props: { readonly children: ReactNode }) {
  const session = typeof window === "undefined" ? null : loadGlobalDashboardIntegrationSession();
  if (session === null) {
    return null;
  }
  if (canAccessGlobalDashboardIntegration(session.role) === false) {
    return null;
  }
  return <>{props.children}</>;
}
