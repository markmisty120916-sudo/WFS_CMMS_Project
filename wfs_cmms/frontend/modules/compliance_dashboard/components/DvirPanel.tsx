"use client";

import { useEffect, useState } from "react";
import type { ComplianceDashboardFilter, ComplianceDvirItem } from "../compliance-dashboard.interface";
import { canAccessComplianceDvirOnly, complianceDashboardTenantAllowed } from "../compliance-dashboard.rbac";
import { accentStyle, buttonStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../compliance-dashboard.styles";
import { complianceDashboardWidgetLabel } from "../compliance-dashboard.widgets";
import { useComplianceDashboardApi } from "../hooks/useComplianceDashboardApi";

export function DvirPanel(props: { readonly filter: ComplianceDashboardFilter }) {
  const api = useComplianceDashboardApi(props.filter);
  const [items, setItems] = useState<readonly ComplianceDvirItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.dvir)) as readonly ComplianceDvirItem[] | null;
      if (payload && api.session) {
        setItems(payload.filter((item) => complianceDashboardTenantAllowed(api.session.tenant_id, item.tenant_id)));
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  const submit = api.session !== null && canAccessComplianceDvirOnly(api.session.role);

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{complianceDashboardWidgetLabel("dvir")}</h2>
      {submit === true ? (
        <a href="/driver/defects" style={buttonStyle}>
          submit DVIR
        </a>
      ) : null}
      {items.map((item) => (
        <article key={item.violation_id} style={cardStyle}>
          <p style={accentStyle}>{item.severity}</p>
          <p style={mutedStyle}>
            {item.description} asset {item.asset_id} {item.status}
          </p>
        </article>
      ))}
    </section>
  );
}
