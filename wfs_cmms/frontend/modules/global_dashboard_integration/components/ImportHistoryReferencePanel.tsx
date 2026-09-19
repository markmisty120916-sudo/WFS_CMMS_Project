"use client";

import { useEffect, useState } from "react";
import type { IntegrationAssetItem } from "../global-dashboard-integration.interface";
import { integrationTenantAllowed } from "../global-dashboard-integration.rbac";
import { cardStyle, mutedStyle, panelStyle, titleStyle } from "../global-dashboard-integration.styles";
import { integrationWidgetLabel } from "../global-dashboard-integration.widgets";
import { useGlobalDashboardIntegrationApi } from "../hooks/useGlobalDashboardIntegrationApi";

export function ImportHistoryReferencePanel() {
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

  const history = items.length > 0 ? items[0].import_history : [];

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{integrationWidgetLabel("imports")}</h2>
      {history.map((row) =>
        integrationTenantAllowed(session.role, session.tenant_id, row.tenant_id) ? (
          <article key={row.import_id} style={cardStyle}>
            <p style={mutedStyle}>
              {row.data_type} {row.file_format} {row.status}
            </p>
            <p style={mutedStyle}>{row.created_at}</p>
          </article>
        ) : null,
      )}
    </section>
  );
}
