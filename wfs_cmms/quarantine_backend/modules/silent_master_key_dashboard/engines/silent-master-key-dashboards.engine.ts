import type { SilentMasterKeyDashboardItem } from "../silent-master-key-dashboard.interface";

export function buildDashboardSwitchList(tenant_id: string): readonly SilentMasterKeyDashboardItem[] {
  return Object.freeze([
    Object.freeze({ tenant_id, dashboard: "Asset Manager", path: "/asset-manager" }),
    Object.freeze({ tenant_id, dashboard: "Fleet Manager Dashboard", path: "/fleet-manager" }),
    Object.freeze({ tenant_id, dashboard: "Technician Dashboard", path: "/technician" }),
    Object.freeze({ tenant_id, dashboard: "Master Technician Dashboard", path: "/master-technician" }),
    Object.freeze({ tenant_id, dashboard: "Parts Manager Dashboard", path: "/parts-manager" }),
    Object.freeze({ tenant_id, dashboard: "Compliance Dashboard", path: "/compliance" }),
    Object.freeze({ tenant_id, dashboard: "Driver Portal", path: "/driver" }),
  ]);
}
