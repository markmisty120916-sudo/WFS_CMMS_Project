import type { DtoRole } from "../../../../src/core/dto/base.dto";
import { formatPmInterval, severityColor } from "../global-dashboard-integration-rules";
import type {
  ConfigurationPackEffect,
  GlobalDashboardIntegrationFilter,
  ImportHistoryReference,
  IntegrationAimiItem,
  IntegrationAssetItem,
  IntegrationComplianceItem,
  IntegrationDefectItem,
  IntegrationDvirItem,
  IntegrationFindVehiclePoint,
  IntegrationInventoryItem,
  IntegrationPmItem,
  IntegrationTelematicsResult,
  IntegrationVendorItem,
  IntegrationWorkorderItem,
} from "../global-dashboard-integration.interface";
import { asField, payloadRecord } from "../global-dashboard-integration.repository";
import { FIND_VEHICLE_LABEL, telematicsChannel } from "../adapters/telematics.adapter";
import { GLOBAL_DASHBOARD_INTEGRATION_AIMI_TYPES } from "../global-dashboard-integration-events";

function tenantAllowed(bypass: boolean, request_tenant_id: string, record_tenant_id: string): boolean {
  if (bypass === true) {
    return true;
  }
  if (record_tenant_id === request_tenant_id) {
    return true;
  }
  return false;
}

function matchesFilter(value: string, filter_value: string): boolean {
  if (filter_value === "") {
    return true;
  }
  if (value === filter_value) {
    return true;
  }
  return false;
}

export function buildPackEffects(
  request_tenant_id: string,
  bypass: boolean,
  packs: readonly Readonly<Record<string, unknown>>[],
): readonly ConfigurationPackEffect[] {
  const items: ConfigurationPackEffect[] = [];
  let index = 0;
  while (index < packs.length) {
    const row = packs[index];
    const tenant_id = asField(row, "tenant_id");
    if (tenantAllowed(bypass, request_tenant_id, tenant_id) === true) {
      const interval_miles = asField(row, "interval_miles");
      const interval_hours = asField(row, "interval_hours");
      const severity_default = asField(row, "severity_default");
      items.push(
        Object.freeze({
          tenant_id,
          pack_id: asField(row, "pack_id"),
          name: asField(row, "name"),
          pm_template_name: asField(row, "pm_template_name"),
          interval_miles,
          interval_hours,
          pm_interval: formatPmInterval(interval_miles, interval_hours),
          severity_default,
          severity_color: severityColor(severity_default),
          workorder_source: asField(row, "workorder_source"),
          telematics_fault_code: asField(row, "telematics_fault_code"),
          telematics_severity: asField(row, "telematics_severity"),
        }),
      );
    }
    index = index + 1;
  }
  return items;
}

export function buildImportHistory(
  request_tenant_id: string,
  bypass: boolean,
  rows: readonly Readonly<Record<string, unknown>>[],
  data_type: string,
): readonly ImportHistoryReference[] {
  const items: ImportHistoryReference[] = [];
  let index = 0;
  while (index < rows.length) {
    const row = rows[index];
    const tenant_id = asField(row, "tenant_id");
    const type = asField(row, "data_type");
    if (tenantAllowed(bypass, request_tenant_id, tenant_id) === true && (data_type === "" || type === data_type)) {
      items.push(
        Object.freeze({
          tenant_id,
          import_id: asField(row, "import_id"),
          data_type: type,
          file_format: asField(row, "file_format"),
          status: asField(row, "status"),
          created_by: asField(row, "created_by"),
          created_at: asField(row, "created_at"),
        }),
      );
    }
    index = index + 1;
  }
  return items;
}

function packEffectsForTenant(effects: readonly ConfigurationPackEffect[], tenant_id: string): readonly ConfigurationPackEffect[] {
  const matched: ConfigurationPackEffect[] = [];
  let index = 0;
  while (index < effects.length) {
    if (effects[index].tenant_id === tenant_id) {
      matched.push(effects[index]);
    }
    index = index + 1;
  }
  return matched;
}

function importsForTenant(rows: readonly ImportHistoryReference[], tenant_id: string): readonly ImportHistoryReference[] {
  const matched: ImportHistoryReference[] = [];
  let index = 0;
  while (index < rows.length) {
    if (rows[index].tenant_id === tenant_id) {
      matched.push(rows[index]);
    }
    index = index + 1;
  }
  return matched;
}

function healthForAsset(
  health: readonly Readonly<Record<string, unknown>>[],
  tenant_id: string,
  asset_id: string,
): { health_score: string; predictive_score: string } {
  let index = 0;
  while (index < health.length) {
    const row = health[index];
    if (asField(row, "tenant_id") === tenant_id && asField(row, "asset_id") === asset_id) {
      return {
        health_score: asField(row, "health_score"),
        predictive_score: asField(row, "predictive_score"),
      };
    }
    index = index + 1;
  }
  return { health_score: "", predictive_score: "" };
}

export function buildAssets(
  request_tenant_id: string,
  bypass: boolean,
  assets: readonly Readonly<Record<string, unknown>>[],
  health: readonly Readonly<Record<string, unknown>>[],
  packs: readonly ConfigurationPackEffect[],
  imports: readonly ImportHistoryReference[],
  filter: GlobalDashboardIntegrationFilter,
): readonly IntegrationAssetItem[] {
  const items: IntegrationAssetItem[] = [];
  let index = 0;
  while (index < assets.length) {
    const row = assets[index];
    const tenant_id = asField(row, "tenant_id");
    const asset_id = asField(row, "asset_id");
    const status = asField(row, "status");
    if (
      tenantAllowed(bypass, request_tenant_id, tenant_id) === true &&
      matchesFilter(asset_id, filter.asset_id) === true &&
      matchesFilter(status, filter.status) === true
    ) {
      const scores = healthForAsset(health, tenant_id, asset_id);
      items.push(
        Object.freeze({
          tenant_id,
          asset_id,
          vin: asField(row, "vin"),
          unit_number: asField(row, "unit_number"),
          make: asField(row, "make"),
          model: asField(row, "model"),
          year: asField(row, "year"),
          mileage: asField(row, "mileage"),
          hours: asField(row, "hours"),
          status,
          asset_state: status,
          health_score: scores.health_score,
          predictive_score: scores.predictive_score,
          pack_effects: packEffectsForTenant(packs, tenant_id),
          import_history: importsForTenant(imports, tenant_id),
        }),
      );
    }
    index = index + 1;
  }
  return items;
}

export function buildWorkorders(
  request_tenant_id: string,
  bypass: boolean,
  role: DtoRole,
  user_id: string,
  workorders: readonly Readonly<Record<string, unknown>>[],
  packs: readonly ConfigurationPackEffect[],
  filter: GlobalDashboardIntegrationFilter,
): readonly IntegrationWorkorderItem[] {
  const items: IntegrationWorkorderItem[] = [];
  let index = 0;
  while (index < workorders.length) {
    const row = workorders[index];
    const tenant_id = asField(row, "tenant_id");
    const asset_id = asField(row, "asset_id");
    const workorder_id = asField(row, "workorder_id");
    const severity = asField(row, "severity");
    const status = asField(row, "status");
    const routing_tech_id = asField(row, "routing_tech_id");
    let include = tenantAllowed(bypass, request_tenant_id, tenant_id);
    if (include === true && matchesFilter(asset_id, filter.asset_id) === false) {
      include = false;
    }
    if (include === true && matchesFilter(workorder_id, filter.workorder_id) === false) {
      include = false;
    }
    if (include === true && matchesFilter(severity, filter.severity) === false) {
      include = false;
    }
    if (include === true && matchesFilter(status, filter.status) === false) {
      include = false;
    }
    if (include === true && role === "TECHNICIAN" && routing_tech_id !== user_id) {
      include = false;
    }
    if (include === true && role === "DRIVER" && status === "closed") {
      include = false;
    }
    if (include === true) {
      const tenantPacks = packEffectsForTenant(packs, tenant_id);
      let source = asField(row, "source");
      if (source === "" && tenantPacks.length > 0) {
        source = tenantPacks[0].workorder_source;
      }
      items.push(
        Object.freeze({
          tenant_id,
          workorder_id,
          asset_id,
          source,
          description: asField(row, "description"),
          severity,
          severity_color: severityColor(severity),
          routing_tech_id,
          routing_bay_id: asField(row, "routing_bay_id"),
          scheduled_start: asField(row, "scheduled_start"),
          scheduled_end: asField(row, "scheduled_end"),
          status,
          workorder_state: status,
          created_by: asField(row, "created_by"),
        }),
      );
    }
    index = index + 1;
  }
  return items;
}

export function buildPm(
  request_tenant_id: string,
  bypass: boolean,
  schedules: readonly Readonly<Record<string, unknown>>[],
  templates: readonly Readonly<Record<string, unknown>>[],
  packs: readonly ConfigurationPackEffect[],
  filter: GlobalDashboardIntegrationFilter,
): readonly IntegrationPmItem[] {
  const items: IntegrationPmItem[] = [];
  let index = 0;
  while (index < schedules.length) {
    const row = schedules[index];
    const tenant_id = asField(row, "tenant_id");
    const asset_id = asField(row, "asset_id");
    const status = asField(row, "status");
    const pm_template_id = asField(row, "pm_template_id");
    if (
      tenantAllowed(bypass, request_tenant_id, tenant_id) === true &&
      matchesFilter(asset_id, filter.asset_id) === true &&
      matchesFilter(status, filter.status) === true
    ) {
      let template_name = "";
      let interval_miles = "";
      let interval_hours = "";
      let templateIndex = 0;
      while (templateIndex < templates.length) {
        const template = templates[templateIndex];
        if (asField(template, "pm_template_id") === pm_template_id && asField(template, "tenant_id") === tenant_id) {
          template_name = asField(template, "name");
          interval_miles = asField(template, "interval_miles");
          interval_hours = asField(template, "interval_hours");
        }
        templateIndex = templateIndex + 1;
      }
      const tenantPacks = packEffectsForTenant(packs, tenant_id);
      if (tenantPacks.length > 0) {
        if (interval_miles === "") {
          interval_miles = tenantPacks[0].interval_miles;
        }
        if (interval_hours === "") {
          interval_hours = tenantPacks[0].interval_hours;
        }
        if (template_name === "") {
          template_name = tenantPacks[0].pm_template_name;
        }
      }
      items.push(
        Object.freeze({
          tenant_id,
          pm_schedule_id: asField(row, "pm_schedule_id"),
          asset_id,
          pm_template_id,
          template_name,
          due_miles: asField(row, "due_miles"),
          due_hours: asField(row, "due_hours"),
          interval_miles,
          interval_hours,
          pm_interval: formatPmInterval(interval_miles, interval_hours),
          status,
        }),
      );
    }
    index = index + 1;
  }
  return items;
}

export function buildInventory(
  request_tenant_id: string,
  bypass: boolean,
  parts: readonly Readonly<Record<string, unknown>>[],
  usage: readonly Readonly<Record<string, unknown>>[],
  models: readonly Readonly<Record<string, unknown>>[],
  filter: GlobalDashboardIntegrationFilter,
): readonly IntegrationInventoryItem[] {
  const items: IntegrationInventoryItem[] = [];
  let index = 0;
  while (index < parts.length) {
    const row = parts[index];
    const tenant_id = asField(row, "tenant_id");
    const part_id = asField(row, "part_id");
    if (tenantAllowed(bypass, request_tenant_id, tenant_id) === true) {
      let used = 0;
      let usageIndex = 0;
      while (usageIndex < usage.length) {
        const usageRow = usage[usageIndex];
        if (asField(usageRow, "tenant_id") === tenant_id && asField(usageRow, "part_id") === part_id) {
          const quantity = Number(asField(usageRow, "quantity"));
          if (Number.isFinite(quantity) === true) {
            used = used + quantity;
          }
        }
        usageIndex = usageIndex + 1;
      }
      let predictive_usage = String(used);
      let modelIndex = 0;
      while (modelIndex < models.length) {
        const model = models[modelIndex];
        if (asField(model, "tenant_id") === tenant_id && matchesFilter(asField(model, "asset_id"), filter.asset_id) === true) {
          predictive_usage = asField(model, "predictive_score");
        }
        modelIndex = modelIndex + 1;
      }
      items.push(
        Object.freeze({
          tenant_id,
          part_id,
          name: asField(row, "name"),
          description: asField(row, "description"),
          quantity: asField(row, "quantity"),
          location: asField(row, "location"),
          predictive_usage,
        }),
      );
    }
    index = index + 1;
  }
  return items;
}

export function buildCompliance(
  request_tenant_id: string,
  bypass: boolean,
  inspections: readonly Readonly<Record<string, unknown>>[],
  filter: GlobalDashboardIntegrationFilter,
): readonly IntegrationComplianceItem[] {
  const items: IntegrationComplianceItem[] = [];
  let index = 0;
  while (index < inspections.length) {
    const row = inspections[index];
    const tenant_id = asField(row, "tenant_id");
    const asset_id = asField(row, "asset_id");
    const status = asField(row, "status");
    if (
      tenantAllowed(bypass, request_tenant_id, tenant_id) === true &&
      matchesFilter(asset_id, filter.asset_id) === true &&
      matchesFilter(status, filter.status) === true
    ) {
      items.push(
        Object.freeze({
          tenant_id,
          inspection_id: asField(row, "inspection_id"),
          asset_id,
          type: asField(row, "type"),
          status,
        }),
      );
    }
    index = index + 1;
  }
  return items;
}

export function buildDvir(
  request_tenant_id: string,
  bypass: boolean,
  violations: readonly Readonly<Record<string, unknown>>[],
  filter: GlobalDashboardIntegrationFilter,
): readonly IntegrationDvirItem[] {
  const items: IntegrationDvirItem[] = [];
  let index = 0;
  while (index < violations.length) {
    const row = violations[index];
    const tenant_id = asField(row, "tenant_id");
    const asset_id = asField(row, "asset_id");
    const severity = asField(row, "severity");
    if (
      tenantAllowed(bypass, request_tenant_id, tenant_id) === true &&
      matchesFilter(asset_id, filter.asset_id) === true &&
      matchesFilter(severity, filter.severity) === true
    ) {
      items.push(
        Object.freeze({
          tenant_id,
          violation_id: asField(row, "violation_id"),
          asset_id,
          description: asField(row, "description"),
          severity,
          severity_color: severityColor(severity),
          status: asField(row, "status"),
          created_at: asField(row, "created_at"),
        }),
      );
    }
    index = index + 1;
  }
  return items;
}

export function buildDefects(
  request_tenant_id: string,
  bypass: boolean,
  violations: readonly Readonly<Record<string, unknown>>[],
  filter: GlobalDashboardIntegrationFilter,
): readonly IntegrationDefectItem[] {
  const items: IntegrationDefectItem[] = [];
  let index = 0;
  while (index < violations.length) {
    const row = violations[index];
    const tenant_id = asField(row, "tenant_id");
    const asset_id = asField(row, "asset_id");
    const severity = asField(row, "severity");
    if (
      tenantAllowed(bypass, request_tenant_id, tenant_id) === true &&
      matchesFilter(asset_id, filter.asset_id) === true &&
      matchesFilter(severity, filter.severity) === true
    ) {
      items.push(
        Object.freeze({
          tenant_id,
          violation_id: asField(row, "violation_id"),
          asset_id,
          description: asField(row, "description"),
          severity,
          severity_color: severityColor(severity),
          status: asField(row, "status"),
        }),
      );
    }
    index = index + 1;
  }
  return items;
}

export function buildVendors(
  request_tenant_id: string,
  bypass: boolean,
  vendors: readonly Readonly<Record<string, unknown>>[],
  filter: GlobalDashboardIntegrationFilter,
): readonly IntegrationVendorItem[] {
  const items: IntegrationVendorItem[] = [];
  let index = 0;
  while (index < vendors.length) {
    const row = vendors[index];
    const tenant_id = asField(row, "tenant_id");
    const vendor_id = asField(row, "vendor_id");
    if (tenantAllowed(bypass, request_tenant_id, tenant_id) === true && matchesFilter(vendor_id, filter.vendor_id) === true) {
      items.push(
        Object.freeze({
          tenant_id,
          vendor_id,
          vendor_name: asField(row, "vendor_name"),
          location: asField(row, "location"),
        }),
      );
    }
    index = index + 1;
  }
  return items;
}

function laterTimestamp(left: string, right: string): boolean {
  if (right === "") {
    return false;
  }
  if (left === "") {
    return true;
  }
  return right > left;
}

export function buildTelematics(
  request_tenant_id: string,
  bypass: boolean,
  assets: readonly Readonly<Record<string, unknown>>[],
  telematics: readonly Readonly<Record<string, unknown>>[],
  packs: readonly ConfigurationPackEffect[],
  filter: GlobalDashboardIntegrationFilter,
): IntegrationTelematicsResult {
  const latest: Record<string, string> = {};
  let scan = 0;
  while (scan < telematics.length) {
    const row = telematics[scan];
    const tenant_id = asField(row, "tenant_id");
    if (tenantAllowed(bypass, request_tenant_id, tenant_id) === true) {
      const key = tenant_id + ":" + asField(row, "asset_id");
      const timestamp = asField(row, "timestamp");
      if (laterTimestamp(latest[key] || "", timestamp) === true) {
        latest[key] = timestamp;
      }
    }
    scan = scan + 1;
  }

  const points: IntegrationFindVehiclePoint[] = [];
  let index = 0;
  while (index < telematics.length) {
    const row = telematics[index];
    const tenant_id = asField(row, "tenant_id");
    const asset_id = asField(row, "asset_id");
    const severity = asField(row, "severity");
    const fault_code = asField(row, "fault_code");
    const fault_description = asField(row, "fault_description");
    let include = tenantAllowed(bypass, request_tenant_id, tenant_id);
    if (include === true && matchesFilter(asset_id, filter.asset_id) === false) {
      include = false;
    }
    if (include === true && matchesFilter(severity, filter.severity) === false) {
      include = false;
    }
    if (include === true) {
      let unit_number = "";
      let assetIndex = 0;
      while (assetIndex < assets.length) {
        if (asField(assets[assetIndex], "tenant_id") === tenant_id && asField(assets[assetIndex], "asset_id") === asset_id) {
          unit_number = asField(assets[assetIndex], "unit_number");
        }
        assetIndex = assetIndex + 1;
      }
      const timestamp = asField(row, "timestamp");
      const is_latest = latest[tenant_id + ":" + asset_id] === timestamp;
      let mapped_severity = severity;
      const tenantPacks = packEffectsForTenant(packs, tenant_id);
      let packIndex = 0;
      while (packIndex < tenantPacks.length) {
        if (tenantPacks[packIndex].telematics_fault_code === fault_code && tenantPacks[packIndex].telematics_severity !== "") {
          mapped_severity = tenantPacks[packIndex].telematics_severity;
        }
        packIndex = packIndex + 1;
      }
      points.push(
        Object.freeze({
          tenant_id,
          asset_id,
          unit_number,
          telematics_id: asField(row, "telematics_id"),
          fault_code,
          fault_description,
          severity: mapped_severity,
          severity_color: severityColor(mapped_severity),
          source: telematicsChannel(fault_code, fault_description, is_latest),
          timestamp,
        }),
      );
    }
    index = index + 1;
  }
  return Object.freeze({
    tenant_id: request_tenant_id,
    label: FIND_VEHICLE_LABEL,
    points,
  });
}

function isAimiEventType(event_type: string): boolean {
  let index = 0;
  while (index < GLOBAL_DASHBOARD_INTEGRATION_AIMI_TYPES.length) {
    if (GLOBAL_DASHBOARD_INTEGRATION_AIMI_TYPES[index] === event_type) {
      return true;
    }
    index = index + 1;
  }
  return false;
}

export function buildAimi(
  request_tenant_id: string,
  bypass: boolean,
  include_insights: boolean,
  events: readonly Readonly<Record<string, unknown>>[],
  models: readonly Readonly<Record<string, unknown>>[],
  severity: readonly Readonly<Record<string, unknown>>[],
  inspections: readonly Readonly<Record<string, unknown>>[],
  parts: readonly Readonly<Record<string, unknown>>[],
  filter: GlobalDashboardIntegrationFilter,
): readonly IntegrationAimiItem[] {
  const items: IntegrationAimiItem[] = [];
  let index = 0;
  while (index < events.length) {
    const row = events[index];
    const tenant_id = asField(row, "tenant_id");
    const event_type = asField(row, "event_type");
    const payload = payloadRecord(row);
    const asset_id = asField(payload, "asset_id") || asField(row, "asset_id");
    const workorder_id = asField(payload, "workorder_id") || asField(row, "workorder_id");
    if (tenantAllowed(bypass, request_tenant_id, tenant_id) === true && isAimiEventType(event_type) === true) {
      if (include_insights === false && event_type.indexOf("aimi.insight") === 0) {
        index = index + 1;
        continue;
      }
      if (matchesFilter(asset_id, filter.asset_id) === true && matchesFilter(workorder_id, filter.workorder_id) === true) {
        const insight_severity = asField(payload, "insight_severity") || asField(payload, "severity");
        items.push(
          Object.freeze({
            tenant_id,
            asset_id,
            workorder_id,
            insight_type: asField(payload, "insight_type"),
            insight_severity,
            severity_color: severityColor(insight_severity),
            predictive_score: asField(payload, "predictive_score"),
            failure_risk: asField(payload, "failure_risk"),
            anomaly: asField(payload, "anomaly"),
            compliance_prediction: asField(payload, "compliance_prediction"),
            parts_usage_prediction: asField(payload, "parts_usage_prediction"),
            event_type,
            timestamp: asField(row, "timestamp"),
          }),
        );
      }
    }
    index = index + 1;
  }

  let modelIndex = 0;
  while (modelIndex < models.length) {
    const row = models[modelIndex];
    const tenant_id = asField(row, "tenant_id");
    const asset_id = asField(row, "asset_id");
    if (tenantAllowed(bypass, request_tenant_id, tenant_id) === true && matchesFilter(asset_id, filter.asset_id) === true) {
      items.push(
        Object.freeze({
          tenant_id,
          asset_id,
          workorder_id: "",
          insight_type: "predictive",
          insight_severity: "",
          severity_color: severityColor(""),
          predictive_score: asField(row, "predictive_score"),
          failure_risk: asField(row, "failure_risk"),
          anomaly: asField(row, "failure_risk"),
          compliance_prediction: "",
          parts_usage_prediction: asField(row, "predictive_score"),
          event_type: "aimi.predictive.generated",
          timestamp: asField(row, "updated_at"),
        }),
      );
    }
    modelIndex = modelIndex + 1;
  }

  let severityIndex = 0;
  while (severityIndex < severity.length) {
    const row = severity[severityIndex];
    const tenant_id = asField(row, "tenant_id");
    const workorder_id = asField(row, "workorder_id");
    const mapped_severity = asField(row, "severity");
    if (tenantAllowed(bypass, request_tenant_id, tenant_id) === true && matchesFilter(workorder_id, filter.workorder_id) === true) {
      items.push(
        Object.freeze({
          tenant_id,
          asset_id: "",
          workorder_id,
          insight_type: "severity",
          insight_severity: mapped_severity,
          severity_color: severityColor(mapped_severity),
          predictive_score: "",
          failure_risk: "",
          anomaly: "",
          compliance_prediction: "",
          parts_usage_prediction: "",
          event_type: "aimi.insight.generated",
          timestamp: asField(row, "created_at"),
        }),
      );
    }
    severityIndex = severityIndex + 1;
  }

  let inspectionIndex = 0;
  while (inspectionIndex < inspections.length) {
    const row = inspections[inspectionIndex];
    const tenant_id = asField(row, "tenant_id");
    const asset_id = asField(row, "asset_id");
    const status = asField(row, "status");
    if (tenantAllowed(bypass, request_tenant_id, tenant_id) === true && matchesFilter(asset_id, filter.asset_id) === true) {
      items.push(
        Object.freeze({
          tenant_id,
          asset_id,
          workorder_id: "",
          insight_type: "compliance_prediction",
          insight_severity: status === "failed" ? "S2" : "S4",
          severity_color: severityColor(status === "failed" ? "S2" : "S4"),
          predictive_score: "",
          failure_risk: "",
          anomaly: "",
          compliance_prediction: status,
          parts_usage_prediction: "",
          event_type: "aimi.insight.generated",
          timestamp: asField(row, "updated_at"),
        }),
      );
    }
    inspectionIndex = inspectionIndex + 1;
  }

  let partIndex = 0;
  while (partIndex < parts.length) {
    const row = parts[partIndex];
    const tenant_id = asField(row, "tenant_id");
    if (tenantAllowed(bypass, request_tenant_id, tenant_id) === true) {
      items.push(
        Object.freeze({
          tenant_id,
          asset_id: "",
          workorder_id: "",
          insight_type: "parts_usage_prediction",
          insight_severity: "",
          severity_color: severityColor(""),
          predictive_score: asField(row, "quantity"),
          failure_risk: "",
          anomaly: "",
          compliance_prediction: "",
          parts_usage_prediction: asField(row, "quantity"),
          event_type: "aimi.predictive.generated",
          timestamp: asField(row, "updated_at"),
        }),
      );
    }
    partIndex = partIndex + 1;
  }

  return items;
}
