"use client";

import { useCallback, useEffect, useState } from "react";
import { MASTER_TECH_API_ROUTES, masterTechApiPath, masterTechApiRequest } from "../api/master-tech.api.contract";
import type { MasterTechAssetHealthItem, MasterTechSession } from "../master-tech.interface";
import { canViewMasterTechAssetHealth } from "../master-tech.rbac";
import { filterAssetHealth } from "../utils/master-tech-filters";
import { mapAssetHealth } from "../utils/master-tech-mapper";
import { loadMasterTechSession, normalizeUnknownArray } from "../utils/master-tech-normalizer";

export function useAssetHealth(): {
  readonly session: MasterTechSession | null;
  readonly allowed: boolean;
  readonly items: readonly MasterTechAssetHealthItem[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<MasterTechSession | null>(null);
  const [items, setItems] = useState<readonly MasterTechAssetHealthItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadMasterTechSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    if (canViewMasterTechAssetHealth(current.role) === false) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const route = MASTER_TECH_API_ROUTES[5];
    const payload = await masterTechApiRequest(
      current,
      route.operation,
      masterTechApiPath(route.path, {}),
      route.method,
      {},
      {},
    );
    const raw = normalizeUnknownArray(payload);
    const mapped: MasterTechAssetHealthItem[] = [];
    let index = 0;
    while (index < raw.length) {
      const item = mapAssetHealth(raw[index], current.tenant_id);
      if (item !== null) {
        mapped.push(item);
      }
      index = index + 1;
    }
    setItems(filterAssetHealth(mapped, current.tenant_id));
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

  const allowed = session !== null && canViewMasterTechAssetHealth(session.role);
  return { session, allowed, items, loading, refresh };
}
