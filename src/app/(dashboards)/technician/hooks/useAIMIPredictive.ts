"use client";

import { useCallback, useEffect, useState } from "react";
import { technicianApiPath, technicianApiRequest, technicianApiRoute } from "../api/technician.api.contract";
import type { TechnicianInsightItem, TechnicianPredictiveAlert, TechnicianSession, TechnicianWorkorder } from "../technician.interface";
import { canViewTechnicianInsights, canViewTechnicianPredictiveFeed } from "../technician.rbac";
import { assignedAssetIds, assignedWorkorderIds, filterPredictiveByAssigned } from "../utils/technician-filters";
import { mapInsight, mapPredictiveAlert, mapPredictiveFromWorkorder } from "../utils/technician-mapper";
import { loadTechnicianSession, normalizeUnknownArray } from "../utils/technician-normalizer";

export function useAIMIPredictive(workorders: readonly TechnicianWorkorder[]): {
  readonly session: TechnicianSession | null;
  readonly allowed: boolean;
  readonly items: readonly TechnicianPredictiveAlert[];
  readonly insights: readonly TechnicianInsightItem[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const [session, setSession] = useState<TechnicianSession | null>(null);
  const [items, setItems] = useState<readonly TechnicianPredictiveAlert[]>([]);
  const [insights, setInsights] = useState<readonly TechnicianInsightItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = loadTechnicianSession();
    setSession(current);
    if (current === null) {
      setItems([]);
      setInsights([]);
      setLoading(false);
      return;
    }
    if (canViewTechnicianPredictiveFeed(current.role) === false) {
      setItems([]);
      setInsights([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const fromQueue: TechnicianPredictiveAlert[] = [];
    let queueIndex = 0;
    while (queueIndex < workorders.length) {
      const alertItem = mapPredictiveFromWorkorder(workorders[queueIndex]);
      if (alertItem !== null) {
        fromQueue.push(alertItem);
      }
      queueIndex = queueIndex + 1;
    }

    const insightFeed: TechnicianInsightItem[] = [];
    if (canViewTechnicianInsights(current.role) === true) {
      const route = technicianApiRoute("list_insights");
      if (route !== null) {
        const payload = await technicianApiRequest(
          current,
          route.operation,
          technicianApiPath(route.path, {}),
          route.method,
          {},
          {},
        );
        const raw = normalizeUnknownArray(payload);
        let index = 0;
        while (index < raw.length) {
          const alertItem = mapPredictiveAlert(raw[index], current.tenant_id);
          if (alertItem !== null) {
            fromQueue.push(alertItem);
          }
          const insightItem = mapInsight(raw[index], current.tenant_id);
          if (insightItem !== null) {
            insightFeed.push(insightItem);
          }
          index = index + 1;
        }
      }
    }

    setItems(filterPredictiveByAssigned(fromQueue, current.tenant_id, assignedWorkorderIds(workorders), assignedAssetIds(workorders)));
    setInsights(insightFeed);
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

  const allowed = session !== null && canViewTechnicianPredictiveFeed(session.role);
  return { session, allowed, items, insights, loading, refresh };
}
