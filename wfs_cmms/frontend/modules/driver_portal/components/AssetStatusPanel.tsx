"use client";

import { useEffect, useState } from "react";
import type { DriverAssignedVehicle, DriverPortalFilter } from "../driver-portal.interface";
import { driverPortalTenantAllowed } from "../driver-portal.rbac";
import { accentStyle, buttonStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../driver-portal.styles";
import { driverPortalWidgetLabel } from "../driver-portal.widgets";
import { driverPortalLabel } from "../driver-portal.locale";
import type { DriverPortalLocale } from "../driver-portal.interface";
import { useDriverPortalApi } from "../hooks/useDriverPortalApi";

export function AssetStatusPanel(props: { readonly filter: DriverPortalFilter; readonly locale: DriverPortalLocale }) {
  const api = useDriverPortalApi(props.filter);
  const [vehicle, setVehicle] = useState<DriverAssignedVehicle | null>(null);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.assigned_vehicle)) as DriverAssignedVehicle | null;
      if (payload && api.session && driverPortalTenantAllowed(api.session.tenant_id, payload.tenant_id)) {
        setVehicle(payload);
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  if (vehicle === null) {
    return (
      <section className="w-full" style={panelStyle}>
        <h2 style={titleStyle}>{driverPortalWidgetLabel("asset")}</h2>
      </section>
    );
  }

  return (
    <section className="w-full" style={panelStyle}>
      <h2 style={titleStyle}>{driverPortalWidgetLabel("asset")}</h2>
      <article style={cardStyle}>
        <p style={accentStyle}>
          {vehicle.unit_number} {vehicle.make} {vehicle.model} {vehicle.year}
        </p>
        <p style={mutedStyle}>asset {vehicle.asset_id}</p>
        <p style={mutedStyle}>
          miles {vehicle.mileage} hours {vehicle.hours}
        </p>
        <p style={accentStyle}>{vehicle.operational_status}</p>
        <p style={mutedStyle}>{vehicle.health_score}</p>
        {vehicle.operational_status === "Out of Service" && api.canMutate === true ? (
          <button
            type="button"
            style={buttonStyle}
            onClick={() => {
              void api.mutate(api.routes.alert_ack, { alert_id: "oos:" + vehicle.asset_id, asset_id: vehicle.asset_id });
            }}
          >
            {driverPortalLabel(props.locale, "acknowledge")}
          </button>
        ) : null}
      </article>
    </section>
  );
}
