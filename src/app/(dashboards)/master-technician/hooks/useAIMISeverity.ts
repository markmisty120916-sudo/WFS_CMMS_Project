"use client";

import { useCallback, useEffect, useState } from "react";
import { MASTER_TECH_API_ROUTES, masterTechApiPath, masterTechApiRequest } from "../api/master-tech.api.contract";
import type { MasterTechSession, MasterTechSeverityFeedItem, MasterTechWorkorder } from "../master-tech.interface";
import { canViewMasterTechAimI } from "../master-tech.rbac";
import { mapSeverityFeedItem } from "../utils/master-tech-mapper";
import { loadMasterTechSession } from "../utils/master-tech-normalizer";

export function useAIMISeverity(workorders: readonly MasterTechWorkorder[]): {
  readonly session: MasterTechSession | null;
  readonly allowed: boolean;
  readonly items: readonly MasterTechSeverityFeedItem[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<MasterTechSession | null>(null);
  const [items, setItems] = useState<readonly MasterTechSeverityFeedItem[]>([]);
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
    const mapped: MasterTechSeverityFeedItem[] = [];
    let index = 0;
    while (index < workorders.length) {
      const workorder = workorders[index];
      if (workorder.tenant_id === current.tenant_id) {
        const route = MASTER_TECH_API_ROUTES[2];
        const payload = await masterTechApiRequest(
          current,
          route.operation,
          masterTechApiPath(route.path, { workorder_id: workorder.workorder_id }),
          route.method,
          {},
          {},
        );
        const item = mapSeverityFeedItem(payload, current.tenant_id, workorder.workorder_id, workorder.asset_id);
        if (item !== null) {
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

  const allowed = session !== null && canViewMasterTechAimI(session.role);
  return { session, allowed, items, loading, refresh };
}
