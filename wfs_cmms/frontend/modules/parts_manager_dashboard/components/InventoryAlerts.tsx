"use client";

import { useEffect, useState } from "react";
import type { PartsAlertItem, PartsManagerFilter } from "../parts-manager-dashboard.interface";
import { partsManagerTenantAllowed } from "../parts-manager-dashboard.rbac";
import { accentStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../parts-manager-dashboard.styles";
import { partsManagerWidgetLabel } from "../parts-manager-dashboard.widgets";
import { usePartsManagerApi } from "../hooks/usePartsManagerApi";

export function InventoryAlerts(props: { readonly filter: PartsManagerFilter }) {
  const api = usePartsManagerApi(props.filter);
  const [items, setItems] = useState<readonly PartsAlertItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.alerts)) as readonly PartsAlertItem[] | null;
      if (payload && api.session) {
        const next: PartsAlertItem[] = [];
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
      <h2 style={titleStyle}>{partsManagerWidgetLabel("alerts")}</h2>
      {items.map((item) => (
        <article key={item.alert_type + item.part_id + item.workorder_id + item.message} style={cardStyle}>
          <p style={accentStyle}>{item.alert_type}</p>
          <p style={mutedStyle}>
            part {item.part_id} wo {item.workorder_id} {item.vendor_name} {item.message}
          </p>
        </article>
      ))}
    </section>
  );
}
