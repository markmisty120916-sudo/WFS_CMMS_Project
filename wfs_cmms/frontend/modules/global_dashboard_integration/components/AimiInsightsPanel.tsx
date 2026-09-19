"use client";

import { useEffect, useState } from "react";
import type { IntegrationAimiItem, IntegrationDashboard } from "../global-dashboard-integration.interface";
import { canAccessIntegrationAimiInsights, integrationTenantAllowed, showAimiInsights } from "../global-dashboard-integration.rbac";
import { cardStyle, mutedStyle, panelStyle, severityColorStyle, titleStyle } from "../global-dashboard-integration.styles";
import { integrationWidgetLabel } from "../global-dashboard-integration.widgets";
import { useGlobalDashboardIntegrationApi } from "../hooks/useGlobalDashboardIntegrationApi";

export function AimiInsightsPanel(props: { readonly dashboard: IntegrationDashboard }) {
  const api = useGlobalDashboardIntegrationApi();
  const [items, setItems] = useState<readonly IntegrationAimiItem[]>([]);

  useEffect(() => {
    if (api.session === null || showAimiInsights(props.dashboard, api.session.role) === false) {
      setItems([]);
      return;
    }
    void (async () => {
      const payload = (await api.request(api.routes.aimi)) as readonly IntegrationAimiItem[] | null;
      if (payload) {
        setItems(payload);
      }
    })();
  }, [api.request, api.routes.aimi, api.session, props.dashboard]);

  const session = api.session;
  if (api.allowed === false || session === null || showAimiInsights(props.dashboard, session.role) === false) {
    return null;
  }
  if (canAccessIntegrationAimiInsights(session.role) === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{integrationWidgetLabel("aimi")}</h2>
      {items.map((item, index) =>
        integrationTenantAllowed(session.role, session.tenant_id, item.tenant_id) ? (
          <article key={item.event_type + item.timestamp + String(index)} style={cardStyle}>
            <p style={severityColorStyle(item.severity_color)}>
              {item.insight_type} {item.insight_severity}
            </p>
            <p style={mutedStyle}>predictive {item.predictive_score}</p>
            <p style={mutedStyle}>failure {item.failure_risk}</p>
            <p style={mutedStyle}>anomaly {item.anomaly}</p>
            <p style={mutedStyle}>compliance {item.compliance_prediction}</p>
            <p style={mutedStyle}>parts {item.parts_usage_prediction}</p>
          </article>
        ) : null,
      )}
    </section>
  );
}
