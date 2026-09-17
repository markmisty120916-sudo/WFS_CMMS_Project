"use client";

import { useCallback, useEffect, useState } from "react";
import { MASTER_TECH_API_ROUTES, masterTechApiPath, masterTechApiRequest } from "../api/master-tech.api.contract";
import type { MasterTechInsightItem, MasterTechPredictiveAlert, MasterTechSession } from "../master-tech.interface";
import { canViewMasterTechAimI } from "../master-tech.rbac";
import { filterPredictiveImminent } from "../utils/master-tech-filters";
import { mapInsight, mapPredictiveAlert } from "../utils/master-tech-mapper";
import { loadMasterTechSession, normalizeUnknownArray } from "../utils/master-tech-normalizer";

export function useAIMIPredictive(): {
  readonly session: MasterTechSession | null;
  readonly allowed: boolean;
  readonly items: readonly MasterTechPredictiveAlert[];
  readonly insights: readonly MasterTechInsightItem[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<MasterTechSession | null>(null);
  const [items, setItems] = useState<readonly MasterTechPredictiveAlert[]>([]);
  const [insights, setInsights] = useState<readonly MasterTechInsightItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadMasterTechSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setInsights([]);
      setLoading(false);
      return;
    }
    if (canViewMasterTechAimI(current.role) === false) {
      setItems([]);
      setInsights([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const route = MASTER_TECH_API_ROUTES[4];
    const payload = await masterTechApiRequest(
      current,
      route.operation,
      masterTechApiPath(route.path, {}),
      route.method,
      {},
      {},
    );
    const raw = normalizeUnknownArray(payload);
    const alerts: MasterTechPredictiveAlert[] = [];
    const feed: MasterTechInsightItem[] = [];
    let index = 0;
    while (index < raw.length) {
      const alertItem = mapPredictiveAlert(raw[index], current.tenant_id);
      if (alertItem !== null) {
        alerts.push(alertItem);
      }
      const insightItem = mapInsight(raw[index], current.tenant_id);
      if (insightItem !== null) {
        feed.push(insightItem);
      }
      index = index + 1;
    }
    setItems(filterPredictiveImminent(alerts, current.tenant_id));
    setInsights(feed);
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

  const allowed = session !== null && canViewMasterTechAimI(session.role);
  return { session, allowed, items, insights, loading, refresh };
}
