"use client";

import { useEffect, useState } from "react";
import type { SilentMasterKeyFilter, SilentMasterKeyWorkorderItem } from "../silent-master-key-dashboard.interface";
import { silentMasterKeyTenantAllowed } from "../silent-master-key-dashboard.rbac";
import { accentStyle, buttonStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../silent-master-key-dashboard.styles";
import { silentMasterKeyWidgetLabel } from "../silent-master-key-dashboard.widgets";
import { useSilentMasterKeyApi } from "../hooks/useSilentMasterKeyApi";
import { Input } from "./ui/controls";

export function SeverityOverridePanel(props: { readonly filter: SilentMasterKeyFilter }) {
  const api = useSilentMasterKeyApi(props.filter);
  const [items, setItems] = useState<readonly SilentMasterKeyWorkorderItem[]>([]);
  const [severity, setSeverity] = useState("S1");
  const [reason, setReason] = useState("");

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.workorders)) as readonly SilentMasterKeyWorkorderItem[] | null;
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
      <h2 style={titleStyle}>{silentMasterKeyWidgetLabel("severity")}</h2>
      {items.map((item) => (
        <article key={item.workorder_id} style={cardStyle}>
          <p style={accentStyle}>{item.workorder_id}</p>
          <p style={mutedStyle}>
            {item.severity} asset {item.asset_id}
          </p>
          {api.canMutate === true ? (
            <div>
              <Input value={severity} onChange={(event) => setSeverity(event.target.value)} placeholder="severity" />
              <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="reason" />
              <button
                type="button"
                style={buttonStyle}
                onClick={() => {
                  void api.mutate(api.routes.severity_override, {
                    workorder_id: item.workorder_id,
                    asset_id: item.asset_id,
                    severity,
                    reason,
                  });
                }}
              >
                override
              </button>
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}
