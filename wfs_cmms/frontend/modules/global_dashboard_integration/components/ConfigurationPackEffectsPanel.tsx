"use client";

import { useEffect, useState } from "react";
import type { DtoRole } from "../../../../src/core/dto/base.dto";
import type { ConfigurationPackEffect, IntegrationAssetItem } from "../global-dashboard-integration.interface";
import { integrationTenantAllowed } from "../global-dashboard-integration.rbac";
import { cardStyle, mutedStyle, panelStyle, severityColorStyle, titleStyle } from "../global-dashboard-integration.styles";
import { integrationWidgetLabel } from "../global-dashboard-integration.widgets";
import { useGlobalDashboardIntegrationApi } from "../hooks/useGlobalDashboardIntegrationApi";
import { PanelFallback } from "./PanelFallback";

function uniquePackEffects(items: readonly IntegrationAssetItem[], role: DtoRole, tenant_id: string): readonly ConfigurationPackEffect[] {
  const packs: ConfigurationPackEffect[] = [];
  const seen: Record<string, true> = {};
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (integrationTenantAllowed(role, tenant_id, item.tenant_id) === true) {
      let packIndex = 0;
      while (packIndex < item.pack_effects.length) {
        const pack = item.pack_effects[packIndex];
        const key = pack.tenant_id + ":" + pack.pack_id;
        if (seen[key] !== true && integrationTenantAllowed(role, tenant_id, pack.tenant_id) === true) {
          seen[key] = true;
          packs.push(pack);
        }
        packIndex = packIndex + 1;
      }
    }
    index = index + 1;
  }
  return packs;
}

export function ConfigurationPackEffectsPanel() {
  const api = useGlobalDashboardIntegrationApi();
  const [items, setItems] = useState<readonly IntegrationAssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (api.allowed === false) {
      return;
    }
    setLoading(true);
    void (async () => {
      const payload = (await api.request(api.routes.assets)) as readonly IntegrationAssetItem[] | null;
      if (payload) {
        setItems(payload);
        setError(false);
      } else {
        setError(true);
      }
      setLoading(false);
    })();
  }, [api.allowed, api.request, api.routes.assets]);

  const session = api.session;
  if (api.allowed === false || session === null) {
    return null;
  }
  if (loading === true) {
    return <PanelFallback title={integrationWidgetLabel("packs")} state="loading" />;
  }
  if (error === true) {
    return <PanelFallback title={integrationWidgetLabel("packs")} state="error" />;
  }

  const packs = uniquePackEffects(items, session.role, session.tenant_id);
  if (packs.length === 0) {
    return <PanelFallback title={integrationWidgetLabel("packs")} state="empty" />;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{integrationWidgetLabel("packs")}</h2>
      {packs.map((pack) =>
        integrationTenantAllowed(session.role, session.tenant_id, pack.tenant_id) ? (
          <article key={pack.tenant_id + ":" + pack.pack_id} style={cardStyle}>
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
