"use client";

import type { ComplianceDashboardFilter } from "../compliance-dashboard.interface";
import { filterRowStyle } from "../compliance-dashboard.styles";
import { Input } from "./ui/controls";

export function ComplianceFilters(props: {
  readonly filter: ComplianceDashboardFilter;
  readonly onChange: (next: ComplianceDashboardFilter) => void;
}) {
  const set = (key: keyof ComplianceDashboardFilter, value: string) => {
    props.onChange({ ...props.filter, [key]: value });
  };
  return (
    <div className="flex flex-wrap gap-2" style={filterRowStyle}>
      <Input value={props.filter.asset} onChange={(event) => set("asset", event.target.value)} placeholder="asset" />
      <Input value={props.filter.inspection_type} onChange={(event) => set("inspection_type", event.target.value)} placeholder="inspection type" />
      <Input value={props.filter.severity} onChange={(event) => set("severity", event.target.value)} placeholder="severity" />
      <Input value={props.filter.driver} onChange={(event) => set("driver", event.target.value)} placeholder="driver" />
      <Input value={props.filter.technician} onChange={(event) => set("technician", event.target.value)} placeholder="technician" />
      <Input value={props.filter.compliance_category} onChange={(event) => set("compliance_category", event.target.value)} placeholder="compliance category" />
    </div>
  );
}
