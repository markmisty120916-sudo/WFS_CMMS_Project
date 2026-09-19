"use client";

import { useCallback, useEffect, useState } from "react";
import type { DtoRole } from "../../../../src/core/dto/base.dto";
import { DRIVER_PORTAL_CLIENT_ROUTES, driverPortalRequest } from "../api/driver-portal.api.client";
import type { DriverPortalFilter, DriverPortalSession } from "../driver-portal.interface";
import { canAccessDriverPortal, canMutateDriverPortal } from "../driver-portal.rbac";

function storageValue(key: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  const value = window.sessionStorage.getItem(key);
  return value === null ? "" : value;
}

export function loadDriverPortalSession(): DriverPortalSession | null {
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

export function useDriverPortalApi(filter: DriverPortalFilter) {
  const [session, setSession] = useState<DriverPortalSession | null>(null);
  const allowed = session !== null && canAccessDriverPortal(session.role) && session.tenant_id !== "";
  const canMutate = session !== null && canMutateDriverPortal(session.role);

  const request = useCallback(
    async (path: string) => {
      const current = loadDriverPortalSession();
      if (current === null) {
        return null;
      }
      if (canAccessDriverPortal(current.role) === false) {
        return null;
      }
      return resultValue(await driverPortalRequest(current, path, { asset: filter.asset }, "GET", null));
    },
    [filter.asset],
  );

  const mutate = useCallback(async (path: string, body: Readonly<Record<string, string>>) => {
    const current = loadDriverPortalSession();
    if (current === null) {
      return null;
    }
    if (canMutateDriverPortal(current.role) === false) {
      return null;
    }
    return resultValue(await driverPortalRequest(current, path, {}, "POST", body));
  }, []);

  useEffect(() => {
    setSession(loadDriverPortalSession());
  }, []);

  return { session, allowed, canMutate, request, mutate, routes: DRIVER_PORTAL_CLIENT_ROUTES };
}
