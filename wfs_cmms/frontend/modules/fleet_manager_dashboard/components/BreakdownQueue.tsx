"use client";

import { useEffect, useState } from "react";
import type { FleetBreakdownItem, FleetManagerFilter } from "../fleet-manager-dashboard.interface";
import { fleetManagerTenantAllowed } from "../fleet-manager-dashboard.rbac";
import { accentStyle, cardStyle, linkStyle, mutedStyle, panelStyle, titleStyle } from "../fleet-manager-dashboard.styles";
import { fleetManagerWidgetLabel } from "../fleet-manager-dashboard.widgets";
import { useFleetManagerApi } from "../hooks/useFleetManagerApi";

export function BreakdownQueue(props: { readonly filter: FleetManagerFilter }) {
  const api = useFleetManagerApi(props.filter);
  const [items, setItems] = useState<readonly FleetBreakdownItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.breakdowns)) as readonly FleetBreakdownItem[] | null;
      if (payload && api.session) {
        const next: FleetBreakdownItem[] = [];
        let index = 0;
        while (index < payload.length) {
          if (fleetManagerTenantAllowed(api.session.tenant_id, payload[index].tenant_id)) {
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
      <h2 style={titleStyle}>{fleetManagerWidgetLabel("breakdowns")}</h2>
      {items.map((item) => (
        <article key={item.workorder_id} style={cardStyle}>
          <a href={"/workorders/" + item.workorder_id} style={linkStyle}>
            {item.workorder_id}
          </a>
          <p style={accentStyle}>{item.severity}</p>
          <p style={mutedStyle}>
            {item.unit_number} {item.status} tech {item.routing_tech_id}
          </p>
        </article>
      ))}
    </section>
  );
}
