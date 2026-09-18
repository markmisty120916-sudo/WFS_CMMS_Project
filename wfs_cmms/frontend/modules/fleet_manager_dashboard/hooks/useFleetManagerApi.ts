"use client";

import { useCallback, useEffect, useState } from "react";
import type { DtoRole } from "../../../../src/core/dto/base.dto";
import { FLEET_MANAGER_CLIENT_ROUTES, fleetManagerRequest } from "../api/fleet-manager-dashboard.api.client";
import type { FleetManagerFilter, FleetManagerSession } from "../fleet-manager-dashboard.interface";
import { canAccessFleetManagerDashboard } from "../fleet-manager-dashboard.rbac";

function storageValue(key: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  const value = window.sessionStorage.getItem(key);
  return value === null ? "" : value;
}

export function loadFleetManagerSession(): FleetManagerSession | null {
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

export function useFleetManagerApi(filter: FleetManagerFilter) {
  const [session, setSession] = useState<FleetManagerSession | null>(null);
  const allowed = session !== null && canAccessFleetManagerDashboard(session.role) && session.tenant_id !== "";

  const request = useCallback(
    async (path: string) => {
      const current = loadFleetManagerSession();
      if (current === null) {
        return null;
      }
      if (canAccessFleetManagerDashboard(current.role) === false) {
        return null;
      }
      return resultValue(
        await fleetManagerRequest(current, path, {
          severity: filter.severity,
          asset_group: filter.asset_group,
          technician: filter.technician,
          pm_status: filter.pm_status,
          vendor: filter.vendor,
        }),
      );
    },
    [filter.asset_group, filter.pm_status, filter.severity, filter.technician, filter.vendor],
  );

  useEffect(() => {
    setSession(loadFleetManagerSession());
  }, []);

  return { session, allowed, request, routes: FLEET_MANAGER_CLIENT_ROUTES };
}
