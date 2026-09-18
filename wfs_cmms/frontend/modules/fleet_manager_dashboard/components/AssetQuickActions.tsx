"use client";

import { useEffect, useState } from "react";
import type { FleetHealthItem, FleetManagerFilter } from "../fleet-manager-dashboard.interface";
import { canMutateFleetManagerDashboard, fleetManagerTenantAllowed } from "../fleet-manager-dashboard.rbac";
import { buttonStyle, mutedStyle, panelStyle, titleStyle } from "../fleet-manager-dashboard.styles";
import { fleetManagerWidgetLabel } from "../fleet-manager-dashboard.widgets";
import { useFleetManagerApi } from "../hooks/useFleetManagerApi";

export function AssetQuickActions(props: { readonly filter: FleetManagerFilter }) {
  const api = useFleetManagerApi(props.filter);
  const [items, setItems] = useState<readonly FleetHealthItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.health)) as { items?: readonly FleetHealthItem[]; tenant_id?: string } | null;
      if (payload && api.session && typeof payload.tenant_id === "string" && fleetManagerTenantAllowed(api.session.tenant_id, payload.tenant_id)) {
        setItems(payload.items || []);
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  const full = api.session !== null && canMutateFleetManagerDashboard(api.session.role);

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{fleetManagerWidgetLabel("quick_actions")}</h2>
      {items.map((item) => (
        <p key={item.asset_id} style={mutedStyle}>
          {item.unit_number}
          <a href={"/assets/" + item.asset_id} style={buttonStyle}>
            open asset
          </a>
          <a href={"/workorders?asset_id=" + encodeURIComponent(item.asset_id)} style={buttonStyle}>
            open workorders
          </a>
          <a href={"/pm/schedules?asset_id=" + encodeURIComponent(item.asset_id)} style={buttonStyle}>
            open PM schedule
          </a>
          {full === true ? (
            <a href={"/asset-manager"} style={buttonStyle}>
              Asset Manager
            </a>
          ) : null}
        </p>
      ))}
    </section>
  );
}
