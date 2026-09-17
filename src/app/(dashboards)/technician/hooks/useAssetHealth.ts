"use client";

import { useCallback, useEffect, useState } from "react";
import { technicianApiPath, technicianApiRequest, technicianApiRoute } from "../api/technician.api.contract";
import type { TechnicianAssetHealthItem, TechnicianSession, TechnicianWorkorder } from "../technician.interface";
import { canViewTechnicianAssetHealth } from "../technician.rbac";
import { assignedAssetIds, filterAssetHealthByAssigned } from "../utils/technician-filters";
import { mapAssetHealth } from "../utils/technician-mapper";
import { loadTechnicianSession, normalizeUnknownArray } from "../utils/technician-normalizer";

export function useAssetHealth(workorders: readonly TechnicianWorkorder[]): {
  readonly session: TechnicianSession | null;
  readonly allowed: boolean;
  readonly items: readonly TechnicianAssetHealthItem[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<TechnicianSession | null>(null);
  const [items, setItems] = useState<readonly TechnicianAssetHealthItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadTechnicianSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    if (canViewTechnicianAssetHealth(current.role) === false) {
      setItems([]);
      setLoading(false);
      return;
    }
    const route = technicianApiRoute("list_assets");
    if (route === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const payload = await technicianApiRequest(
      current,
      route.operation,
      technicianApiPath(route.path, {}),
      route.method,
      {},
      {},
    );
    const raw = normalizeUnknownArray(payload);
    const mapped: TechnicianAssetHealthItem[] = [];
    let index = 0;
    while (index < raw.length) {
      const item = mapAssetHealth(raw[index], current.tenant_id);
      if (item !== null) {
        mapped.push(item);
      }
      index = index + 1;
    }
    setItems(filterAssetHealthByAssigned(mapped, current.tenant_id, assignedAssetIds(workorders)));
    setLoading(false);
  }, [workorders]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 5000);
    return () => {
      window.clearInterval(timer);
    };
  }, [refresh]);

  const allowed = session !== null && canViewTechnicianAssetHealth(session.role);
  return { session, allowed, items, loading, refresh };
}
