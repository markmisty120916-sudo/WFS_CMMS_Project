"use client";

import { useEffect, useState } from "react";
import type { PartsInventoryOverview, PartsManagerFilter } from "../parts-manager-dashboard.interface";
import { partsManagerTenantAllowed } from "../parts-manager-dashboard.rbac";
import { accentStyle, mutedStyle, panelStyle, titleStyle } from "../parts-manager-dashboard.styles";
import { partsManagerWidgetLabel } from "../parts-manager-dashboard.widgets";
import { usePartsManagerApi } from "../hooks/usePartsManagerApi";

export function InventoryOverview(props: { readonly filter: PartsManagerFilter }) {
  const api = usePartsManagerApi(props.filter);
  const [data, setData] = useState<PartsInventoryOverview | null>(null);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.inventory_overview)) as PartsInventoryOverview | null;
      if (payload && api.session && partsManagerTenantAllowed(api.session.tenant_id, payload.tenant_id)) {
        setData(payload);
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{partsManagerWidgetLabel("inventory")}</h2>
      <p style={accentStyle}>parts {data ? data.part_count : "0"}</p>
      <p style={mutedStyle}>
        critical {data ? data.critical_count : "0"} reorder {data ? data.reorder_count : "0"}
      </p>
      {(data ? data.items : []).map((item) => (
        <p key={item.part_id} style={mutedStyle}>
          {item.name} qty {item.quantity} {item.stock_status} reorder {item.reorder_point}
        </p>
      ))}
    </section>
  );
}
