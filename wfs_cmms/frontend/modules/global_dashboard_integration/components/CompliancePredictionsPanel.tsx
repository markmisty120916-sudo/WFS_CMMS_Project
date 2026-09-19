"use client";

import { useEffect, useState } from "react";
import type { IntegrationComplianceItem, IntegrationDashboard } from "../global-dashboard-integration.interface";
import { canAccessIntegrationCompliance, integrationTenantAllowed, showCompliancePredictions } from "../global-dashboard-integration.rbac";
import { cardStyle, mutedStyle, panelStyle, titleStyle } from "../global-dashboard-integration.styles";
import { integrationStatusLabel, integrationWidgetLabel } from "../global-dashboard-integration.widgets";
import { useGlobalDashboardIntegrationApi } from "../hooks/useGlobalDashboardIntegrationApi";

export function CompliancePredictionsPanel(props: { readonly dashboard: IntegrationDashboard }) {
  const api = useGlobalDashboardIntegrationApi();
  const [items, setItems] = useState<readonly IntegrationComplianceItem[]>([]);

  useEffect(() => {
    if (api.session === null || showCompliancePredictions(props.dashboard, api.session.role) === false) {
      setItems([]);
      return;
    }
    void (async () => {
      const payload = (await api.request(api.routes.compliance)) as readonly IntegrationComplianceItem[] | null;
      if (payload) {
        setItems(payload);
      }
    })();
  }, [api.request, api.routes.compliance, api.session, props.dashboard]);

  const session = api.session;
  if (api.allowed === false || session === null || showCompliancePredictions(props.dashboard, session.role) === false) {
    return null;
  }
  if (canAccessIntegrationCompliance(session.role) === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{integrationWidgetLabel("compliance_predictions")}</h2>
      {items.map((item) =>
        integrationTenantAllowed(session.role, session.tenant_id, item.tenant_id) ? (
          <article key={item.inspection_id} style={cardStyle}>
            <p style={mutedStyle}>
              {item.type} {integrationStatusLabel(item.status)} {item.asset_id}
            </p>
          </article>
        ) : null,
      )}
    </section>
  );
}
