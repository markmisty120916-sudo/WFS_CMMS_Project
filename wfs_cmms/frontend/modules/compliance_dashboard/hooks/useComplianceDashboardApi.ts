"use client";

import { useCallback, useEffect, useState } from "react";
import type { DtoRole } from "../../../../src/core/dto/base.dto";
import { COMPLIANCE_DASHBOARD_CLIENT_ROUTES, complianceDashboardRequest } from "../api/compliance-dashboard.api.client";
import type { ComplianceDashboardFilter, ComplianceDashboardSession } from "../compliance-dashboard.interface";
import { canAccessComplianceDashboard } from "../compliance-dashboard.rbac";

function storageValue(key: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  const value = window.sessionStorage.getItem(key);
  return value === null ? "" : value;
}

export function loadComplianceDashboardSession(): ComplianceDashboardSession | null {
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

export function useComplianceDashboardApi(filter: ComplianceDashboardFilter) {
  const [session, setSession] = useState<ComplianceDashboardSession | null>(null);
  const allowed = session !== null && canAccessComplianceDashboard(session.role) && session.tenant_id !== "";

  const request = useCallback(
    async (path: string) => {
      const current = loadComplianceDashboardSession();
      if (current === null) {
        return null;
      }
      if (canAccessComplianceDashboard(current.role) === false) {
        return null;
      }
      return resultValue(
        await complianceDashboardRequest(current, path, {
          asset: filter.asset,
          inspection_type: filter.inspection_type,
          severity: filter.severity,
          driver: filter.driver,
          technician: filter.technician,
          compliance_category: filter.compliance_category,
        }),
      );
    },
    [filter.asset, filter.compliance_category, filter.driver, filter.inspection_type, filter.severity, filter.technician],
  );

  useEffect(() => {
    setSession(loadComplianceDashboardSession());
  }, []);

  return { session, allowed, request, routes: COMPLIANCE_DASHBOARD_CLIENT_ROUTES };
}
