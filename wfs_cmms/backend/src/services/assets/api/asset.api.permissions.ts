import type { DtoRole } from "../../../core/dto/base.dto";
import { canViewAllAssets, canViewAssignedAsset, canWriteAsset } from "../assets-rules";
import type { AssetApiOperation } from "./asset.api.contract";

export function isAssetApiAllowed(operation: AssetApiOperation, role: DtoRole): boolean {
  if (operation === "list") {
    if (canViewAllAssets(role) === true) {
      return true;
    }
    if (canViewAssignedAsset(role) === true) {
      return true;
    }
    return false;
  }
  if (operation === "get") {
    if (canViewAllAssets(role) === true) {
      return true;
    }
    if (canViewAssignedAsset(role) === true) {
      return true;
    }
    return false;
  }
  if (operation === "create") {
    return canWriteAsset(role);
  }
  if (operation === "update") {
    return canWriteAsset(role);
  }
  if (operation === "remove") {
    return canWriteAsset(role);
  }
  return false;
}
