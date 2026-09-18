"use client";

import { useEffect, useState } from "react";
import type { FleetAimiInsightItem, FleetManagerFilter } from "../fleet-manager-dashboard.interface";
import { fleetManagerTenantAllowed } from "../fleet-manager-dashboard.rbac";
import { accentStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../fleet-manager-dashboard.styles";
import { fleetManagerWidgetLabel } from "../fleet-manager-dashboard.widgets";
import { useFleetManagerApi } from "../hooks/useFleetManagerApi";

export function AimiInsightFeed(props: { readonly filter: FleetManagerFilter }) {
  const api = useFleetManagerApi(props.filter);
  const [items, setItems] = useState<readonly FleetAimiInsightItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.aimi_insights)) as readonly FleetAimiInsightItem[] | null;
      if (payload && api.session) {
        setItems(payload.filter((item) => fleetManagerTenantAllowed(api.session.tenant_id, item.tenant_id)));
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{fleetManagerWidgetLabel("insights")}</h2>
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
