"use client";

import { useEffect, useState } from "react";
import type { ComplianceDashboardFilter, ComplianceSafetyWorkorderItem } from "../compliance-dashboard.interface";
import { canUseComplianceLimitedActions, complianceDashboardTenantAllowed } from "../compliance-dashboard.rbac";
import { accentStyle, cardStyle, linkStyle, mutedStyle, panelStyle, titleStyle } from "../compliance-dashboard.styles";
import { complianceDashboardWidgetLabel } from "../compliance-dashboard.widgets";
import { useComplianceDashboardApi } from "../hooks/useComplianceDashboardApi";

export function SafetyWorkordersQueue(props: { readonly filter: ComplianceDashboardFilter }) {
  const api = useComplianceDashboardApi(props.filter);
  const [items, setItems] = useState<readonly ComplianceSafetyWorkorderItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.safety_workorders)) as readonly ComplianceSafetyWorkorderItem[] | null;
      if (payload && api.session) {
        setItems(payload.filter((item) => complianceDashboardTenantAllowed(api.session.tenant_id, item.tenant_id)));
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  const limited = api.session !== null && canUseComplianceLimitedActions(api.session.role);

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{complianceDashboardWidgetLabel("safety")}</h2>
      {items.map((item) => (
        <article key={item.workorder_id} style={cardStyle}>
          {limited === true ? (
            <a href={"/workorders/" + item.workorder_id} style={linkStyle}>
              {item.workorder_id}
            </a>
          ) : (
            <p style={accentStyle}>{item.workorder_id}</p>
          )}
          <p style={accentStyle}>{item.severity}</p>
          <p style={mutedStyle}>
            {item.status} tech {item.routing_tech_id} asset {item.asset_id}
          </p>
        </article>
      ))}
    </section>
  );
}
