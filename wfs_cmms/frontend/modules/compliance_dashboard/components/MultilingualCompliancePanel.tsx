"use client";

import { useEffect, useState } from "react";
import type { ComplianceDashboardFilter, ComplianceMultilingualItem } from "../compliance-dashboard.interface";
import { complianceDashboardTenantAllowed } from "../compliance-dashboard.rbac";
import { accentStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../compliance-dashboard.styles";
import { complianceDashboardWidgetLabel } from "../compliance-dashboard.widgets";
import { useComplianceDashboardApi } from "../hooks/useComplianceDashboardApi";

export function MultilingualCompliancePanel(props: { readonly filter: ComplianceDashboardFilter }) {
  const api = useComplianceDashboardApi(props.filter);
  const [items, setItems] = useState<readonly ComplianceMultilingualItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.multilingual)) as readonly ComplianceMultilingualItem[] | null;
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
      <h2 style={titleStyle}>{complianceDashboardWidgetLabel("multilingual")}</h2>
      {items.map((item) => (
        <article key={item.event_id} style={cardStyle}>
          <p style={accentStyle}>{item.event_type}</p>
          <p style={mutedStyle}>
            asset {item.asset_id} {item.timestamp}
          </p>
        </article>
      ))}
    </section>
  );
}
