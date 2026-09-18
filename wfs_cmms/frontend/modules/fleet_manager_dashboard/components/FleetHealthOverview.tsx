"use client";

import { useEffect, useState } from "react";
import type { FleetHealthOverview, FleetManagerFilter } from "../fleet-manager-dashboard.interface";
import { fleetManagerTenantAllowed } from "../fleet-manager-dashboard.rbac";
import { accentStyle, mutedStyle, panelStyle, titleStyle } from "../fleet-manager-dashboard.styles";
import { fleetManagerWidgetLabel } from "../fleet-manager-dashboard.widgets";
import { useFleetManagerApi } from "../hooks/useFleetManagerApi";

export function FleetHealthOverview(props: { readonly filter: FleetManagerFilter }) {
  const api = useFleetManagerApi(props.filter);
  const [data, setData] = useState<FleetHealthOverview | null>(null);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.health)) as FleetHealthOverview | null;
      if (payload && api.session && fleetManagerTenantAllowed(api.session.tenant_id, payload.tenant_id)) {
        setData(payload);
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{fleetManagerWidgetLabel("health")}</h2>
      <p style={accentStyle}>assets {data ? data.asset_count : "0"}</p>
      <p style={mutedStyle}>S1 {data ? data.s1 : "0"} S2 {data ? data.s2 : "0"} S3 {data ? data.s3 : "0"} S4 {data ? data.s4 : "0"} S5 {data ? data.s5 : "0"}</p>
      {(data ? data.items : []).map((item) => (
        <p key={item.asset_id} style={mutedStyle}>
          {item.unit_number} health {item.health_score} {item.severity}
        </p>
      ))}
    </section>
  );
}
