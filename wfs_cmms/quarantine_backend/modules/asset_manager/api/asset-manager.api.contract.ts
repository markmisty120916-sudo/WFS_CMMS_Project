export const ASSET_MANAGER_API_BASE = "/v1/asset-manager";

export const ASSET_MANAGER_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type AssetManagerApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export type AssetManagerApiOperation =
  | "bulk_upload"
  | "bulk_validate"
  | "bulk_preview"
  | "bulk_commit"
  | "list_imports"
  | "get_import"
  | "list_assets"
  | "create_asset"
  | "update_asset"
  | "delete_asset"
  | "list_parts"
  | "create_part"
  | "update_part"
  | "delete_part"
  | "list_employees"
  | "create_employee"
  | "update_employee"
  | "delete_employee"
  | "list_pm"
  | "create_pm"
  | "update_pm"
  | "delete_pm"
  | "list_vendors"
  | "upsert_vendor"
  | "delete_vendor"
  | "list_packs"
  | "create_pack"
  | "apply_pack";

export type AssetManagerApiRoute = {
  readonly method: AssetManagerApiMethod;
  readonly path: string;
  readonly operation: AssetManagerApiOperation;
};

export const ASSET_MANAGER_API_ROUTES: readonly AssetManagerApiRoute[] = Object.freeze([
  Object.freeze({ method: "POST" as const, path: "/asset-manager/imports/upload", operation: "bulk_upload" as const }),
  Object.freeze({ method: "POST" as const, path: "/asset-manager/imports/{import_id}/validate", operation: "bulk_validate" as const }),
  Object.freeze({ method: "POST" as const, path: "/asset-manager/imports/{import_id}/preview", operation: "bulk_preview" as const }),
  Object.freeze({ method: "POST" as const, path: "/asset-manager/imports/{import_id}/commit", operation: "bulk_commit" as const }),
  Object.freeze({ method: "GET" as const, path: "/asset-manager/imports", operation: "list_imports" as const }),
  Object.freeze({ method: "GET" as const, path: "/asset-manager/imports/{import_id}", operation: "get_import" as const }),
  Object.freeze({ method: "GET" as const, path: "/asset-manager/assets", operation: "list_assets" as const }),
  Object.freeze({ method: "POST" as const, path: "/asset-manager/assets", operation: "create_asset" as const }),
  Object.freeze({ method: "PUT" as const, path: "/asset-manager/assets/{asset_id}", operation: "update_asset" as const }),
  Object.freeze({ method: "DELETE" as const, path: "/asset-manager/assets/{asset_id}", operation: "delete_asset" as const }),
  Object.freeze({ method: "GET" as const, path: "/asset-manager/parts", operation: "list_parts" as const }),
  Object.freeze({ method: "POST" as const, path: "/asset-manager/parts", operation: "create_part" as const }),
  Object.freeze({ method: "PUT" as const, path: "/asset-manager/parts/{part_id}", operation: "update_part" as const }),
  Object.freeze({ method: "DELETE" as const, path: "/asset-manager/parts/{part_id}", operation: "delete_part" as const }),
  Object.freeze({ method: "GET" as const, path: "/asset-manager/employees", operation: "list_employees" as const }),
  Object.freeze({ method: "POST" as const, path: "/asset-manager/employees", operation: "create_employee" as const }),
  Object.freeze({ method: "PUT" as const, path: "/asset-manager/employees/{user_id}", operation: "update_employee" as const }),
  Object.freeze({ method: "DELETE" as const, path: "/asset-manager/employees/{user_id}", operation: "delete_employee" as const }),
  Object.freeze({ method: "GET" as const, path: "/asset-manager/pm", operation: "list_pm" as const }),
  Object.freeze({ method: "POST" as const, path: "/asset-manager/pm", operation: "create_pm" as const }),
  Object.freeze({ method: "PUT" as const, path: "/asset-manager/pm/{pm_schedule_id}", operation: "update_pm" as const }),
  Object.freeze({ method: "DELETE" as const, path: "/asset-manager/pm/{pm_schedule_id}", operation: "delete_pm" as const }),
  Object.freeze({ method: "GET" as const, path: "/asset-manager/vendors", operation: "list_vendors" as const }),
  Object.freeze({ method: "POST" as const, path: "/asset-manager/vendors", operation: "upsert_vendor" as const }),
  Object.freeze({ method: "DELETE" as const, path: "/asset-manager/vendors/{vendor_id}", operation: "delete_vendor" as const }),
  Object.freeze({ method: "GET" as const, path: "/asset-manager/packs", operation: "list_packs" as const }),
  Object.freeze({ method: "POST" as const, path: "/asset-manager/packs", operation: "create_pack" as const }),
  Object.freeze({ method: "POST" as const, path: "/asset-manager/packs/{pack_id}/apply", operation: "apply_pack" as const }),
]);

export function assetManagerApiPath(path: string, params: Readonly<Record<string, string>>): string {
  let resolved = path;
  const keys = Object.keys(params);
  let index = 0;
  while (index < keys.length) {
    const key = keys[index];
    resolved = resolved.split("{" + key + "}").join(encodeURIComponent(params[key]));
    index = index + 1;
  }
  return ASSET_MANAGER_API_BASE.replace("/v1", "") === "/asset-manager"
    ? "/v1" + resolved
    : "/v1" + resolved;
}
