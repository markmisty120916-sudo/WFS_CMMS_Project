export const ASSET_API_BASE = "/v1/assets";

export const ASSET_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type AssetApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export type AssetApiOperation =
  | "list"
  | "get"
  | "create"
  | "update"
  | "remove";

export type AssetApiRoute = {
  readonly method: AssetApiMethod;
  readonly path: string;
  readonly operation: AssetApiOperation;
};

export const ASSET_API_ROUTES: readonly AssetApiRoute[] = Object.freeze([
  Object.freeze({
    method: "GET" as const,
    path: "/assets",
    operation: "list" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/assets/{asset_id}",
    operation: "get" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/assets",
    operation: "create" as const,
  }),
  Object.freeze({
    method: "PUT" as const,
    path: "/assets/{asset_id}",
    operation: "update" as const,
  }),
  Object.freeze({
    method: "DELETE" as const,
    path: "/assets/{asset_id}",
    operation: "remove" as const,
  }),
]);

export function assetApiPath(asset_id: string): string {
  if (asset_id === "") {
    return "/assets";
  }
  return "/assets/" + asset_id;
}
