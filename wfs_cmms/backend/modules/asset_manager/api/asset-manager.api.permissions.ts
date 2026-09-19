import type { DtoRole } from "@/dto/base.dto";
import { canAccessAssetManager } from "../asset-manager-rules";
import type { AssetManagerApiOperation } from "./asset-manager.api.contract";

export function isAssetManagerApiAllowed(operation: AssetManagerApiOperation, role: DtoRole): boolean {
  if (canAccessAssetManager(role) === false) {
    return false;
  }
  if (operation === "bulk_upload") {
    return true;
  }
  if (operation === "bulk_validate") {
    return true;
  }
  if (operation === "bulk_preview") {
    return true;
  }
  if (operation === "bulk_commit") {
    return true;
  }
  if (operation === "list_imports") {
    return true;
  }
  if (operation === "get_import") {
    return true;
  }
  if (operation === "list_assets") {
    return true;
  }
  if (operation === "create_asset") {
    return true;
  }
  if (operation === "update_asset") {
    return true;
  }
  if (operation === "delete_asset") {
    return true;
  }
  if (operation === "list_parts") {
    return true;
  }
  if (operation === "create_part") {
    return true;
  }
  if (operation === "update_part") {
    return true;
  }
  if (operation === "delete_part") {
    return true;
  }
  if (operation === "list_employees") {
    return true;
  }
  if (operation === "create_employee") {
    return true;
  }
  if (operation === "update_employee") {
    return true;
  }
  if (operation === "delete_employee") {
    return true;
  }
  if (operation === "list_pm") {
    return true;
  }
  if (operation === "create_pm") {
    return true;
  }
  if (operation === "update_pm") {
    return true;
  }
  if (operation === "delete_pm") {
    return true;
  }
  if (operation === "list_vendors") {
    return true;
  }
  if (operation === "upsert_vendor") {
    return true;
  }
  if (operation === "delete_vendor") {
    return true;
  }
  if (operation === "list_packs") {
    return true;
  }
  if (operation === "create_pack") {
    return true;
  }
  if (operation === "apply_pack") {
    return true;
  }
  return false;
}
