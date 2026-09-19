"use client";

import type { DriverPortalLocale } from "../driver-portal.interface";
import { inputStyle } from "../driver-portal.styles";

export function MultilingualToggle(props: {
  readonly locale: DriverPortalLocale;
  readonly onChange: (locale: DriverPortalLocale) => void;
}) {
  return (
    <select
      value={props.locale}
      onChange={(event) => props.onChange(event.target.value as DriverPortalLocale)}
      className="rounded-md border px-3 py-2"
      style={inputStyle}
    >
      <option value="en">English</option>
      <option value="es">Spanish</option>
      <option value="fr">French</option>
      <option value="de">German</option>
      <option value="pt">Portuguese</option>
      <option value="zh">Mandarin</option>
      <option value="ar">Arabic</option>
    </select>
  );
}
