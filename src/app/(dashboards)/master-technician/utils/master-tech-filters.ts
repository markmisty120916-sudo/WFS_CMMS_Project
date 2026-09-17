import { isMasterTechEventType } from "../master-tech.events";
import type {
  MasterTechAssetHealthItem,
  MasterTechComplianceStatusItem,
  MasterTechEventItem,
  MasterTechPartsStatusItem,
  MasterTechPmStatusItem,
  MasterTechPredictiveAlert,
  MasterTechQueueFilter,
  MasterTechWorkorder,
} from "../master-tech.interface";
import { masterTechTenantAllowed } from "../master-tech.rbac";

export function filterWorkorderQueue(
  items: readonly MasterTechWorkorder[],
  tenant_id: string,
  filter: MasterTechQueueFilter,
): readonly MasterTechWorkorder[] {
  const result: MasterTechWorkorder[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (masterTechTenantAllowed(tenant_id, item.tenant_id) === true) {
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

export function filterPredictiveImminent(items: readonly MasterTechPredictiveAlert[], tenant_id: string): readonly MasterTechPredictiveAlert[] {
  const result: MasterTechPredictiveAlert[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (masterTechTenantAllowed(tenant_id, item.tenant_id) === true) {
      if (item.failure_risk === "Imminent" || item.failure_risk === "High") {
        result.push(item);
      }
    }
    index = index + 1;
  }
  return result;
}

export function filterAssetHealth(items: readonly MasterTechAssetHealthItem[], tenant_id: string): readonly MasterTechAssetHealthItem[] {
  const result: MasterTechAssetHealthItem[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (masterTechTenantAllowed(tenant_id, item.tenant_id) === true) {
      result.push(item);
    }
    index = index + 1;
  }
  return result;
}

export function filterPmStatus(items: readonly MasterTechPmStatusItem[], tenant_id: string): readonly MasterTechPmStatusItem[] {
  const result: MasterTechPmStatusItem[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (masterTechTenantAllowed(tenant_id, item.tenant_id) === true) {
      result.push(item);
    }
    index = index + 1;
  }
  return result;
}

export function filterPartsStatus(items: readonly MasterTechPartsStatusItem[], tenant_id: string): readonly MasterTechPartsStatusItem[] {
  const result: MasterTechPartsStatusItem[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (masterTechTenantAllowed(tenant_id, item.tenant_id) === true) {
      result.push(item);
    }
    index = index + 1;
  }
  return result;
}

export function filterComplianceStatus(items: readonly MasterTechComplianceStatusItem[], tenant_id: string): readonly MasterTechComplianceStatusItem[] {
  const result: MasterTechComplianceStatusItem[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (masterTechTenantAllowed(tenant_id, item.tenant_id) === true) {
      result.push(item);
    }
    index = index + 1;
  }
  return result;
}

export function filterMasterTechEvents(items: readonly MasterTechEventItem[], tenant_id: string): readonly MasterTechEventItem[] {
  const result: MasterTechEventItem[] = [];
  let index = 0;
  while (index < items.length) {
    const item = items[index];
    if (masterTechTenantAllowed(tenant_id, item.tenant_id) === true) {
      if (isMasterTechEventType(item.event_type) === true) {
        result.push(item);
      }
    }
    index = index + 1;
  }
  return result;
}
