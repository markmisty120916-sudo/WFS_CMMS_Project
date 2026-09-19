"use client";

import { useEffect, useState } from "react";
import type { IntegrationDashboard, IntegrationInventoryItem } from "../global-dashboard-integration.interface";
import { canAccessIntegrationInventory, integrationTenantAllowed, showPartsPredictions } from "../global-dashboard-integration.rbac";
import { cardStyle, mutedStyle, panelStyle, titleStyle } from "../global-dashboard-integration.styles";
import { integrationWidgetLabel } from "../global-dashboard-integration.widgets";
import { useGlobalDashboardIntegrationApi } from "../hooks/useGlobalDashboardIntegrationApi";

export function PartsUsagePredictionsPanel(props: { readonly dashboard: IntegrationDashboard }) {
  const api = useGlobalDashboardIntegrationApi();
  const [items, setItems] = useState<readonly IntegrationInventoryItem[]>([]);

  useEffect(() => {
    if (api.session === null || showPartsPredictions(props.dashboard, api.session.role) === false) {
      setItems([]);
      return;
    }
    void (async () => {
      const payload = (await api.request(api.routes.inventory)) as readonly IntegrationInventoryItem[] | null;
      if (payload) {
        setItems(payload);
      }
    })();
  }, [api.request, api.routes.inventory, api.session, props.dashboard]);

  const session = api.session;
  if (api.allowed === false || session === null || showPartsPredictions(props.dashboard, session.role) === false) {
    return null;
  }
  if (canAccessIntegrationInventory(session.role) === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{integrationWidgetLabel("parts_predictions")}</h2>
      {items.map((item) =>
        integrationTenantAllowed(session.role, session.tenant_id, item.tenant_id) ? (
          <article key={item.part_id} style={cardStyle}>
            <p style={mutedStyle}>{item.name}</p>
            <p style={mutedStyle}>predictive {item.predictive_usage}</p>
          </article>
        ) : null,
      )}
    </section>
  );
}
