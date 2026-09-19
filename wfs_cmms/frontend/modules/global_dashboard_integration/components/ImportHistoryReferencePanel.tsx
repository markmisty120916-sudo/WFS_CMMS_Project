"use client";

import { useEffect, useState } from "react";
import type { DtoRole } from "../../../../src/core/dto/base.dto";
import type { ImportHistoryReference, IntegrationAssetItem } from "../global-dashboard-integration.interface";
import { integrationTenantAllowed } from "../global-dashboard-integration.rbac";
import { cardStyle, mutedStyle, panelStyle, titleStyle } from "../global-dashboard-integration.styles";
import { integrationStatusLabel, integrationWidgetLabel } from "../global-dashboard-integration.widgets";
import { useGlobalDashboardIntegrationApi } from "../hooks/useGlobalDashboardIntegrationApi";
import { PanelFallback } from "./PanelFallback";

function uniqueImportHistory(items: readonly IntegrationAssetItem[], role: DtoRole, tenant_id: string): readonly ImportHistoryReference[] {
  const history: ImportHistoryReference[] = [];
  const seen: Record<string, true> = {};
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (integrationTenantAllowed(role, tenant_id, item.tenant_id) === true) {
      let historyIndex = 0;
      while (historyIndex < item.import_history.length) {
        const row = item.import_history[historyIndex];
        const key = row.tenant_id + ":" + row.import_id;
        if (seen[key] !== true && integrationTenantAllowed(role, tenant_id, row.tenant_id) === true) {
          seen[key] = true;
          history.push(row);
        }
        historyIndex = historyIndex + 1;
      }
    }
    index = index + 1;
  }
  return history;
}

export function ImportHistoryReferencePanel() {
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
    return <PanelFallback title={integrationWidgetLabel("imports")} state="loading" />;
  }
  if (error === true) {
    return <PanelFallback title={integrationWidgetLabel("imports")} state="error" />;
  }

  const history = uniqueImportHistory(items, session.role, session.tenant_id);
  if (history.length === 0) {
    return <PanelFallback title={integrationWidgetLabel("imports")} state="empty" />;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{integrationWidgetLabel("imports")}</h2>
      <p style={mutedStyle}>{integrationWidgetLabel("imports_readonly")}</p>
      {history.map((row) =>
        integrationTenantAllowed(session.role, session.tenant_id, row.tenant_id) ? (
          <article key={row.tenant_id + ":" + row.import_id} style={cardStyle}>
            <p style={mutedStyle}>
              {row.data_type} {row.file_format} {integrationStatusLabel(row.status)}
            </p>
            <p style={mutedStyle}>{row.created_at}</p>
          </article>
        ) : null,
      )}
    </section>
  );
}
