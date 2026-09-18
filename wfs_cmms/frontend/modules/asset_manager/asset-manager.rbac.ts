import type { DtoRole } from "../../../../src/core/dto/base.dto";

export function canAccessAssetManagerUi(role: DtoRole): boolean {
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
  return false;
}
