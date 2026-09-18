"use client";

import { useEffect, useState } from "react";
import type { ComplianceAimiInsightItem, ComplianceDashboardFilter } from "../compliance-dashboard.interface";
import { complianceDashboardTenantAllowed } from "../compliance-dashboard.rbac";
import { accentStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../compliance-dashboard.styles";
import { complianceDashboardWidgetLabel } from "../compliance-dashboard.widgets";
import { useComplianceDashboardApi } from "../hooks/useComplianceDashboardApi";

export function AimiComplianceInsights(props: { readonly filter: ComplianceDashboardFilter }) {
  const api = useComplianceDashboardApi(props.filter);
  const [items, setItems] = useState<readonly ComplianceAimiInsightItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.aimi_insights)) as readonly ComplianceAimiInsightItem[] | null;
      if (payload && api.session) {
        setItems(payload.filter((item) => complianceDashboardTenantAllowed(api.session.tenant_id, item.tenant_id)));
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{complianceDashboardWidgetLabel("insights")}</h2>
      {items.map((item) => (
        <article key={item.event_id} style={cardStyle}>
          <p style={accentStyle}>{item.event_type}</p>
          <p style={mutedStyle}>
            {item.reason} asset {item.asset_id} {item.timestamp}
          </p>
        </article>
      ))}
    </section>
  );
}
