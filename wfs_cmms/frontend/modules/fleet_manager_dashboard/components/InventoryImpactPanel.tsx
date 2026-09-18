"use client";

import { useEffect, useState } from "react";
import type { FleetInventoryImpactItem, FleetManagerFilter } from "../fleet-manager-dashboard.interface";
import { fleetManagerTenantAllowed } from "../fleet-manager-dashboard.rbac";
import { accentStyle, cardStyle, linkStyle, mutedStyle, panelStyle, titleStyle } from "../fleet-manager-dashboard.styles";
import { fleetManagerWidgetLabel } from "../fleet-manager-dashboard.widgets";
import { useFleetManagerApi } from "../hooks/useFleetManagerApi";

export function InventoryImpactPanel(props: { readonly filter: FleetManagerFilter }) {
  const api = useFleetManagerApi(props.filter);
  const [items, setItems] = useState<readonly FleetInventoryImpactItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.inventory_impact)) as readonly FleetInventoryImpactItem[] | null;
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
      <h2 style={titleStyle}>{fleetManagerWidgetLabel("inventory")}</h2>
      {items.map((item, index) => (
        <article key={item.part_id + item.workorder_id + String(index)} style={cardStyle}>
          <p style={accentStyle}>{item.impact}</p>
          {item.part_id !== "" ? (
            <a href={"/parts/" + item.part_id} style={linkStyle}>
              {item.name}
            </a>
          ) : null}
          {item.workorder_id !== "" ? (
            <a href={"/workorders/" + item.workorder_id} style={linkStyle}>
              {item.workorder_id}
            </a>
          ) : null}
          <p style={mutedStyle}>qty {item.quantity}</p>
        </article>
      ))}
    </section>
  );
}
