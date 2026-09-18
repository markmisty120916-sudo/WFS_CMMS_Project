"use client";

import type { PartsManagerFilter } from "../parts-manager-dashboard.interface";
import { filterRowStyle } from "../parts-manager-dashboard.styles";
import { Input } from "./ui/controls";

export function PartsFilters(props: {
  readonly filter: PartsManagerFilter;
  readonly onChange: (next: PartsManagerFilter) => void;
}) {
  const set = (key: keyof PartsManagerFilter, value: string) => {
    props.onChange({ ...props.filter, [key]: value });
  };
  return (
    <div className="flex flex-wrap gap-2" style={filterRowStyle}>
      <Input value={props.filter.vendor} onChange={(event) => set("vendor", event.target.value)} placeholder="vendor" />
      <Input value={props.filter.part_category} onChange={(event) => set("part_category", event.target.value)} placeholder="part category" />
      <Input value={props.filter.stock_status} onChange={(event) => set("stock_status", event.target.value)} placeholder="stock status" />
      <Input value={props.filter.severity} onChange={(event) => set("severity", event.target.value)} placeholder="severity" />
    </div>
  );
}
