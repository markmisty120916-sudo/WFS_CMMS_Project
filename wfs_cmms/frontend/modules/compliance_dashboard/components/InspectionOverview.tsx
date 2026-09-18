"use client";

import { useEffect, useState } from "react";
import type { ComplianceDashboardFilter, ComplianceOverview } from "../compliance-dashboard.interface";
import { complianceDashboardTenantAllowed } from "../compliance-dashboard.rbac";
import { accentStyle, mutedStyle, panelStyle, titleStyle } from "../compliance-dashboard.styles";
import { complianceDashboardWidgetLabel } from "../compliance-dashboard.widgets";
import { useComplianceDashboardApi } from "../hooks/useComplianceDashboardApi";

export function InspectionOverview(props: { readonly filter: ComplianceDashboardFilter }) {
  const api = useComplianceDashboardApi(props.filter);
  const [data, setData] = useState<ComplianceOverview | null>(null);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.overview)) as ComplianceOverview | null;
      if (payload && api.session && complianceDashboardTenantAllowed(api.session.tenant_id, payload.tenant_id)) {
        setData(payload);
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{complianceDashboardWidgetLabel("overview")}</h2>
      <p style={accentStyle}>open {data ? data.open_count : "0"}</p>
      <p style={mutedStyle}>
        overdue {data ? data.overdue_count : "0"} upcoming {data ? data.upcoming_count : "0"}
      </p>
      {(data ? data.items : []).map((item) => (
        <p key={item.inspection_id} style={mutedStyle}>
          {item.inspection_id} {item.type} {item.status} asset {item.asset_id}
        </p>
      ))}
    </section>
  );
}
