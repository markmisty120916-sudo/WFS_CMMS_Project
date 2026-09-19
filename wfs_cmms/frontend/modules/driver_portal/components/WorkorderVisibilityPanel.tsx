"use client";

import { useEffect, useState } from "react";
import type { DriverPortalFilter, DriverPortalLocale, DriverWorkorderItem } from "../driver-portal.interface";
import { driverPortalLabel } from "../driver-portal.locale";
import { driverPortalTenantAllowed } from "../driver-portal.rbac";
import { accentStyle, buttonStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../driver-portal.styles";
import { driverPortalWidgetLabel } from "../driver-portal.widgets";
import { useDriverPortalApi } from "../hooks/useDriverPortalApi";
import { Input, TextArea } from "./ui/controls";

export function WorkorderVisibilityPanel(props: { readonly filter: DriverPortalFilter; readonly locale: DriverPortalLocale }) {
  const api = useDriverPortalApi(props.filter);
  const [items, setItems] = useState<readonly DriverWorkorderItem[]>([]);
  const [notes, setNotes] = useState("");
  const [photo_url, setPhoto] = useState("");

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.workorders)) as readonly DriverWorkorderItem[] | null;
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
      <h2 style={titleStyle}>{driverPortalWidgetLabel("workorders")}</h2>
      {items.map((item) => (
        <article key={item.workorder_id} style={cardStyle}>
          <p style={accentStyle}>{item.status}</p>
          <p style={mutedStyle}>{item.severity}</p>
          <p style={mutedStyle}>{item.scheduled_window}</p>
          {api.canMutate === true ? (
            <div>
              <TextArea placeholder={driverPortalLabel(props.locale, "notes")} value={notes} onChange={(event) => setNotes(event.target.value)} />
              <Input placeholder={driverPortalLabel(props.locale, "photos")} value={photo_url} onChange={(event) => setPhoto(event.target.value)} />
              <button
                type="button"
                style={buttonStyle}
                onClick={() => {
                  void api.mutate(api.routes.note, { workorder_id: item.workorder_id, notes });
                }}
              >
                {driverPortalLabel(props.locale, "notes")}
              </button>
              <button
                type="button"
                style={buttonStyle}
                onClick={() => {
                  void api.mutate(api.routes.photo, { workorder_id: item.workorder_id, photo_url });
                }}
              >
                {driverPortalLabel(props.locale, "photos")}
              </button>
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}
