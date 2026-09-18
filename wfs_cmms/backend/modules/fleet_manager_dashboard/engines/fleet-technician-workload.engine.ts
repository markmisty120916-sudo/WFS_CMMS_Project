import type { FleetManagerFilter, FleetTechnicianWorkloadItem } from "../fleet-manager-dashboard.interface";
import { isOpenWorkorder } from "../fleet-manager-dashboard-rules";
import { asField } from "../fleet-manager-dashboard.repository";

export function buildTechnicianWorkload(
  tenant_id: string,
  workorders: readonly Readonly<Record<string, unknown>>[],
  filter: FleetManagerFilter,
): readonly FleetTechnicianWorkloadItem[] {
  const counts: Record<string, { assigned: number; s1: number; waiting: number }> = {};
  let index = 0;
  while (index < workorders.length) {
    const row = workorders[index];
    if (asField(row, "tenant_id") === tenant_id && isOpenWorkorder(asField(row, "status")) === true) {
      const technician_id = asField(row, "routing_tech_id");
      if (technician_id !== "") {
        if (filter.technician === "" || filter.technician === technician_id) {
          if (filter.severity === "" || filter.severity === asField(row, "severity")) {
            if (counts[technician_id] === undefined) {
              counts[technician_id] = { assigned: 0, s1: 0, waiting: 0 };
            }
            counts[technician_id].assigned = counts[technician_id].assigned + 1;
            if (asField(row, "severity") === "S1") {
              counts[technician_id].s1 = counts[technician_id].s1 + 1;
            }
            if (asField(row, "status") === "waiting_parts") {
              counts[technician_id].waiting = counts[technician_id].waiting + 1;
            }
          }
        }
      }
    }
    index = index + 1;
  }
  const keys = Object.keys(counts);
  const items: FleetTechnicianWorkloadItem[] = [];
  let keyIndex = 0;
  while (keyIndex < keys.length) {
    const technician_id = keys[keyIndex];
    items.push(
      Object.freeze({
        tenant_id,
        technician_id,
        assigned_count: String(counts[technician_id].assigned),
        s1_count: String(counts[technician_id].s1),
        waiting_parts_count: String(counts[technician_id].waiting),
      }),
    );
    keyIndex = keyIndex + 1;
  }
  return items;
}
