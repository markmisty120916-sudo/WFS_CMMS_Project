"use client";

import { useCallback, useEffect, useState } from "react";
import { MASTER_TECH_API_ROUTES, masterTechApiPath, masterTechApiRequest } from "../api/master-tech.api.contract";
import { MASTER_TECH_EVENT_TYPES } from "../master-tech.events";
import type { MasterTechDiagnosticFeedItem, MasterTechSession } from "../master-tech.interface";
import { canViewMasterTechAimI } from "../master-tech.rbac";
import { mapDiagnosticFeedItem } from "../utils/master-tech-mapper";
import { loadMasterTechSession, normalizeUnknownArray } from "../utils/master-tech-normalizer";

export function useAIMIDiagnostics(): {
  readonly session: MasterTechSession | null;
  readonly allowed: boolean;
  readonly items: readonly MasterTechDiagnosticFeedItem[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<MasterTechSession | null>(null);
  const [items, setItems] = useState<readonly MasterTechDiagnosticFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadMasterTechSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    if (canViewMasterTechAimI(current.role) === false) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const route = MASTER_TECH_API_ROUTES[9];
    const payload = await masterTechApiRequest(
      current,
      route.operation,
      masterTechApiPath(route.path, {}),
      route.method,
      {
        type: MASTER_TECH_EVENT_TYPES.diagnostic_started,
      },
      {},
    );
    const raw = normalizeUnknownArray(payload);
    const mapped: MasterTechDiagnosticFeedItem[] = [];
    let index = 0;
    while (index < raw.length) {
      const item = mapDiagnosticFeedItem(raw[index], current.tenant_id, "");
      if (item !== null) {
        mapped.push(item);
      }
      index = index + 1;
    }
    setItems(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 5000);
    return () => {
      window.clearInterval(timer);
    };
  }, [refresh]);

  const allowed = session !== null && canViewMasterTechAimI(session.role);
  return { session, allowed, items, loading, refresh };
}
