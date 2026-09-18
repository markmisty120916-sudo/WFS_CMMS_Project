"use client";

import type { FleetManagerFilter } from "../fleet-manager-dashboard.interface";
import { filterRowStyle } from "../fleet-manager-dashboard.styles";
import { Input } from "./ui/controls";

export function FleetFilters(props: {
  readonly filter: FleetManagerFilter;
  readonly onChange: (next: FleetManagerFilter) => void;
}) {
  const set = (key: keyof FleetManagerFilter, value: string) => {
    props.onChange({ ...props.filter, [key]: value });
  };
  return (
    <div className="flex flex-wrap gap-2" style={filterRowStyle}>
      <Input value={props.filter.severity} onChange={(event) => set("severity", event.target.value)} placeholder="severity" />
      <Input value={props.filter.asset_group} onChange={(event) => set("asset_group", event.target.value)} placeholder="asset group" />
      <Input value={props.filter.technician} onChange={(event) => set("technician", event.target.value)} placeholder="technician" />
      <Input value={props.filter.pm_status} onChange={(event) => set("pm_status", event.target.value)} placeholder="pm status" />
      <Input value={props.filter.vendor} onChange={(event) => set("vendor", event.target.value)} placeholder="vendor" />
    </div>
  );
}
