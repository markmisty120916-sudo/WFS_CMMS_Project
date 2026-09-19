import type { DtoRole } from "../../../../src/core/dto/base.dto";
import type { IntegrationDashboard } from "./global-dashboard-integration.interface";

export function canAccessGlobalDashboardIntegration(role: DtoRole): boolean {
  if (role === "TECHNICIAN") {
    return true;
  }
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
  if (role === "PARTS MANAGER") {
    return true;
  }
  if (role === "COMPLIANCE OFFICER") {
    return true;
  }
  if (role === "DRIVER") {
    return true;
  }
  if (role === "ADMIN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function bypassesTenantIsolation(role: DtoRole): boolean {
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function integrationTenantAllowed(role: DtoRole, session_tenant_id: string, record_tenant_id: string): boolean {
  if (session_tenant_id === "") {
    return false;
  }
  if (bypassesTenantIsolation(role) === true) {
    return true;
  }
  if (record_tenant_id !== session_tenant_id) {
    return false;
  }
  return true;
}

export function canAccessIntegrationAimi(role: DtoRole): boolean {
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
  if (role === "ADMIN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  if (role === "TECHNICIAN") {
    return true;
  }
  return false;
}

export function canAccessIntegrationInventory(role: DtoRole): boolean {
  if (role === "PARTS MANAGER") {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "TECHNICIAN") {
    return true;
  }
  if (role === "ADMIN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function canAccessIntegrationCompliance(role: DtoRole): boolean {
  if (role === "COMPLIANCE OFFICER") {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "ADMIN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  if (role === "DRIVER") {
    return true;
  }
  if (role === "TECHNICIAN") {
    return true;
  }
  return false;
}

export function showFindVehicle(_dashboard: IntegrationDashboard): boolean {
  return true;
}

export function showConfigurationPacks(dashboard: IntegrationDashboard): boolean {
  if (dashboard === "driver") {
    return false;
  }
  return true;
}

export function showImportHistory(dashboard: IntegrationDashboard): boolean {
  if (dashboard === "driver") {
    return false;
  }
  return true;
}
