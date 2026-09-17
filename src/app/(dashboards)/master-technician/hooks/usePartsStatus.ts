"use client";

import { useCallback, useEffect, useState } from "react";
import { MASTER_TECH_API_ROUTES, masterTechApiPath, masterTechApiRequest } from "../api/master-tech.api.contract";
import type { MasterTechPartsStatusItem, MasterTechSession } from "../master-tech.interface";
import { canViewMasterTechParts } from "../master-tech.rbac";
import { filterPartsStatus } from "../utils/master-tech-filters";
import { mapPartsStatus } from "../utils/master-tech-mapper";
import { loadMasterTechSession, normalizeUnknownArray } from "../utils/master-tech-normalizer";

export function usePartsStatus(): {
  readonly session: MasterTechSession | null;
  readonly allowed: boolean;
  readonly items: readonly MasterTechPartsStatusItem[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<MasterTechSession | null>(null);
  const [items, setItems] = useState<readonly MasterTechPartsStatusItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadMasterTechSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    if (canViewMasterTechParts(current.role) === false) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const route = MASTER_TECH_API_ROUTES[7];
    const payload = await masterTechApiRequest(
      current,
      route.operation,
      masterTechApiPath(route.path, {}),
      route.method,
      {},
      {},
    );
    const raw = normalizeUnknownArray(payload);
    const mapped: MasterTechPartsStatusItem[] = [];
    let index = 0;
    while (index < raw.length) {
      const item = mapPartsStatus(raw[index], current.tenant_id);
      if (item !== null) {
        mapped.push(item);
      }
      index = index + 1;
    }
    setItems(filterPartsStatus(mapped, current.tenant_id));
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

  const allowed = session !== null && canViewMasterTechParts(session.role);
  return { session, allowed, items, loading, refresh };
}
