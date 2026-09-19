export { PartsManagerDashboardService } from "./parts-manager-dashboard.service";
export type { PartsManagerDashboardServiceOptions } from "./parts-manager-dashboard.service";
export { createPartsManagerDashboardModule } from "./parts-manager-dashboard.module";
export { createPartsManagerDashboardRouter } from "./parts-manager-dashboard.routes";
export { mountPartsManagerDashboardExpress } from "./parts-manager-dashboard.express";
export { PARTS_MANAGER_API_BASE, PARTS_MANAGER_API_HEADERS, PARTS_MANAGER_API_ROUTES } from "./api/parts-manager-dashboard.api.contract";
export { isPartsManagerApiAllowed } from "./api/parts-manager-dashboard.api.permissions";
export {
  canAccessPartsManagerDashboard,
  canMutatePartsManagerDashboard,
  canUsePartsManagerLimitedActions,
} from "./parts-manager-dashboard-rules";
export { PARTS_MANAGER_EVENT_TYPES } from "./parts-manager-dashboard-events";
