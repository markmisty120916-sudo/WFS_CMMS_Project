"use client";

import { useEffect, useState } from "react";
import type { PartsAwaitingItem, PartsManagerFilter } from "../parts-manager-dashboard.interface";
import { partsManagerTenantAllowed } from "../parts-manager-dashboard.rbac";
import { accentStyle, cardStyle, linkStyle, mutedStyle, panelStyle, titleStyle } from "../parts-manager-dashboard.styles";
import { partsManagerWidgetLabel } from "../parts-manager-dashboard.widgets";
import { usePartsManagerApi } from "../hooks/usePartsManagerApi";

export function AwaitingPartsQueue(props: { readonly filter: PartsManagerFilter }) {
  const api = usePartsManagerApi(props.filter);
  const [items, setItems] = useState<readonly PartsAwaitingItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.awaiting_parts)) as readonly PartsAwaitingItem[] | null;
      if (payload && api.session) {
        const next: PartsAwaitingItem[] = [];
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
      <h2 style={titleStyle}>{partsManagerWidgetLabel("awaiting")}</h2>
      {items.map((item) => (
        <article key={item.workorder_id + item.part_id + item.status} style={cardStyle}>
          <a href={"/workorders/" + item.workorder_id} style={linkStyle}>
            {item.workorder_id}
          </a>
          <p style={accentStyle}>{item.severity}</p>
          <p style={mutedStyle}>
            part {item.part_id} qty {item.quantity} {item.status}
          </p>
        </article>
      ))}
    </section>
  );
}
