import { isDriverPortalSafetyInsightType } from "../adapters/aimi.adapter";
import { matchesDriverAsset } from "../driver-portal-rules";
import type { DriverPortalFilter, DriverSafetyAlertItem } from "../driver-portal.interface";
import { asField, payloadRecord } from "../driver-portal.repository";
import { driverSafeFaultLevel, driverSafeOperationalStatus, driverSafeS1Wording } from "./driver-safe.engine";

export function buildDriverSafetyAlerts(
  tenant_id: string,
  assets: readonly Readonly<Record<string, unknown>>[],
  inspections: readonly Readonly<Record<string, unknown>>[],
  telematics: readonly Readonly<Record<string, unknown>>[],
  events: readonly Readonly<Record<string, unknown>>[],
  filter: DriverPortalFilter,
): readonly DriverSafetyAlertItem[] {
  const items: DriverSafetyAlertItem[] = [];

  let assetIndex = 0;
  while (assetIndex < assets.length) {
    const row = assets[assetIndex];
    if (asField(row, "tenant_id") === tenant_id) {
      const asset_id = asField(row, "asset_id");
      if (matchesDriverAsset(asset_id, filter.asset) === true) {
        const operational = driverSafeOperationalStatus(asField(row, "status"));
        if (operational === "Out of Service") {
          items.push(
            Object.freeze({
              tenant_id,
              alert_id: "oos:" + asset_id,
              asset_id,
              wording: "out of service — do not operate",
              kind: "out_of_service",
              timestamp: asField(row, "updated_at"),
            }),
          );
        }
      }
    }
    assetIndex = assetIndex + 1;
  }

  let inspectionIndex = 0;
  while (inspectionIndex < inspections.length) {
    const row = inspections[inspectionIndex];
    if (asField(row, "tenant_id") === tenant_id) {
      const asset_id = asField(row, "asset_id");
      if (matchesDriverAsset(asset_id, filter.asset) === true) {
        const status = asField(row, "status");
        if (status === "failed" || status === "hold") {
          items.push(
            Object.freeze({
              tenant_id,
              alert_id: "compliance:" + asField(row, "inspection_id"),
              asset_id,
              wording: "compliance block — do not operate",
              kind: "compliance_block",
              timestamp: asField(row, "updated_at"),
            }),
          );
        }
      }
    }
    inspectionIndex = inspectionIndex + 1;
  }

  let telematicsIndex = 0;
  while (telematicsIndex < telematics.length) {
    const row = telematics[telematicsIndex];
    if (asField(row, "tenant_id") === tenant_id) {
      const asset_id = asField(row, "asset_id");
      if (matchesDriverAsset(asset_id, filter.asset) === true) {
        const level = driverSafeFaultLevel(asField(row, "severity"));
        if (level === "critical") {
          items.push(
            Object.freeze({
              tenant_id,
              alert_id: "telematics:" + asField(row, "telematics_id"),
              asset_id,
              wording: "critical vehicle alert — stop and report",
              kind: "telematics",
              timestamp: asField(row, "timestamp"),
            }),
          );
        }
      }
    }
    telematicsIndex = telematicsIndex + 1;
  }

  let eventIndex = 0;
  while (eventIndex < events.length) {
    const row = events[eventIndex];
    if (asField(row, "tenant_id") === tenant_id) {
      const event_type = asField(row, "event_type");
      if (isDriverPortalSafetyInsightType(event_type) === true) {
        const payload = payloadRecord(row);
        const asset_id = asField(payload, "asset_id");
        if (matchesDriverAsset(asset_id, filter.asset) === true) {
          const severity = asField(payload, "severity");
          if (severity === "S1" || event_type === "aimi.predictive.escalated") {
            items.push(
              Object.freeze({
                tenant_id,
                alert_id: "aimi:" + asField(row, "event_id"),
                asset_id,
                wording: driverSafeS1Wording(),
                kind: "s1",
                timestamp: asField(row, "timestamp"),
              }),
            );
          }
        }
      }
    }
    eventIndex = eventIndex + 1;
  }

  return items;
}
