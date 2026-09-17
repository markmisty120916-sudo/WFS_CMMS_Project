"use client";

import { useCallback, useEffect, useState } from "react";
import { technicianApiPath, technicianApiRequest, technicianApiRoute } from "../api/technician.api.contract";
import type { TechnicianPartsNeededItem, TechnicianSession, TechnicianWorkorder } from "../technician.interface";
import { canViewTechnicianParts } from "../technician.rbac";
import { assignedWorkorderIds, filterPartsByAssigned } from "../utils/technician-filters";
import { mapPartsNeeded } from "../utils/technician-mapper";
import { loadTechnicianSession, normalizeUnknownArray } from "../utils/technician-normalizer";

export function usePartsNeeded(workorders: readonly TechnicianWorkorder[]): {
  readonly session: TechnicianSession | null;
  readonly allowed: boolean;
  readonly items: readonly TechnicianPartsNeededItem[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<TechnicianSession | null>(null);
  const [items, setItems] = useState<readonly TechnicianPartsNeededItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadTechnicianSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    if (canViewTechnicianParts(current.role) === false) {
      setItems([]);
      setLoading(false);
      return;
    }
    const route = technicianApiRoute("list_part_requests");
    if (route === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const workorderIds = assignedWorkorderIds(workorders);
    const mapped: TechnicianPartsNeededItem[] = [];
    let woIndex = 0;
    while (woIndex < workorderIds.length) {
      const payload = await technicianApiRequest(
        current,
        route.operation,
        technicianApiPath(route.path, { workorder_id: workorderIds[woIndex] }),
        route.method,
        {},
        {},
      );
      const raw = normalizeUnknownArray(payload);
      let index = 0;
      while (index < raw.length) {
        const item = mapPartsNeeded(raw[index], current.tenant_id, workorderIds[woIndex]);
        if (item !== null) {
          mapped.push(item);
        }
        index = index + 1;
      }
      woIndex = woIndex + 1;
    }
    setItems(filterPartsByAssigned(mapped, current.tenant_id, workorderIds));
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

  const allowed = session !== null && canViewTechnicianParts(session.role);
  return { session, allowed, items, loading, refresh };
}
