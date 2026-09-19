"use client";

import { useEffect, useState } from "react";
import type { IntegrationTelematicsResult } from "../global-dashboard-integration.interface";
import { integrationTenantAllowed } from "../global-dashboard-integration.rbac";
import { accentStyle, cardStyle, linkStyle, mutedStyle, panelStyle, severityColorStyle, titleStyle } from "../global-dashboard-integration.styles";
import { integrationWidgetLabel } from "../global-dashboard-integration.widgets";
import { useGlobalDashboardIntegrationApi } from "../hooks/useGlobalDashboardIntegrationApi";

export function FindVehicleMap() {
  const api = useGlobalDashboardIntegrationApi();
  const [data, setData] = useState<IntegrationTelematicsResult | null>(null);

  useEffect(() => {
    if (api.allowed === false) {
      return;
    }
    void (async () => {
      const payload = (await api.request(api.routes.telematics)) as IntegrationTelematicsResult | null;
      if (payload && api.session && (payload.tenant_id === "" || integrationTenantAllowed(api.session.role, api.session.tenant_id, payload.tenant_id))) {
        setData(payload);
      }
    })();
  }, [api.allowed, api.request, api.routes.telematics, api.session]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{data ? data.label : integrationWidgetLabel("find_vehicle")}</h2>
      <div
        className="relative min-h-[180px] rounded-lg border border-cyan-400"
        style={{ background: "#05010d", minHeight: "180px", border: "1px solid #22d3ee", borderRadius: "8px", padding: "12px" }}
      >
        {(data ? data.points : []).map((point, index) =>
          api.session && integrationTenantAllowed(api.session.role, api.session.tenant_id, point.tenant_id) ? (
            <article key={point.telematics_id + point.timestamp + String(index)} style={cardStyle}>
              <a href={"/assets/" + point.asset_id} style={linkStyle}>
                {point.unit_number || point.asset_id}
              </a>
              <p style={accentStyle}>{point.source}</p>
              <p style={severityColorStyle(point.severity_color)}>
                Find Vehicle {point.fault_code} {point.severity} {point.timestamp}
              </p>
              <p style={mutedStyle}>{point.fault_description}</p>
            </article>
          ) : null,
        )}
      </div>
    </section>
  );
}
