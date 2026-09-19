import type { IncomingMessage, ServerResponse } from "http";
import { AssetManagerService } from "@/modules/asset_manager/asset-manager.service";
import { mountAssetManagerExpress } from "@/modules/asset_manager/asset-manager.express";
import { ComplianceDashboardService } from "@/modules/compliance_dashboard/compliance-dashboard.service";
import { mountComplianceDashboardExpress } from "@/modules/compliance_dashboard/compliance-dashboard.express";
import { DriverPortalService } from "@/modules/driver_portal/driver-portal.service";
import { mountDriverPortalExpress } from "@/modules/driver_portal/driver-portal.express";
import { FleetManagerDashboardService } from "@/modules/fleet_manager_dashboard/fleet-manager-dashboard.service";
import { mountFleetManagerDashboardExpress } from "@/modules/fleet_manager_dashboard/fleet-manager-dashboard.express";
import { GlobalDashboardIntegrationService } from "@/modules/global_dashboard_integration/global-dashboard-integration.service";
import { mountGlobalDashboardIntegrationExpress } from "@/modules/global_dashboard_integration/global-dashboard-integration.express";
import { PartsManagerDashboardService } from "@/modules/parts_manager_dashboard/parts-manager-dashboard.service";
import { mountPartsManagerDashboardExpress } from "@/modules/parts_manager_dashboard/parts-manager-dashboard.express";
import { SilentMasterKeyDashboardService } from "@/modules/silent_master_key_dashboard/silent-master-key-dashboard.service";
import { mountSilentMasterKeyDashboardExpress } from "@/modules/silent_master_key_dashboard/silent-master-key-dashboard.express";
import { requestToContextDto } from "./runtime-context";
import {
  createRuntimeAuditLogHook,
  createRuntimeDatabase,
  createRuntimeEventBus,
  createRuntimeLogger,
  processTenantId,
} from "./runtime-dependencies";

export type RuntimeExpressApp = {
  use(
    path: string,
    handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void,
  ): unknown;
};

export function wireLockedModuleRouters(app: RuntimeExpressApp): void {
  const tenant_id = processTenantId();
  const logger = createRuntimeLogger();
  const database = createRuntimeDatabase();
  const shared = { tenant_id, logger, database };

  mountGlobalDashboardIntegrationExpress(app, new GlobalDashboardIntegrationService(shared), requestToContextDto);
  mountFleetManagerDashboardExpress(app, new FleetManagerDashboardService(shared), requestToContextDto);
  mountDriverPortalExpress(app, new DriverPortalService(shared), requestToContextDto);
  mountPartsManagerDashboardExpress(app, new PartsManagerDashboardService(shared), requestToContextDto);
  mountComplianceDashboardExpress(app, new ComplianceDashboardService(shared), requestToContextDto);
  mountSilentMasterKeyDashboardExpress(app, new SilentMasterKeyDashboardService(shared), requestToContextDto);
  mountAssetManagerExpress(
    app,
    new AssetManagerService({
      tenant_id,
      logger,
      database,
      eventBus: createRuntimeEventBus(tenant_id, logger, database),
      auditLogHook: createRuntimeAuditLogHook(),
    }),
    requestToContextDto,
  );
}
