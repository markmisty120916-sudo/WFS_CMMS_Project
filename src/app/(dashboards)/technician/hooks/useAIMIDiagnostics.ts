"use client";

import { useCallback, useEffect, useState } from "react";
import { technicianApiPath, technicianApiRequest, technicianApiRoute } from "../api/technician.api.contract";
import { TECHNICIAN_EVENT_TYPES } from "../technician.events";
import type { TechnicianDiagnosticFeedItem, TechnicianSession, TechnicianWorkorder } from "../technician.interface";
import { canViewTechnicianDiagnostics } from "../technician.rbac";
import { assignedWorkorderIds, containsId } from "../utils/technician-filters";
import { mapDiagnosticFeedItem } from "../utils/technician-mapper";
import { loadTechnicianSession, normalizeUnknownArray } from "../utils/technician-normalizer";

export function useAIMIDiagnostics(workorders: readonly TechnicianWorkorder[]): {
  readonly session: TechnicianSession | null;
  readonly allowed: boolean;
  readonly items: readonly TechnicianDiagnosticFeedItem[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<TechnicianSession | null>(null);
  const [items, setItems] = useState<readonly TechnicianDiagnosticFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadTechnicianSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    if (canViewTechnicianDiagnostics(current.role) === false) {
      setItems([]);
      setLoading(false);
      return;
    }
    const route = technicianApiRoute("list_events");
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
      {
        type: TECHNICIAN_EVENT_TYPES.diagnostic_started,
      },
      {},
    );
    const allowedIds = assignedWorkorderIds(workorders);
    const raw = normalizeUnknownArray(payload);
    const mapped: TechnicianDiagnosticFeedItem[] = [];
    let index = 0;
    while (index < raw.length) {
      const item = mapDiagnosticFeedItem(raw[index], current.tenant_id, "");
      if (item !== null) {
        if (containsId(allowedIds, item.workorder_id) === true) {
          mapped.push(item);
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

  const allowed = session !== null && canViewTechnicianDiagnostics(session.role);
  return { session, allowed, items, loading, refresh };
}
