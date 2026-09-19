"use client";

import { useEffect, useState } from "react";
import type { DriverDefectItem, DriverDvirItem, DriverPortalFilter, DriverPortalLocale } from "../driver-portal.interface";
import { driverPortalLabel } from "../driver-portal.locale";
import { driverPortalTenantAllowed } from "../driver-portal.rbac";
import { accentStyle, buttonStyle, cardStyle, mutedStyle, panelStyle, titleStyle } from "../driver-portal.styles";
import { driverPortalWidgetLabel } from "../driver-portal.widgets";
import { useDriverPortalApi } from "../hooks/useDriverPortalApi";
import { Input, Select, TextArea } from "./ui/controls";

export function DefectReportingPanel(props: { readonly filter: DriverPortalFilter; readonly locale: DriverPortalLocale }) {
  const api = useDriverPortalApi(props.filter);
  const [defects, setDefects] = useState<readonly DriverDefectItem[]>([]);
  const [dvirs, setDvirs] = useState<readonly DriverDvirItem[]>([]);
  const [category, setCategory] = useState("mechanical");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [photo_url, setPhoto] = useState("");
  const [voice_note, setVoice] = useState("");

  useEffect(() => {
    void (async () => {
      const defectPayload = (await api.request(api.routes.defect)) as readonly DriverDefectItem[] | null;
      if (defectPayload && api.session) {
        setDefects(defectPayload.filter((item) => driverPortalTenantAllowed(api.session.tenant_id, item.tenant_id)));
      }
      const dvirPayload = (await api.request(api.routes.dvir)) as readonly DriverDvirItem[] | null;
      if (dvirPayload && api.session) {
        setDvirs(dvirPayload.filter((item) => driverPortalTenantAllowed(api.session.tenant_id, item.tenant_id)));
      }
    })();
  }, [api, props.filter]);

  if (api.allowed === false) {
    return null;
  }

  const asset_id = props.filter.asset;

  return (
    <section className="w-full" style={panelStyle}>
      <h2 style={titleStyle}>{driverPortalWidgetLabel("defect")}</h2>
      {api.canMutate === true ? (
        <div>
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="mechanical">mechanical</option>
            <option value="electrical">electrical</option>
            <option value="safety">safety</option>
            <option value="comfort">comfort</option>
            <option value="operational">operational</option>
            <option value="noise">noise</option>
            <option value="smell">smell</option>
            <option value="vibration">vibration</option>
            <option value="dashboard">dashboard</option>
          </Select>
          <TextArea
            placeholder={driverPortalLabel(props.locale, "description")}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <TextArea placeholder={driverPortalLabel(props.locale, "notes")} value={notes} onChange={(event) => setNotes(event.target.value)} />
          <Input placeholder={driverPortalLabel(props.locale, "photos")} value={photo_url} onChange={(event) => setPhoto(event.target.value)} />
          <Input placeholder={driverPortalLabel(props.locale, "voice")} value={voice_note} onChange={(event) => setVoice(event.target.value)} />
          <button
            type="button"
            style={buttonStyle}
            onClick={() => {
              void api.mutate(api.routes.defect, {
                asset_id,
                category,
                description,
                notes,
                photo_url,
                voice_note,
              });
            }}
          >
            {driverPortalLabel(props.locale, "submit")}
          </button>
          <button
            type="button"
            style={buttonStyle}
            onClick={() => {
              void api.mutate(api.routes.dvir, {
                asset_id,
                category: "operational",
                description,
                notes,
                photo_url,
                voice_note,
              });
            }}
          >
            DVIR {driverPortalLabel(props.locale, "submit")}
          </button>
        </div>
      ) : null}
      {defects.map((item) => (
        <article key={item.defect_id} style={cardStyle}>
          <p style={accentStyle}>{item.category}</p>
          <p style={mutedStyle}>
            {item.description} {item.status}
          </p>
        </article>
      ))}
      {dvirs.map((item) => (
        <article key={item.dvir_id} style={cardStyle}>
          <p style={accentStyle}>DVIR</p>
          <p style={mutedStyle}>
            {item.description} {item.status}
          </p>
        </article>
      ))}
    </section>
  );
}
