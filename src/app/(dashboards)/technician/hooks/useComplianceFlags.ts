"use client";

import { useCallback, useEffect, useState } from "react";
import { technicianApiPath, technicianApiRequest, technicianApiRoute } from "../api/technician.api.contract";
import { TECHNICIAN_EVENT_TYPES } from "../technician.events";
import type { TechnicianComplianceFlag, TechnicianSession, TechnicianWorkorder } from "../technician.interface";
import { canViewTechnicianComplianceFlags } from "../technician.rbac";
import { assignedWorkorderIds, filterComplianceFlags } from "../utils/technician-filters";
import { mapComplianceFlagFromEvent, mapComplianceFlagFromWorkorder } from "../utils/technician-mapper";
import { loadTechnicianSession, normalizeUnknownArray } from "../utils/technician-normalizer";

export function useComplianceFlags(workorders: readonly TechnicianWorkorder[]): {
  readonly session: TechnicianSession | null;
  readonly allowed: boolean;
  readonly items: readonly TechnicianComplianceFlag[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<TechnicianSession | null>(null);
  const [items, setItems] = useState<readonly TechnicianComplianceFlag[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadTechnicianSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    if (canViewTechnicianComplianceFlags(current.role) === false) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const mapped: TechnicianComplianceFlag[] = [];
    let woIndex = 0;
    while (woIndex < workorders.length) {
      const flag = mapComplianceFlagFromWorkorder(workorders[woIndex]);
      if (flag !== null) {
        mapped.push(flag);
      }
      woIndex = woIndex + 1;
    }
    const route = technicianApiRoute("list_events");
    if (route !== null) {
      const payload = await technicianApiRequest(
        current,
        route.operation,
        technicianApiPath(route.path, {}),
        route.method,
        {
          type: TECHNICIAN_EVENT_TYPES.pm_compliance_failed,
        },
        {},
      );
      const raw = normalizeUnknownArray(payload);
      let index = 0;
      while (index < raw.length) {
        const item = mapComplianceFlagFromEvent(raw[index], current.tenant_id);
        if (item !== null) {
          mapped.push(item);
        }
        index = index + 1;
      }
    }
    setItems(filterComplianceFlags(mapped, current.tenant_id, assignedWorkorderIds(workorders)));
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

  const allowed = session !== null && canViewTechnicianComplianceFlags(session.role);
  return { session, allowed, items, loading, refresh };
}
