"use client";

import { useEffect, useState } from "react";
import type { DriverPortalFilter, DriverPortalLocale, DriverTelematicsItem } from "../driver-portal.interface";
import { driverPortalLabel } from "../driver-portal.locale";
import { driverPortalTenantAllowed } from "../driver-portal.rbac";
import { accentStyle, buttonStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../driver-portal.styles";
import { driverPortalWidgetLabel } from "../driver-portal.widgets";
import { useDriverPortalApi } from "../hooks/useDriverPortalApi";

export function TelematicsFaultSummary(props: { readonly filter: DriverPortalFilter; readonly locale: DriverPortalLocale }) {
  const api = useDriverPortalApi(props.filter);
  const [items, setItems] = useState<readonly DriverTelematicsItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.telematics)) as readonly DriverTelematicsItem[] | null;
      if (payload && api.session) {
        setItems(payload.filter((item) => driverPortalTenantAllowed(api.session.tenant_id, item.tenant_id)));
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="w-full" style={panelStyle}>
      <h2 style={titleStyle}>{driverPortalWidgetLabel("telematics")}</h2>
      {items.map((item) => (
        <article key={item.telematics_id} style={cardStyle}>
          <p style={accentStyle}>{item.level}</p>
          <p style={mutedStyle}>{item.wording}</p>
          {api.canMutate === true ? (
            <button
              type="button"
              style={buttonStyle}
              onClick={() => {
                void api.mutate(api.routes.alert_ack, { alert_id: "telematics:" + item.telematics_id, asset_id: item.asset_id });
              }}
            >
              {driverPortalLabel(props.locale, "acknowledge")}
            </button>
          ) : null}
        </article>
      ))}
    </section>
  );
}
