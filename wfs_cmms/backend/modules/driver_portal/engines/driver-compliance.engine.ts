import { matchesDriverAsset } from "../driver-portal-rules";
import type { DriverComplianceItem, DriverPortalFilter } from "../driver-portal.interface";
import { asField } from "../driver-portal.repository";

export function buildDriverCompliance(
  tenant_id: string,
  inspections: readonly Readonly<Record<string, unknown>>[],
  violations: readonly Readonly<Record<string, unknown>>[],
  filter: DriverPortalFilter,
): readonly DriverComplianceItem[] {
  const items: DriverComplianceItem[] = [];
  let index = 0;
  while (index < inspections.length) {
    const row = inspections[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const asset_id = asField(row, "asset_id");
      if (matchesDriverAsset(asset_id, filter.asset) === true) {
        const status = asField(row, "status");
        let inspection_failure = "no";
        let block = "no";
        let regulatory_hold = "no";
        if (status === "failed") {
          inspection_failure = "yes";
          block = "yes";
        }
        if (status === "hold") {
          regulatory_hold = "yes";
          block = "yes";
        }
        items.push(
          Object.freeze({
            tenant_id,
            record_id: asField(row, "inspection_id"),
            asset_id,
            block,
            inspection_failure,
            regulatory_hold,
            required_documentation: asField(row, "type"),
            status,
          }),
        );
      }
    }
    index = index + 1;
  }
  let vIndex = 0;
  while (vIndex < violations.length) {
    const row = violations[vIndex];
    if (asField(row, "tenant_id") === tenant_id) {
      const asset_id = asField(row, "asset_id");
      if (matchesDriverAsset(asset_id, filter.asset) === true) {
        const status = asField(row, "status");
        let block = "no";
        if (status === "open") {
          block = "yes";
        }
        items.push(
          Object.freeze({
            tenant_id,
            record_id: asField(row, "violation_id"),
            asset_id,
            block,
            inspection_failure: "no",
            regulatory_hold: block,
            required_documentation: asField(row, "description"),
            status,
          }),
        );
      }
    }
    vIndex = vIndex + 1;
  }
  return items;
}
