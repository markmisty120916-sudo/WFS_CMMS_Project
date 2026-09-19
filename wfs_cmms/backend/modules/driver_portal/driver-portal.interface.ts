export type DriverPortalFilter = {
  readonly asset: string;
};

export type DriverPortalWriteInput = {
  readonly asset_id: string;
  readonly description: string;
  readonly notes: string;
  readonly photo_url: string;
  readonly voice_note: string;
  readonly category: string;
  readonly workorder_id: string;
  readonly alert_id: string;
};

export type DriverAssignedVehicle = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly unit_number: string;
  readonly make: string;
  readonly model: string;
  readonly year: string;
  readonly mileage: string;
  readonly hours: string;
  readonly health_score: string;
  readonly operational_status: string;
};

export type DriverDefectItem = {
  readonly tenant_id: string;
  readonly defect_id: string;
  readonly asset_id: string;
  readonly category: string;
  readonly description: string;
  readonly status: string;
  readonly created_at: string;
};

export type DriverDvirItem = {
  readonly tenant_id: string;
  readonly dvir_id: string;
  readonly asset_id: string;
  readonly description: string;
  readonly status: string;
  readonly created_at: string;
};

export type DriverInspectionItem = {
  readonly tenant_id: string;
  readonly inspection_id: string;
  readonly asset_id: string;
  readonly type: string;
  readonly status: string;
  readonly created_at: string;
};

export type DriverPmItem = {
  readonly tenant_id: string;
  readonly pm_schedule_id: string;
  readonly asset_id: string;
  readonly pm_type: string;
  readonly pm_upcoming: string;
  readonly pm_overdue: string;
  readonly due_miles: string;
  readonly due_hours: string;
};

export type DriverComplianceItem = {
  readonly tenant_id: string;
  readonly record_id: string;
  readonly asset_id: string;
  readonly block: string;
  readonly inspection_failure: string;
  readonly regulatory_hold: string;
  readonly required_documentation: string;
  readonly status: string;
};

export type DriverTelematicsItem = {
  readonly tenant_id: string;
  readonly telematics_id: string;
  readonly asset_id: string;
  readonly wording: string;
  readonly level: string;
};

export type DriverWorkorderItem = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly status: string;
  readonly severity: string;
  readonly scheduled_window: string;
};

export type DriverSafetyAlertItem = {
  readonly tenant_id: string;
  readonly alert_id: string;
  readonly asset_id: string;
  readonly wording: string;
  readonly kind: string;
  readonly timestamp: string;
};

export type DriverPortalWriteResult = {
  readonly tenant_id: string;
  readonly entity_id: string;
  readonly event_type: string;
  readonly action_type: string;
};
