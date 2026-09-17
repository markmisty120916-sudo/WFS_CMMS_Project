export { InventoryModule } from "./inventory.module";
export { InventoryService } from "./inventory.service";
export type { InventoryServiceOptions } from "./inventory.service";
export type {
  InventoryBuildResult,
  Part,
  PartListQuery,
  PartListResult,
  PartRequest,
  PartUsage,
  PartWriteInput,
  Reorder,
  ReorderInput,
  ReorderResult,
  StockAdjustInput,
  StockAdjustResult,
  StockAdjustment,
  StockLevel,
  Vendor,
  VendorWriteInput,
} from "./inventory.interface";
export {
  freezePart,
  freezePartListResult,
  freezePartRequest,
  freezePartUsage,
  freezeReorder,
  freezeReorderResult,
  freezeStockAdjustResult,
  freezeStockAdjustment,
  freezeStockLevel,
  freezeVendor,
} from "./inventory.interface";
export {
  applyPartWrite,
  buildPartForSoftDelete,
  parsePartCreate,
  parsePartListQuery,
  parsePartReorder,
  parsePartUpdate,
  parseStockAdjust,
  parseStockLevelQuery,
  parseVendorWrite,
} from "./inventory-builder";
export {
  canPublishInventoryEvent,
  canReadInventory,
  canStartInventoryLifecycle,
  canWriteInventory,
  inventoryReadError,
  inventoryTenantError,
  inventoryWriteError,
} from "./inventory-rules";
export { incomingEventFromVendorOrder, inventoryAuditLogId } from "./inventory-events";
export type { InventoryAuditAction } from "./inventory-events";
export { parseCreatePartDto } from "./dto/create-part.dto";
export { parseUpdatePartDto } from "./dto/update-part.dto";
export { parseAdjustStockDto } from "./dto/adjust-stock.dto";
export { parseReorderPartDto } from "./dto/reorder-part.dto";
export { parseVendorDto } from "./dto/vendor.dto";
export {
  INVENTORY_API_BASE,
  INVENTORY_API_HEADERS,
  INVENTORY_API_ROUTES,
} from "./api/inventory.api.contract";
export type {
  InventoryApiMethod,
  InventoryApiOperation,
  InventoryApiRoute,
} from "./api/inventory.api.contract";
export { isInventoryApiAllowed } from "./api/inventory.api.permissions";
export { InventoryStockEngine } from "./engines/inventory-stock.engine";
export { InventoryLevelsEngine } from "./engines/inventory-levels.engine";
export { InventoryReorderEngine } from "./engines/inventory-reorder.engine";
export { InventoryUsageEngine } from "./engines/inventory-usage.engine";
export { InventoryPredictiveEngine } from "./engines/inventory-predictive.engine";
export { InventoryVendorEngine } from "./engines/inventory-vendor.engine";
export { InventoryAimiAdapter } from "./adapters/inventory-aimi.adapter";
export { InventoryVendorAdapter } from "./adapters/inventory-vendor.adapter";
export {
  applyDelta,
  asDeletedAt,
  asFieldString,
  asFiniteNumber,
  isAtOrBelow,
  normalizeTenantId,
} from "./utils/inventory-normalizer";
export { mapPartRequestRow, mapPartRow, mapPartUsageRow } from "./utils/inventory-mapper";
export {
  filterPartsByLocation,
  filterRequestsByPart,
  filterRequestsByWorkorder,
} from "./utils/inventory-filters";
