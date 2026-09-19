export const INVENTORY_API_BASE = "/v1/parts";

export const INVENTORY_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type InventoryApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export type InventoryApiOperation =
  | "list_parts"
  | "get_part"
  | "create_part"
  | "update_part"
  | "delete_part"
  | "get_inventory"
  | "adjust_stock"
  | "reorder_part"
  | "upsert_vendor"
  | "list_requests";

export type InventoryApiRoute = {
  readonly method: InventoryApiMethod;
  readonly path: string;
  readonly operation: InventoryApiOperation;
};

export const INVENTORY_API_ROUTES: readonly InventoryApiRoute[] = Object.freeze([
  Object.freeze({
    method: "GET" as const,
    path: "/parts",
    operation: "list_parts" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/parts/{part_id}",
    operation: "get_part" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/parts",
    operation: "create_part" as const,
  }),
  Object.freeze({
    method: "PUT" as const,
    path: "/parts/{part_id}",
    operation: "update_part" as const,
  }),
  Object.freeze({
    method: "DELETE" as const,
    path: "/parts/{part_id}",
    operation: "delete_part" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/parts/{part_id}/inventory",
    operation: "get_inventory" as const,
  }),
  Object.freeze({
    method: "PUT" as const,
    path: "/parts/{part_id}/inventory",
    operation: "adjust_stock" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/parts/{part_id}/reorder",
    operation: "reorder_part" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/parts/vendors",
    operation: "upsert_vendor" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/workorders/{workorder_id}/parts/requests",
    operation: "list_requests" as const,
  }),
]);
