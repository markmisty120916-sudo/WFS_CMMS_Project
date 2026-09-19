"use client";

import { useEffect, useState } from "react";
import type { DriverPmItem, DriverPortalFilter, DriverPortalLocale } from "../driver-portal.interface";
import { driverPortalLabel } from "../driver-portal.locale";
import { driverPortalTenantAllowed } from "../driver-portal.rbac";
import { accentStyle, buttonStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../driver-portal.styles";
import { driverPortalWidgetLabel } from "../driver-portal.widgets";
import { useDriverPortalApi } from "../hooks/useDriverPortalApi";

export function PmStatusPanel(props: { readonly filter: DriverPortalFilter; readonly locale: DriverPortalLocale }) {
  const api = useDriverPortalApi(props.filter);
  const [items, setItems] = useState<readonly DriverPmItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.pm)) as readonly DriverPmItem[] | null;
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
      <h2 style={titleStyle}>{driverPortalWidgetLabel("pm")}</h2>
      {items.map((item) => (
        <article key={item.pm_schedule_id} style={cardStyle}>
          <p style={accentStyle}>{item.pm_type}</p>
          <p style={mutedStyle}>
            upcoming {item.pm_upcoming} overdue {item.pm_overdue}
          </p>
          <p style={mutedStyle}>
            due miles {item.due_miles} due hours {item.due_hours}
          </p>
          {api.canMutate === true ? (
            <button
              type="button"
              style={buttonStyle}
              onClick={() => {
                void api.mutate(api.routes.alert_ack, { alert_id: "pm:" + item.pm_schedule_id, asset_id: item.asset_id });
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
