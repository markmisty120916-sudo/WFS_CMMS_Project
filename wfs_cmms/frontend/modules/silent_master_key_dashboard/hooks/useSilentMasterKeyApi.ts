"use client";

import { useCallback, useEffect, useState } from "react";
import type { DtoRole } from "../../../../src/core/dto/base.dto";
import { SILENT_MASTER_KEY_CLIENT_ROUTES, silentMasterKeyRequest } from "../api/silent-master-key-dashboard.api.client";
import type { SilentMasterKeyFilter, SilentMasterKeySession } from "../silent-master-key-dashboard.interface";
import { canAccessSilentMasterKeyDashboard, canMutateSilentMasterKeyDashboard } from "../silent-master-key-dashboard.rbac";

function storageValue(key: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  const value = window.sessionStorage.getItem(key);
  return value === null ? "" : value;
}

export function loadSilentMasterKeySession(): SilentMasterKeySession | null {
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

export function useSilentMasterKeyApi(filter: SilentMasterKeyFilter) {
  const [session, setSession] = useState<SilentMasterKeySession | null>(null);
  const allowed = session !== null && canAccessSilentMasterKeyDashboard(session.role) && session.tenant_id !== "";
  const canMutate = session !== null && canMutateSilentMasterKeyDashboard(session.role);

  const request = useCallback(
    async (path: string) => {
      const current = loadSilentMasterKeySession();
      if (current === null) {
        return null;
      }
      if (canAccessSilentMasterKeyDashboard(current.role) === false) {
        return null;
      }
      return resultValue(
        await silentMasterKeyRequest(current, path, { asset: filter.asset, workorder_id: filter.workorder_id }, "GET", null),
      );
    },
    [filter.asset, filter.workorder_id],
  );

  const mutate = useCallback(async (path: string, body: Readonly<Record<string, string>>) => {
    const current = loadSilentMasterKeySession();
    if (current === null) {
      return null;
    }
    if (canMutateSilentMasterKeyDashboard(current.role) === false) {
      return null;
    }
    return resultValue(await silentMasterKeyRequest(current, path, {}, "POST", body));
  }, []);

  useEffect(() => {
    setSession(loadSilentMasterKeySession());
  }, []);

  return { session, allowed, canMutate, request, mutate, routes: SILENT_MASTER_KEY_CLIENT_ROUTES };
}
