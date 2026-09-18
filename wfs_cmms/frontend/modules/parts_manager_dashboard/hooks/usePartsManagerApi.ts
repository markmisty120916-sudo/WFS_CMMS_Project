"use client";

import { useCallback, useEffect, useState } from "react";
import type { DtoRole } from "../../../../src/core/dto/base.dto";
import { PARTS_MANAGER_CLIENT_ROUTES, partsManagerRequest } from "../api/parts-manager-dashboard.api.client";
import type { PartsManagerFilter, PartsManagerSession } from "../parts-manager-dashboard.interface";
import { canAccessPartsManagerDashboard } from "../parts-manager-dashboard.rbac";

function storageValue(key: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  const value = window.sessionStorage.getItem(key);
  return value === null ? "" : value;
}

export function loadPartsManagerSession(): PartsManagerSession | null {
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

export function usePartsManagerApi(filter: PartsManagerFilter) {
  const [session, setSession] = useState<PartsManagerSession | null>(null);
  const allowed = session !== null && canAccessPartsManagerDashboard(session.role) && session.tenant_id !== "";

  const request = useCallback(
    async (path: string) => {
      const current = loadPartsManagerSession();
      if (current === null) {
        return null;
      }
      if (canAccessPartsManagerDashboard(current.role) === false) {
        return null;
      }
      return resultValue(
        await partsManagerRequest(current, path, {
          vendor: filter.vendor,
          part_category: filter.part_category,
          stock_status: filter.stock_status,
          severity: filter.severity,
        }),
      );
    },
    [filter.part_category, filter.severity, filter.stock_status, filter.vendor],
  );

  useEffect(() => {
    setSession(loadPartsManagerSession());
  }, []);

  return { session, allowed, request, routes: PARTS_MANAGER_CLIENT_ROUTES };
}
