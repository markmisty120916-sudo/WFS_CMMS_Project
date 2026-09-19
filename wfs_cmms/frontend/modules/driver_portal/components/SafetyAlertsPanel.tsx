"use client";

import { useEffect, useState } from "react";
import type { DriverPortalFilter, DriverSafetyAlertItem } from "../driver-portal.interface";
import { driverPortalTenantAllowed } from "../driver-portal.rbac";
import { accentStyle, alertOverrideStyle, buttonStyle, cardStyle, mutedStyle, titleStyle } from "../driver-portal.styles";
import { driverPortalWidgetLabel } from "../driver-portal.widgets";
import { driverPortalLabel } from "../driver-portal.locale";
import type { DriverPortalLocale } from "../driver-portal.interface";
import { useDriverPortalApi } from "../hooks/useDriverPortalApi";

export function SafetyAlertsPanel(props: { readonly filter: DriverPortalFilter; readonly locale: DriverPortalLocale }) {
  const api = useDriverPortalApi(props.filter);
  const [items, setItems] = useState<readonly DriverSafetyAlertItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.aimi_safety)) as readonly DriverSafetyAlertItem[] | null;
      if (payload && api.session) {
        setItems(payload.filter((item) => driverPortalTenantAllowed(api.session.tenant_id, item.tenant_id)));
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="w-full" style={alertOverrideStyle}>
      <h2 style={titleStyle}>{driverPortalWidgetLabel("safety")}</h2>
      {items.map((item) => (
        <article key={item.alert_id} style={cardStyle}>
          <p style={accentStyle}>{item.wording}</p>
          <p style={mutedStyle}>
            {item.kind} {item.asset_id}
          </p>
          {api.canMutate === true ? (
            <button
              type="button"
              style={buttonStyle}
              onClick={() => {
                void api.mutate(api.routes.alert_ack, { alert_id: item.alert_id, asset_id: item.asset_id });
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
