"use client";

import { useEffect, useState } from "react";
import type { FleetManagerFilter, FleetTechnicianWorkloadItem } from "../fleet-manager-dashboard.interface";
import { fleetManagerTenantAllowed } from "../fleet-manager-dashboard.rbac";
import { accentStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../fleet-manager-dashboard.styles";
import { fleetManagerWidgetLabel } from "../fleet-manager-dashboard.widgets";
import { useFleetManagerApi } from "../hooks/useFleetManagerApi";

export function TechnicianWorkloadPanel(props: { readonly filter: FleetManagerFilter }) {
  const api = useFleetManagerApi(props.filter);
  const [items, setItems] = useState<readonly FleetTechnicianWorkloadItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.technician_workload)) as readonly FleetTechnicianWorkloadItem[] | null;
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
      <h2 style={titleStyle}>{fleetManagerWidgetLabel("workload")}</h2>
      {items.map((item) => (
        <article key={item.technician_id} style={cardStyle}>
          <p style={accentStyle}>{item.technician_id}</p>
          <p style={mutedStyle}>assigned {item.assigned_count} S1 {item.s1_count} awaiting parts {item.waiting_parts_count}</p>
        </article>
      ))}
    </section>
  );
}
