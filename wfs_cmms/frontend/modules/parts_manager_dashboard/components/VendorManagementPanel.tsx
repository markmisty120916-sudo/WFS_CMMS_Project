"use client";

import { useEffect, useState } from "react";
import type { PartsManagerFilter, PartsVendorItem } from "../parts-manager-dashboard.interface";
import { partsManagerTenantAllowed } from "../parts-manager-dashboard.rbac";
import { accentStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../parts-manager-dashboard.styles";
import { partsManagerWidgetLabel } from "../parts-manager-dashboard.widgets";
import { usePartsManagerApi } from "../hooks/usePartsManagerApi";

export function VendorManagementPanel(props: { readonly filter: PartsManagerFilter }) {
  const api = usePartsManagerApi(props.filter);
  const [items, setItems] = useState<readonly PartsVendorItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.vendors)) as readonly PartsVendorItem[] | null;
      if (payload && api.session) {
        const next: PartsVendorItem[] = [];
        let index = 0;
        while (index < payload.length) {
          if (partsManagerTenantAllowed(api.session.tenant_id, payload[index].tenant_id)) {
            next.push(payload[index]);
          }
          index = index + 1;
        }
        setItems(next);
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{partsManagerWidgetLabel("vendors")}</h2>
      {items.map((item) => (
        <article key={item.vendor_name + item.location} style={cardStyle}>
          <p style={accentStyle}>{item.vendor_name}</p>
          <p style={mutedStyle}>
            {item.location} lead {item.lead_time} preferred {item.preferred}
          </p>
        </article>
      ))}
    </section>
  );
}
