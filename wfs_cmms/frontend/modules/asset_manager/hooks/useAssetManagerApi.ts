"use client";

import { useCallback, useEffect, useState } from "react";
import { assetManagerRequest, type AssetManagerClientSession } from "../api/asset-manager.api.client";
import { canAccessAssetManagerUi } from "../asset-manager.rbac";
import type { DtoRole } from "../../../../src/core/dto/base.dto";

function storageValue(key: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  const value = window.sessionStorage.getItem(key);
  return value === null ? "" : value;
}

function decodeRole(token: string): DtoRole | null {
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
    const role = (parsed as Record<string, unknown>).role;
    if (typeof role !== "string") {
      return null;
    }
    if (canAccessAssetManagerUi(role as DtoRole) === false) {
      return role as DtoRole;
    }
    return role as DtoRole;
  } catch {
    return null;
  }
}

export function loadAssetManagerSession(): AssetManagerClientSession | null {
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
    const role = decodeRole(token);
    if (tenant_id === "" || user_id === "" || role === null) {
      return null;
    }
    return { tenant_id, user_id, role, token };
  } catch {
    return null;
  }
}

export function useAssetManagerSession(): {
  readonly session: AssetManagerClientSession | null;
  readonly allowed: boolean;
} {
  const [session, setSession] = useState<AssetManagerClientSession | null>(null);
  useEffect(() => {
    setSession(loadAssetManagerSession());
  }, []);
  const allowed = session !== null && canAccessAssetManagerUi(session.role as DtoRole);
  return { session, allowed };
}

export function useAssetManagerApi() {
  const { session, allowed } = useAssetManagerSession();
  const request = useCallback(
    async (method: "GET" | "POST" | "PUT" | "DELETE", path: string, body: unknown) => {
      if (allowed === false) {
        return null;
      }
      if (session === null) {
        return null;
      }
      if (session.tenant_id === "") {
        return null;
      }
      return assetManagerRequest(session, method, path, body);
    },
    [allowed, session],
  );
  return { session, allowed, request };
}
