export type FleetManagerFilter = {
  readonly severity: string;
  readonly asset_group: string;
  readonly technician: string;
  readonly pm_status: string;
  readonly vendor: string;
};

export type FleetHealthItem = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly unit_number: string;
  readonly status: string;
  readonly health_score: string;
  readonly predictive_score: string;
  readonly severity: string;
  readonly asset_group: string;
  readonly vendor_id: string;
  readonly last_update: string;
};

export type FleetHealthOverview = {
  readonly tenant_id: string;
  readonly asset_count: string;
  readonly s1: string;
  readonly s2: string;
  readonly s3: string;
  readonly s4: string;
  readonly s5: string;
  readonly items: readonly FleetHealthItem[];
};

export type FleetBreakdownItem = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly unit_number: string;
  readonly severity: string;
  readonly status: string;
  readonly routing_tech_id: string;
  readonly description: string;
};

export type FleetPmStatusItem = {
  readonly tenant_id: string;
  readonly pm_schedule_id: string;
  readonly asset_id: string;
  readonly pm_template_id: string;
  readonly status: string;
  readonly asset_group: string;
  readonly due_miles: string;
  readonly due_hours: string;
};

export type FleetInventoryImpactItem = {
  readonly tenant_id: string;
  readonly part_id: string;
  readonly name: string;
  readonly quantity: string;
  readonly location: string;
  readonly vendor_id: string;
  readonly impact: string;
  readonly workorder_id: string;
};

export type FleetTechnicianWorkloadItem = {
  readonly tenant_id: string;
  readonly technician_id: string;
  readonly assigned_count: string;
  readonly s1_count: string;
  readonly waiting_parts_count: string;
};

export type FleetFindVehiclePoint = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly unit_number: string;
  readonly telematics_id: string;
  readonly fault_code: string;
  readonly severity: string;
  readonly source: string;
  readonly timestamp: string;
};

export type FleetFindVehicleResult = {
  readonly tenant_id: string;
  readonly label: string;
  readonly points: readonly FleetFindVehiclePoint[];
};

export type FleetAimiInsightItem = {
  readonly tenant_id: string;
  readonly event_id: string;
  readonly event_type: string;
  readonly asset_id: string;
  readonly workorder_id: string;
  readonly reason: string;
  readonly timestamp: string;
};

export type FleetAssetQuickAction = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly unit_number: string;
  readonly workorder_id: string;
  readonly pm_schedule_id: string;
};
