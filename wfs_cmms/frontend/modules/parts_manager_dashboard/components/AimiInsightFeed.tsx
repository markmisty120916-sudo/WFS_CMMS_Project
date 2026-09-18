"use client";

import { useEffect, useState } from "react";
import type { PartsManagerFilter, PartsPredictiveItem } from "../parts-manager-dashboard.interface";
import { partsManagerTenantAllowed } from "../parts-manager-dashboard.rbac";
import { accentStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../parts-manager-dashboard.styles";
import { partsManagerWidgetLabel } from "../parts-manager-dashboard.widgets";
import { usePartsManagerApi } from "../hooks/usePartsManagerApi";

export function AimiInsightFeed(props: { readonly filter: PartsManagerFilter }) {
  const api = usePartsManagerApi(props.filter);
  const [items, setItems] = useState<readonly PartsPredictiveItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.predictive_usage)) as readonly PartsPredictiveItem[] | null;
      if (payload && api.session) {
        setItems(payload.filter((item) => partsManagerTenantAllowed(api.session.tenant_id, item.tenant_id)));
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{partsManagerWidgetLabel("insights")}</h2>
      {items.map((item) => (
        <article key={item.event_id} style={cardStyle}>
          <p style={accentStyle}>{item.event_type}</p>
          <p style={mutedStyle}>
            {item.reason} part {item.part_id} {item.timestamp}
          </p>
        </article>
      ))}
    </section>
  );
}
