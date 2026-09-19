"use client";

import { useEffect, useState } from "react";
import { reportIntegrationError } from "../global-dashboard-integration.hardening";
import type { IntegrationComplianceItem, IntegrationDashboard } from "../global-dashboard-integration.interface";
import { canAccessIntegrationCompliance, integrationTenantAllowed, showCompliancePredictions } from "../global-dashboard-integration.rbac";
import { cardStyle, mutedStyle, panelStyle, titleStyle } from "../global-dashboard-integration.styles";
import { integrationStatusLabel, integrationWidgetLabel } from "../global-dashboard-integration.widgets";
import { useGlobalDashboardIntegrationApi } from "../hooks/useGlobalDashboardIntegrationApi";
import { PaginationControls, PanelFallback } from "./PanelFallback";

export function CompliancePredictionsPanel(props: { readonly dashboard: IntegrationDashboard }) {
  const [page, setPage] = useState(1);
  const api = useGlobalDashboardIntegrationApi({
    asset_id: "",
    workorder_id: "",
    severity: "",
    status: "",
    vendor_id: "",
    page: String(page),
    limit: "50",
  });
  const [items, setItems] = useState<readonly IntegrationComplianceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (api.session === null || showCompliancePredictions(props.dashboard, api.session.role) === false) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    void (async () => {
      const payload = (await api.request(api.routes.compliance)) as readonly IntegrationComplianceItem[] | null;
      if (payload) {
        setItems(payload);
        setError(false);
      } else {
        setError(true);
        reportIntegrationError(props.dashboard, "compliance");
      }
      setLoading(false);
    })();
  }, [api.request, api.routes.compliance, api.session, props.dashboard]);

  const session = api.session;
  if (api.allowed === false || session === null || showCompliancePredictions(props.dashboard, session.role) === false) {
    return null;
  }
  if (canAccessIntegrationCompliance(session.role) === false) {
    return null;
  }
  if (loading === true) {
    return <PanelFallback title={integrationWidgetLabel("compliance_predictions")} state="loading" />;
  }
  if (error === true) {
    return <PanelFallback title={integrationWidgetLabel("compliance_predictions")} state="error" />;
  }
  if (items.length === 0) {
    return <PanelFallback title={integrationWidgetLabel("compliance_predictions")} state="empty" />;
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
      <PaginationControls page={page} hasMore={items.length >= 50} onPage={setPage} />
    </section>
  );
}
