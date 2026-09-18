"use client";

import { useEffect, useState } from "react";
import type { FleetManagerFilter, FleetPmStatusItem } from "../fleet-manager-dashboard.interface";
import { fleetManagerTenantAllowed } from "../fleet-manager-dashboard.rbac";
import { cardStyle, linkStyle, mutedStyle, panelStyle, titleStyle } from "../fleet-manager-dashboard.styles";
import { fleetManagerWidgetLabel } from "../fleet-manager-dashboard.widgets";
import { useFleetManagerApi } from "../hooks/useFleetManagerApi";

export function PmCompliancePanel(props: { readonly filter: FleetManagerFilter }) {
  const api = useFleetManagerApi(props.filter);
  const [items, setItems] = useState<readonly FleetPmStatusItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.pm_status)) as readonly FleetPmStatusItem[] | null;
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
      <h2 style={titleStyle}>{fleetManagerWidgetLabel("pm")}</h2>
      {items.map((item) => (
        <article key={item.pm_schedule_id} style={cardStyle}>
          <a href={"/pm/schedules/" + item.pm_schedule_id} style={linkStyle}>
            {item.pm_schedule_id}
          </a>
          <p style={mutedStyle}>
            {item.status} asset {item.asset_id} due {item.due_miles}/{item.due_hours}
          </p>
        </article>
      ))}
    </section>
  );
}
