"use client";

import { useEffect, useState } from "react";
import type { DriverComplianceItem, DriverInspectionItem, DriverPortalFilter, DriverPortalLocale } from "../driver-portal.interface";
import { driverPortalLabel } from "../driver-portal.locale";
import { driverPortalTenantAllowed } from "../driver-portal.rbac";
import { accentStyle, buttonStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../driver-portal.styles";
import { driverPortalWidgetLabel } from "../driver-portal.widgets";
import { useDriverPortalApi } from "../hooks/useDriverPortalApi";

export function ComplianceStatusPanel(props: { readonly filter: DriverPortalFilter; readonly locale: DriverPortalLocale }) {
  const api = useDriverPortalApi(props.filter);
  const [items, setItems] = useState<readonly DriverComplianceItem[]>([]);
  const [inspections, setInspections] = useState<readonly DriverInspectionItem[]>([]);

  useEffect(() => {
    void (async () => {
      const payload = (await api.request(api.routes.compliance)) as readonly DriverComplianceItem[] | null;
      if (payload && api.session) {
        setItems(payload.filter((item) => driverPortalTenantAllowed(api.session.tenant_id, item.tenant_id)));
      }
      const inspectionPayload = (await api.request(api.routes.inspections)) as readonly DriverInspectionItem[] | null;
      if (inspectionPayload && api.session) {
        setInspections(inspectionPayload.filter((item) => driverPortalTenantAllowed(api.session.tenant_id, item.tenant_id)));
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section className="w-full" style={panelStyle}>
      <h2 style={titleStyle}>{driverPortalWidgetLabel("compliance")}</h2>
      {items.map((item) => (
        <article key={item.record_id} style={cardStyle}>
          <p style={accentStyle}>block {item.block}</p>
          <p style={mutedStyle}>
            inspection failure {item.inspection_failure} hold {item.regulatory_hold}
          </p>
          <p style={mutedStyle}>{item.required_documentation}</p>
          {api.canMutate === true ? (
            <button
              type="button"
              style={buttonStyle}
              onClick={() => {
                void api.mutate(api.routes.alert_ack, { alert_id: "compliance:" + item.record_id, asset_id: item.asset_id });
              }}
            >
              {driverPortalLabel(props.locale, "acknowledge")}
            </button>
          ) : null}
        </article>
      ))}
      {inspections.map((item) => (
        <article key={item.inspection_id} style={cardStyle}>
          <p style={accentStyle}>{item.type}</p>
          <p style={mutedStyle}>{item.status}</p>
        </article>
      ))}
    </section>
  );
}
