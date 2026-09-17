"use client";

import { useCallback, useEffect, useState } from "react";
import { technicianApiPath, technicianApiRequest, technicianApiRoute } from "../api/technician.api.contract";
import type { TechnicianPmUpcomingItem, TechnicianSession, TechnicianWorkorder } from "../technician.interface";
import { canViewTechnicianPm } from "../technician.rbac";
import { assignedAssetIds, filterPmByAssigned } from "../utils/technician-filters";
import { mapPmUpcoming } from "../utils/technician-mapper";
import { loadTechnicianSession, normalizeUnknownArray } from "../utils/technician-normalizer";

export function usePMUpcoming(workorders: readonly TechnicianWorkorder[]): {
  readonly session: TechnicianSession | null;
  readonly allowed: boolean;
  readonly items: readonly TechnicianPmUpcomingItem[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<TechnicianSession | null>(null);
  const [items, setItems] = useState<readonly TechnicianPmUpcomingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadTechnicianSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    if (canViewTechnicianPm(current.role) === false) {
      setItems([]);
      setLoading(false);
      return;
    }
    const route = technicianApiRoute("list_pm_schedules");
    if (route === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const assets = assignedAssetIds(workorders);
    const mapped: TechnicianPmUpcomingItem[] = [];
    let assetIndex = 0;
    while (assetIndex < assets.length) {
      const payload = await technicianApiRequest(
        current,
        route.operation,
        technicianApiPath(route.path, {}),
        route.method,
        {
          asset_id: assets[assetIndex],
        },
        {},
      );
      const raw = normalizeUnknownArray(payload);
      let index = 0;
      while (index < raw.length) {
        const item = mapPmUpcoming(raw[index], current.tenant_id);
        if (item !== null) {
          mapped.push(item);
        }
        index = index + 1;
      }
      assetIndex = assetIndex + 1;
    }
    setItems(filterPmByAssigned(mapped, current.tenant_id, assets));
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

  const allowed = session !== null && canViewTechnicianPm(session.role);
  return { session, allowed, items, loading, refresh };
}
