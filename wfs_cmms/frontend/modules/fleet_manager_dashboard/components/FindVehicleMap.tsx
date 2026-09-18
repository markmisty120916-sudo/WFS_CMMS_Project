"use client";

import { useEffect, useState } from "react";
import type { FleetFindVehicleResult, FleetManagerFilter } from "../fleet-manager-dashboard.interface";
import { fleetManagerTenantAllowed } from "../fleet-manager-dashboard.rbac";
import { accentStyle, cardStyle, linkStyle, mutedStyle, panelStyle, titleStyle } from "../fleet-manager-dashboard.styles";
import { fleetManagerWidgetLabel } from "../fleet-manager-dashboard.widgets";
import { useFleetManagerApi } from "../hooks/useFleetManagerApi";

export function FindVehicleMap(props: { readonly filter: FleetManagerFilter }) {
  const api = useFleetManagerApi(props.filter);
  const [data, setData] = useState<FleetFindVehicleResult | null>(null);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.find_vehicle)) as FleetFindVehicleResult | null;
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
      <h2 style={titleStyle}>{data ? data.label : fleetManagerWidgetLabel("find_vehicle")}</h2>
      <div className="relative min-h-[180px] rounded-lg border border-cyan-400" style={{ background: "#05010d", minHeight: "180px", border: "1px solid #22d3ee", borderRadius: "8px", padding: "12px" }}>
        {(data ? data.points : []).map((point, index) => (
          <article key={point.telematics_id + point.timestamp + String(index)} style={cardStyle}>
            <a href={"/assets/" + point.asset_id} style={linkStyle}>
              {point.unit_number || point.asset_id}
            </a>
            <p style={accentStyle}>{point.source}</p>
            <p style={mutedStyle}>
              {point.fault_code} {point.severity} {point.timestamp}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
