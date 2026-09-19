"use client";

import { useEffect, useState } from "react";
import type { SilentMasterKeyDashboardItem, SilentMasterKeyFilter } from "../silent-master-key-dashboard.interface";
import { silentMasterKeyTenantAllowed } from "../silent-master-key-dashboard.rbac";
import { accentStyle, cardStyle, linkStyle, mutedStyle, panelStyle, titleStyle } from "../silent-master-key-dashboard.styles";
import { silentMasterKeyWidgetLabel } from "../silent-master-key-dashboard.widgets";
import { useSilentMasterKeyApi } from "../hooks/useSilentMasterKeyApi";

export function DashboardSwitchingPanel(props: { readonly filter: SilentMasterKeyFilter }) {
  const api = useSilentMasterKeyApi(props.filter);
  const [items, setItems] = useState<readonly SilentMasterKeyDashboardItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.dashboards)) as readonly SilentMasterKeyDashboardItem[] | null;
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
      <h2 style={titleStyle}>{silentMasterKeyWidgetLabel("switch")}</h2>
      {items.map((item) => (
        <article key={item.path} style={cardStyle}>
          <p style={accentStyle}>{item.dashboard}</p>
          <a href={item.path} style={linkStyle}>
            {item.path}
          </a>
          <p style={mutedStyle}>{item.tenant_id}</p>
        </article>
      ))}
    </section>
  );
}
