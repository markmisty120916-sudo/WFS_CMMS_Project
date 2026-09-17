import { isTechnicianEventType } from "../technician.events";
import type {
  TechnicianAssetHealthItem,
  TechnicianComplianceFlag,
  TechnicianEventItem,
  TechnicianPartsNeededItem,
  TechnicianPmUpcomingItem,
  TechnicianPredictiveAlert,
  TechnicianQueueFilter,
  TechnicianSession,
  TechnicianTask,
  TechnicianWorkorder,
} from "../technician.interface";
import { isAssignedToTechnician, technicianTenantAllowed } from "../technician.rbac";

export function filterAssignedWorkorders(
  items: readonly TechnicianWorkorder[],
  session: TechnicianSession,
  filter: TechnicianQueueFilter,
): readonly TechnicianWorkorder[] {
  const result: TechnicianWorkorder[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (isAssignedToTechnician(session, item) === true) {
      let include = true;
      if (filter.status !== "") {
        if (item.status !== filter.status) {
          include = false;
        }
      }
      if (filter.asset_id !== "") {
        if (item.asset_id !== filter.asset_id) {
          include = false;
        }
      }
      if (filter.severity !== "") {
        if (item.severity !== filter.severity) {
          include = false;
        }
      }
      if (include === true) {
        result.push(item);
      }
    }
    index = index + 1;
  }
  return result;
}

export function filterAssignedTasks(items: readonly TechnicianTask[], session: TechnicianSession): readonly TechnicianTask[] {
  const result: TechnicianTask[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (technicianTenantAllowed(session.tenant_id, item.tenant_id) === true) {
      if (session.role === "TECHNICIAN") {
        if (item.routing_tech_id === session.user_id) {
          result.push(item);
        }
      } else {
        result.push(item);
      }
    }
    index = index + 1;
  }
  return result;
}

export function assignedAssetIds(items: readonly TechnicianWorkorder[]): readonly string[] {
  const ids: string[] = [];
  let index = 0;
  while (index < items.length) {
    const asset_id = items[index].asset_id;
    if (asset_id !== "") {
      let exists = false;
      let scan = 0;
      while (scan < ids.length) {
        if (ids[scan] === asset_id) {
          exists = true;
        }
        scan = scan + 1;
      }
      if (exists === false) {
        ids.push(asset_id);
      }
    }
    index = index + 1;
  }
  return ids;
}

export function assignedWorkorderIds(items: readonly TechnicianWorkorder[]): readonly string[] {
  const ids: string[] = [];
  let index = 0;
  while (index < items.length) {
    ids.push(items[index].workorder_id);
    index = index + 1;
  }
  return ids;
}

export function containsId(ids: readonly string[], value: string): boolean {
  let index = 0;
  while (index < ids.length) {
    if (ids[index] === value) {
      return true;
    }
    index = index + 1;
  }
  return false;
}

export function filterAssetHealthByAssigned(
  items: readonly TechnicianAssetHealthItem[],
  tenant_id: string,
  asset_ids: readonly string[],
): readonly TechnicianAssetHealthItem[] {
  const result: TechnicianAssetHealthItem[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (technicianTenantAllowed(tenant_id, item.tenant_id) === true) {
      if (containsId(asset_ids, item.asset_id) === true) {
        result.push(item);
      }
    }
    index = index + 1;
  }
  return result;
}

export function filterPmByAssigned(
  items: readonly TechnicianPmUpcomingItem[],
  tenant_id: string,
  asset_ids: readonly string[],
): readonly TechnicianPmUpcomingItem[] {
  const result: TechnicianPmUpcomingItem[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (technicianTenantAllowed(tenant_id, item.tenant_id) === true) {
      if (containsId(asset_ids, item.asset_id) === true) {
        result.push(item);
      }
    }
    index = index + 1;
  }
  return result;
}

export function filterPartsByAssigned(
  items: readonly TechnicianPartsNeededItem[],
  tenant_id: string,
  workorder_ids: readonly string[],
): readonly TechnicianPartsNeededItem[] {
  const result: TechnicianPartsNeededItem[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (technicianTenantAllowed(tenant_id, item.tenant_id) === true) {
      if (containsId(workorder_ids, item.workorder_id) === true) {
        result.push(item);
      }
    }
    index = index + 1;
  }
  return result;
}

export function filterPredictiveByAssigned(
  items: readonly TechnicianPredictiveAlert[],
  tenant_id: string,
  workorder_ids: readonly string[],
  asset_ids: readonly string[],
): readonly TechnicianPredictiveAlert[] {
  const result: TechnicianPredictiveAlert[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (technicianTenantAllowed(tenant_id, item.tenant_id) === true) {
      if (containsId(workorder_ids, item.workorder_id) === true || containsId(asset_ids, item.asset_id) === true) {
        if (item.failure_risk === "Imminent" || item.failure_risk === "High" || item.failure_risk !== "") {
          result.push(item);
        }
      }
    }
    index = index + 1;
  }
  return result;
}

export function filterComplianceFlags(
  items: readonly TechnicianComplianceFlag[],
  tenant_id: string,
  workorder_ids: readonly string[],
): readonly TechnicianComplianceFlag[] {
  const result: TechnicianComplianceFlag[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (technicianTenantAllowed(tenant_id, item.tenant_id) === true) {
      if (containsId(workorder_ids, item.workorder_id) === true) {
        result.push(item);
      }
    }
    index = index + 1;
  }
  return result;
}

export function filterTechnicianEvents(items: readonly TechnicianEventItem[], tenant_id: string): readonly TechnicianEventItem[] {
  const result: TechnicianEventItem[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (technicianTenantAllowed(tenant_id, item.tenant_id) === true) {
      if (isTechnicianEventType(item.event_type) === true) {
        result.push(item);
      }
    }
    index = index + 1;
  }
  return result;
}
