import type { DtoRole } from "../../../../src/core/dto/base.dto";
import type { ErrorType } from "../../../../src/core/errors/error-types";

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

export function canAccessIntegrationAimiInsights(role: DtoRole): boolean {
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

export function canAccessIntegrationVendors(role: DtoRole): boolean {
  if (role === "PARTS MANAGER") {
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
  return false;
}

export function canAccessIntegrationDefects(role: DtoRole): boolean {
  if (role === "DRIVER") {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
  if (role === "COMPLIANCE OFFICER") {
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

export function isDriverSafeRole(role: DtoRole): boolean {
  if (role === "DRIVER") {
    return true;
  }
  return false;
}

export function isTechnicianAssignedOnly(role: DtoRole): boolean {
  if (role === "TECHNICIAN") {
    return true;
  }
  return false;
}

export function globalDashboardIntegrationAccessError(role: DtoRole): ErrorType | "none" {
  if (canAccessGlobalDashboardIntegration(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function WORKORDER_STATES(): readonly string[] {
  return Object.freeze([
    "created",
    "assigned",
    "started",
    "waiting_parts",
    "on_hold",
    "completed",
    "closed",
    "escalated",
  ]);
}

export function ASSET_STATES(): readonly string[] {
  return Object.freeze(["active", "inactive", "out_of_service", "disposed"]);
}

export function severityColor(severity: string): string {
  if (severity === "S1") {
    return "red";
  }
  if (severity === "S2") {
    return "orange";
  }
  if (severity === "S3") {
    return "yellow";
  }
  return "green";
}

export function formatPmInterval(interval_miles: string, interval_hours: string): string {
  const miles = interval_miles === "" ? "0" : interval_miles;
  const hours = interval_hours === "" ? "0" : interval_hours;
  return miles + " mi / " + hours + " hr";
}
