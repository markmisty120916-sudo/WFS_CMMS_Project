import type { PartsAwaitingItem, PartsManagerFilter } from "../parts-manager-dashboard.interface";
import { asField } from "../parts-manager-dashboard.repository";

export function buildAwaitingParts(
  tenant_id: string,
  requests: readonly Readonly<Record<string, unknown>>[],
  workorders: readonly Readonly<Record<string, unknown>>[],
  filter: PartsManagerFilter,
): readonly PartsAwaitingItem[] {
  const items: PartsAwaitingItem[] = [];
  let index = 0;
  while (index < requests.length) {
    const row = requests[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const status = asField(row, "status");
      if (status !== "usage" && status !== "approved" && status !== "fulfilled") {
        const workorder_id = asField(row, "workorder_id");
        let severity = "";
        let woIndex = 0;
        while (woIndex < workorders.length) {
          if (asField(workorders[woIndex], "workorder_id") === workorder_id) {
            severity = asField(workorders[woIndex], "severity");
          }
          woIndex = woIndex + 1;
        }
        let include = true;
        if (filter.severity !== "" && severity !== filter.severity) {
          include = false;
        }
        if (include === true) {
          items.push(
            Object.freeze({
              tenant_id,
              workorder_id,
              part_id: asField(row, "part_id"),
              quantity: asField(row, "quantity"),
              status,
              severity,
            }),
          );
        }
      }
    }
    index = index + 1;
  }
  let wo = 0;
  while (wo < workorders.length) {
    const row = workorders[wo];
    if (asField(row, "tenant_id") === tenant_id && asField(row, "status") === "waiting_parts") {
      const severity = asField(row, "severity");
      if (filter.severity === "" || filter.severity === severity) {
        items.push(
          Object.freeze({
            tenant_id,
            workorder_id: asField(row, "workorder_id"),
            part_id: "",
            quantity: "",
            status: "waiting_parts",
            severity,
          }),
        );
      }
    }
    wo = wo + 1;
  }
  return items;
}
