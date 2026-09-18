"use client";

import { useEffect, useState } from "react";
import type { PartsInventoryItem, PartsManagerFilter } from "../parts-manager-dashboard.interface";
import { canUsePartsManagerLimitedActions, partsManagerTenantAllowed } from "../parts-manager-dashboard.rbac";
import { buttonStyle, mutedStyle, panelStyle, titleStyle } from "../parts-manager-dashboard.styles";
import { partsManagerWidgetLabel } from "../parts-manager-dashboard.widgets";
import { usePartsManagerApi } from "../hooks/usePartsManagerApi";

export function PartQuickActions(props: { readonly filter: PartsManagerFilter }) {
  const api = usePartsManagerApi(props.filter);
  const [items, setItems] = useState<readonly PartsInventoryItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.inventory_overview)) as { items?: readonly PartsInventoryItem[]; tenant_id?: string } | null;
      if (payload && api.session && typeof payload.tenant_id === "string" && partsManagerTenantAllowed(api.session.tenant_id, payload.tenant_id)) {
        setItems(payload.items || []);
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  const actions = api.session !== null && canUsePartsManagerLimitedActions(api.session.role);

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{partsManagerWidgetLabel("quick_actions")}</h2>
      {items.map((item) => (
        <p key={item.part_id} style={mutedStyle}>
          {item.name}
          {actions === true ? (
            <>
              <a href={"/parts/" + item.part_id} style={buttonStyle}>
                open part
              </a>
              <a href={"/parts/vendors?vendor=" + encodeURIComponent(item.vendor_name)} style={buttonStyle}>
                open vendor
              </a>
              <a href={"/workorders?part_id=" + encodeURIComponent(item.part_id)} style={buttonStyle}>
                open workorders
              </a>
            </>
          ) : null}
        </p>
      ))}
    </section>
  );
}
