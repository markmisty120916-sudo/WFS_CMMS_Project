"use client";

import { useEffect, useState } from "react";
import type { SilentMasterKeyFilter, SilentMasterKeyWorkorderItem } from "../silent-master-key-dashboard.interface";
import { silentMasterKeyTenantAllowed } from "../silent-master-key-dashboard.rbac";
import { accentStyle, buttonStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../silent-master-key-dashboard.styles";
import { silentMasterKeyWidgetLabel } from "../silent-master-key-dashboard.widgets";
import { useSilentMasterKeyApi } from "../hooks/useSilentMasterKeyApi";
import { Input } from "./ui/controls";

export function SchedulingOverridePanel(props: { readonly filter: SilentMasterKeyFilter }) {
  const api = useSilentMasterKeyApi(props.filter);
  const [items, setItems] = useState<readonly SilentMasterKeyWorkorderItem[]>([]);
  const [scheduled_start, setStart] = useState("");
  const [scheduled_end, setEnd] = useState("");
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
      <h2 style={titleStyle}>{silentMasterKeyWidgetLabel("scheduling")}</h2>
      {items.map((item) => (
        <article key={item.workorder_id} style={cardStyle}>
          <p style={accentStyle}>{item.workorder_id}</p>
          <p style={mutedStyle}>
            {item.scheduled_start} {item.scheduled_end}
          </p>
          {api.canMutate === true ? (
            <div>
              <Input value={scheduled_start} onChange={(event) => setStart(event.target.value)} placeholder="scheduled_start" />
              <Input value={scheduled_end} onChange={(event) => setEnd(event.target.value)} placeholder="scheduled_end" />
              <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="reason" />
              <button
                type="button"
                style={buttonStyle}
                onClick={() => {
                  void api.mutate(api.routes.scheduling_override, {
                    workorder_id: item.workorder_id,
                    scheduled_start,
                    scheduled_end,
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
