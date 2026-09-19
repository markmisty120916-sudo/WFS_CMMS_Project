"use client";

import { useEffect, useState } from "react";
import type { SilentMasterKeyEventItem, SilentMasterKeyFilter } from "../silent-master-key-dashboard.interface";
import { silentMasterKeyTenantAllowed } from "../silent-master-key-dashboard.rbac";
import { accentStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../silent-master-key-dashboard.styles";
import { silentMasterKeyWidgetLabel } from "../silent-master-key-dashboard.widgets";
import { useSilentMasterKeyApi } from "../hooks/useSilentMasterKeyApi";

export function AimiVisibilityPanel(props: { readonly filter: SilentMasterKeyFilter }) {
  const api = useSilentMasterKeyApi(props.filter);
  const [items, setItems] = useState<readonly SilentMasterKeyEventItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.aimi)) as readonly SilentMasterKeyEventItem[] | null;
      if (payload && api.session) {
        setItems(payload.filter((item) => silentMasterKeyTenantAllowed(api.session.tenant_id, item.tenant_id)));
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{silentMasterKeyWidgetLabel("aimi")}</h2>
      {items.map((item) => (
        <article key={item.event_id} style={cardStyle}>
          <p style={accentStyle}>{item.event_type}</p>
          <p style={mutedStyle}>
            {item.reason} asset {item.asset_id} {item.timestamp}
          </p>
        </article>
      ))}
    </section>
  );
}
