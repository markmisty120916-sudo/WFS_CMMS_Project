"use client";

import { useCallback, useEffect, useState } from "react";
import { technicianApiPath, technicianApiRequest, technicianApiRoute } from "../api/technician.api.contract";
import type { TechnicianQueueFilter, TechnicianSession, TechnicianWorkorder } from "../technician.interface";
import { canViewTechnicianWorkorders } from "../technician.rbac";
import { filterAssignedWorkorders } from "../utils/technician-filters";
import { mapWorkorder } from "../utils/technician-mapper";
import { loadTechnicianSession, normalizeUnknownArray } from "../utils/technician-normalizer";

export function useMyWorkorders(filter: TechnicianQueueFilter): {
  readonly session: TechnicianSession | null;
  readonly allowed: boolean;
  readonly items: readonly TechnicianWorkorder[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<TechnicianSession | null>(null);
  const [items, setItems] = useState<readonly TechnicianWorkorder[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadTechnicianSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    if (canViewTechnicianWorkorders(current.role) === false) {
      setItems([]);
      setLoading(false);
      return;
    }
    const route = technicianApiRoute("list_workorders");
    if (route === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const query: Record<string, string> = {
      status: filter.status,
      asset_id: filter.asset_id,
      severity: filter.severity,
      assigned_to: "",
    };
    if (current.role === "TECHNICIAN") {
      query.assigned_to = current.user_id;
    }
    const payload = await technicianApiRequest(
      current,
      route.operation,
      technicianApiPath(route.path, {}),
      route.method,
      query,
      {},
    );
    const raw = normalizeUnknownArray(payload);
    const mapped: TechnicianWorkorder[] = [];
    let index = 0;
    while (index < raw.length) {
      const item = mapWorkorder(raw[index], current.tenant_id);
      if (item !== null) {
        mapped.push(item);
      }
      index = index + 1;
    }
    setItems(filterAssignedWorkorders(mapped, current, filter));
    setLoading(false);
  }, [filter.asset_id, filter.severity, filter.status]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 5000);
    return () => {
      window.clearInterval(timer);
    };
  }, [refresh]);

  const allowed = session !== null && canViewTechnicianWorkorders(session.role);
  return { session, allowed, items, loading, refresh };
}
