"use client";

import { useEffect, useState } from "react";
import type { PartsManagerFilter, PartsUsageItem } from "../parts-manager-dashboard.interface";
import { partsManagerTenantAllowed } from "../parts-manager-dashboard.rbac";
import { accentStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../parts-manager-dashboard.styles";
import { partsManagerWidgetLabel } from "../parts-manager-dashboard.widgets";
import { usePartsManagerApi } from "../hooks/usePartsManagerApi";

export function PartUsageHistory(props: { readonly filter: PartsManagerFilter }) {
  const api = usePartsManagerApi(props.filter);
  const [items, setItems] = useState<readonly PartsUsageItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.usage_history)) as readonly PartsUsageItem[] | null;
      if (payload && api.session) {
        const next: PartsUsageItem[] = [];
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
      <h2 style={titleStyle}>{partsManagerWidgetLabel("usage")}</h2>
      {items.map((item) => (
        <article key={item.part_usage_id} style={cardStyle}>
          <p style={accentStyle}>{item.usage_type}</p>
          <p style={mutedStyle}>
            part {item.part_id} wo {item.workorder_id} qty {item.quantity} {item.created_at}
          </p>
        </article>
      ))}
    </section>
  );
}
