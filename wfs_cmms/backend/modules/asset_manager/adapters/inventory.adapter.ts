import { INVENTORY_API_ROUTES } from "../../../../src/services/inventory/api/inventory.api.contract";
import { isInventoryApiAllowed } from "../../../../src/services/inventory/api/inventory.api.permissions";

export const ASSET_MANAGER_INVENTORY_ROUTES = INVENTORY_API_ROUTES;
export { isInventoryApiAllowed as isAssetManagerInventoryApiAllowed };
