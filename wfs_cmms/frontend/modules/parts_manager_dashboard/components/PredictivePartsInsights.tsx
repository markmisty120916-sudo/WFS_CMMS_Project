"use client";

import { useEffect, useState } from "react";
import type { PartsManagerFilter, PartsPredictiveItem } from "../parts-manager-dashboard.interface";
import { partsManagerTenantAllowed } from "../parts-manager-dashboard.rbac";
import { accentStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../parts-manager-dashboard.styles";
import { partsManagerWidgetLabel } from "../parts-manager-dashboard.widgets";
import { usePartsManagerApi } from "../hooks/usePartsManagerApi";

export function PredictivePartsInsights(props: { readonly filter: PartsManagerFilter }) {
  const api = usePartsManagerApi(props.filter);
  const [items, setItems] = useState<readonly PartsPredictiveItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.predictive_usage)) as readonly PartsPredictiveItem[] | null;
      if (payload && api.session) {
        const next: PartsPredictiveItem[] = [];
        let index = 0;
        while (index < payload.length) {
          if (partsManagerTenantAllowed(api.session.tenant_id, payload[index].tenant_id)) {
            next.push(payload[index]);
          }
          index = index + 1;
        }
        setItems(next);
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{partsManagerWidgetLabel("predictive")}</h2>
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
