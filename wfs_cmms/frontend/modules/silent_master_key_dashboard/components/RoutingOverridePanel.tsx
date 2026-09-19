"use client";

import { useEffect, useState } from "react";
import type { SilentMasterKeyFilter, SilentMasterKeyWorkorderItem } from "../silent-master-key-dashboard.interface";
import { silentMasterKeyTenantAllowed } from "../silent-master-key-dashboard.rbac";
import { accentStyle, buttonStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../silent-master-key-dashboard.styles";
import { silentMasterKeyWidgetLabel } from "../silent-master-key-dashboard.widgets";
import { useSilentMasterKeyApi } from "../hooks/useSilentMasterKeyApi";
import { Input } from "./ui/controls";

export function RoutingOverridePanel(props: { readonly filter: SilentMasterKeyFilter }) {
  const api = useSilentMasterKeyApi(props.filter);
  const [items, setItems] = useState<readonly SilentMasterKeyWorkorderItem[]>([]);
  const [technician_id, setTechnician] = useState("");
  const [bay_id, setBay] = useState("");
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
      <h2 style={titleStyle}>{silentMasterKeyWidgetLabel("routing")}</h2>
      {items.map((item) => (
        <article key={item.workorder_id} style={cardStyle}>
          <p style={accentStyle}>{item.workorder_id}</p>
          <p style={mutedStyle}>
            tech {item.routing_tech_id} bay {item.routing_bay_id}
          </p>
          {api.canMutate === true ? (
            <div>
              <Input value={technician_id} onChange={(event) => setTechnician(event.target.value)} placeholder="technician_id" />
              <Input value={bay_id} onChange={(event) => setBay(event.target.value)} placeholder="bay_id" />
              <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="reason" />
              <button
                type="button"
                style={buttonStyle}
                onClick={() => {
                  void api.mutate(api.routes.routing_override, {
                    workorder_id: item.workorder_id,
                    technician_id,
                    bay_id,
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
