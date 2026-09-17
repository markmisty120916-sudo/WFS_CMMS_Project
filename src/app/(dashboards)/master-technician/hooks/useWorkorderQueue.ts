"use client";

import { useCallback, useEffect, useState } from "react";
import { MASTER_TECH_API_ROUTES, masterTechApiPath, masterTechApiRequest } from "../api/master-tech.api.contract";
import type { MasterTechQueueFilter, MasterTechSession, MasterTechWorkorder } from "../master-tech.interface";
import { canViewMasterTechWorkorders } from "../master-tech.rbac";
import { filterWorkorderQueue } from "../utils/master-tech-filters";
import { mapWorkorder } from "../utils/master-tech-mapper";
import { loadMasterTechSession, normalizeUnknownArray } from "../utils/master-tech-normalizer";

export function useWorkorderQueue(filter: MasterTechQueueFilter): {
  readonly session: MasterTechSession | null;
  readonly allowed: boolean;
  readonly items: readonly MasterTechWorkorder[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<MasterTechSession | null>(null);
  const [items, setItems] = useState<readonly MasterTechWorkorder[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadMasterTechSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    if (canViewMasterTechWorkorders(current.role) === false) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const route = MASTER_TECH_API_ROUTES[0];
    const payload = await masterTechApiRequest(
      current,
      route.operation,
      masterTechApiPath(route.path, {}),
      route.method,
      {
        status: filter.status,
        asset_id: filter.asset_id,
        severity: filter.severity,
      },
      {},
    );
    const raw = normalizeUnknownArray(payload);
    const mapped: MasterTechWorkorder[] = [];
    let index = 0;
    while (index < raw.length) {
      const item = mapWorkorder(raw[index], current.tenant_id);
      if (item !== null) {
        mapped.push(item);
      }
      index = index + 1;
    }
    setItems(filterWorkorderQueue(mapped, current.tenant_id, filter));
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

  const allowed = session !== null && canViewMasterTechWorkorders(session.role);
  return { session, allowed, items, loading, refresh };
}
