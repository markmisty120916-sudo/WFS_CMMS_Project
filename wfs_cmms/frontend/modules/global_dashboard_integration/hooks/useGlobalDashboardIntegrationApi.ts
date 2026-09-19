"use client";

import { useCallback, useEffect, useState } from "react";
import type { DtoRole } from "../../../../src/core/dto/base.dto";
import {
  GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES,
  globalDashboardIntegrationRequest,
} from "../api/global-dashboard-integration.api.client";
import type {
  GlobalDashboardIntegrationFilter,
  GlobalDashboardIntegrationSession,
} from "../global-dashboard-integration.interface";
import { canAccessGlobalDashboardIntegration } from "../global-dashboard-integration.rbac";

function storageValue(key: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  const value = window.sessionStorage.getItem(key);
  return value === null ? "" : value;
}

export function loadGlobalDashboardIntegrationSession(): GlobalDashboardIntegrationSession | null {
  const token = storageValue("wfs.cmms.token");
  if (token === "") {
    return null;
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  try {
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const parsed: unknown = JSON.parse(json);
    if (parsed === null || typeof parsed !== "object") {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    const tenant_id = typeof record.tenant_id === "string" ? record.tenant_id : "";
    const user_id = typeof record.user_id === "string" ? record.user_id : "";
    const role = record.role;
    if (tenant_id === "" || user_id === "" || typeof role !== "string") {
      return null;
    }
    return { tenant_id, user_id, role: role as DtoRole, token };
  } catch {
    return null;
  }
}

function resultValue(payload: unknown): unknown {
  if (payload === null || typeof payload !== "object") {
    return null;
  }
  return (payload as { value?: unknown }).value;
}

const emptyFilter: GlobalDashboardIntegrationFilter = {
  asset_id: "",
  workorder_id: "",
  severity: "",
  status: "",
  vendor_id: "",
};

export function useGlobalDashboardIntegrationApi(filter: GlobalDashboardIntegrationFilter = emptyFilter) {
  const [session, setSession] = useState<GlobalDashboardIntegrationSession | null>(null);
  const allowed = session !== null && canAccessGlobalDashboardIntegration(session.role) && session.tenant_id !== "";

  const request = useCallback(
    async (path: string) => {
      const current = loadGlobalDashboardIntegrationSession();
      if (current === null) {
        return null;
      }
      if (canAccessGlobalDashboardIntegration(current.role) === false) {
        return null;
      }
      return resultValue(
        await globalDashboardIntegrationRequest(current, path, {
          asset_id: filter.asset_id,
          workorder_id: filter.workorder_id,
          severity: filter.severity,
          status: filter.status,
          vendor_id: filter.vendor_id,
        }),
      );
    },
    [filter.asset_id, filter.severity, filter.status, filter.vendor_id, filter.workorder_id],
  );

  useEffect(() => {
    setSession(loadGlobalDashboardIntegrationSession());
  }, []);

  return { session, allowed, request, routes: GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES };
}
