"use client";

import { useEffect, useState } from "react";
import type { IntegrationAssetItem } from "../global-dashboard-integration.interface";
import { integrationTenantAllowed } from "../global-dashboard-integration.rbac";
import { cardStyle, mutedStyle, panelStyle, severityColorStyle, titleStyle } from "../global-dashboard-integration.styles";
import { integrationWidgetLabel } from "../global-dashboard-integration.widgets";
import { useGlobalDashboardIntegrationApi } from "../hooks/useGlobalDashboardIntegrationApi";

export function ConfigurationPackEffectsPanel() {
  const api = useGlobalDashboardIntegrationApi();
  const [items, setItems] = useState<readonly IntegrationAssetItem[]>([]);

  useEffect(() => {
    if (api.allowed === false) {
      return;
    }
    void (async () => {
      const payload = (await api.request(api.routes.assets)) as readonly IntegrationAssetItem[] | null;
      if (payload) {
        setItems(payload);
      }
    })();
  }, [api.allowed, api.request, api.routes.assets]);

  const session = api.session;
  if (api.allowed === false || session === null) {
    return null;
  }

  const packs = items.length > 0 ? items[0].pack_effects : [];

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{integrationWidgetLabel("packs")}</h2>
      {packs.map((pack) =>
        integrationTenantAllowed(session.role, session.tenant_id, pack.tenant_id) ? (
          <article key={pack.pack_id} style={cardStyle}>
            <p style={severityColorStyle(pack.severity_color)}>
              {pack.name} {pack.severity_default}
            </p>
            <p style={mutedStyle}>{pack.pm_interval}</p>
            <p style={mutedStyle}>{pack.pm_template_name}</p>
            <p style={mutedStyle}>{pack.workorder_source}</p>
          </article>
        ) : null,
      )}
    </section>
  );
}
