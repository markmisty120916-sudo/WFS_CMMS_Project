"use client";

import { useCallback, useEffect, useState } from "react";
import { technicianApiPath, technicianApiRequest, technicianApiRoute } from "../api/technician.api.contract";
import type { TechnicianSession, TechnicianSeverityFeedItem, TechnicianWorkorder } from "../technician.interface";
import { canViewTechnicianSeverity, isAssignedToTechnician } from "../technician.rbac";
import { mapSeverityFeedItem } from "../utils/technician-mapper";
import { loadTechnicianSession } from "../utils/technician-normalizer";

export function useAIMISeverity(workorders: readonly TechnicianWorkorder[]): {
  readonly session: TechnicianSession | null;
  readonly allowed: boolean;
  readonly items: readonly TechnicianSeverityFeedItem[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<TechnicianSession | null>(null);
  const [items, setItems] = useState<readonly TechnicianSeverityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadTechnicianSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    if (canViewTechnicianSeverity(current.role) === false) {
      setItems([]);
      setLoading(false);
      return;
    }
    const route = technicianApiRoute("get_severity");
    if (route === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const mapped: TechnicianSeverityFeedItem[] = [];
    let index = 0;
    while (index < workorders.length) {
      const workorder = workorders[index];
      if (isAssignedToTechnician(current, workorder) === true) {
        const payload = await technicianApiRequest(
          current,
          route.operation,
          technicianApiPath(route.path, { workorder_id: workorder.workorder_id }),
          route.method,
          {},
          {},
        );
        const item = mapSeverityFeedItem(payload, current.tenant_id, workorder.workorder_id, workorder.asset_id);
        if (item !== null) {
          mapped.push(item);
        } else if (workorder.severity !== "") {
          mapped.push(
            Object.freeze({
              tenant_id: workorder.tenant_id,
              workorder_id: workorder.workorder_id,
              asset_id: workorder.asset_id,
              severity: workorder.severity,
              reason: workorder.description,
              timestamp: workorder.scheduled_start,
            }),
          );
        }
      }
      index = index + 1;
    }
    setItems(mapped);
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

  const allowed = session !== null && canViewTechnicianSeverity(session.role);
  return { session, allowed, items, loading, refresh };
}
