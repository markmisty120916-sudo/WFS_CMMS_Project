import type { Database } from "../../../../src/core/database/database.interface";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { createError } from "../../../../src/core/errors/error-factory";
import type { ErrorType } from "../../../../src/core/errors/error-types";
import type { Logger } from "../../../../src/core/logger/logger.interface";
import { err } from "../../../../src/core/results/err";
import { ok } from "../../../../src/core/results/ok";
import type { Result } from "../../../../src/core/results/result.interface";
import type { ResultContext } from "../../../../src/core/results/result-context";
import { assetHealthSelectSql, assetsSelectSql } from "./adapters/assets.adapter";
import { predictiveModelsSelectSql, severityHistorySelectSql, integrationEventsSelectSql } from "./adapters/aimi.adapter";
import { inspectionsSelectSql, violationsSelectSql } from "./adapters/compliance.adapter";
import { configurationPacksSelectSql, importHistorySelectSql } from "./adapters/configuration-packs.adapter";
import { partsSelectSql, workorderPartsSelectSql } from "./adapters/inventory.adapter";
import { pmScheduleSelectSql, pmTemplateSelectSql } from "./adapters/pm.adapter";
import { telematicsSelectSql } from "./adapters/telematics.adapter";
import { vendorsSelectSql } from "./adapters/vendors.adapter";
import { workordersSelectSql } from "./adapters/workorders.adapter";
import type { GlobalDashboardIntegrationApiOperation } from "./api/global-dashboard-integration.api.contract";
import { isGlobalDashboardIntegrationApiAllowed } from "./api/global-dashboard-integration.api.permissions";
import {
  buildAimi,
  buildAssets,
  buildCompliance,
  buildDefects,
  buildDvir,
  buildImportHistory,
  buildInventory,
  buildPackEffects,
  buildPm,
  buildTelematics,
  buildVendors,
  buildWorkorders,
} from "./engines/global-dashboard-integration.engine";
import {
  bypassesTenantIsolation,
  canAccessIntegrationAimiInsights,
  globalDashboardIntegrationAccessError,
} from "./global-dashboard-integration-rules";
import type {
  GlobalDashboardIntegrationFilter,
  IntegrationAimiItem,
  IntegrationAssetItem,
  IntegrationComplianceItem,
  IntegrationDefectItem,
  IntegrationDvirItem,
  IntegrationInventoryItem,
  IntegrationPmItem,
  IntegrationTelematicsResult,
  IntegrationVendorItem,
  IntegrationWorkorderItem,
} from "./global-dashboard-integration.interface";
import { listAllRows, listTenantRows } from "./global-dashboard-integration.repository";

export type GlobalDashboardIntegrationServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
};

function resultContextFromDto(dto: ContextDto): ResultContext {
  return {
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    timestamp: dto.timestamp,
    correlation_id: dto.correlation_id,
    rule_id: dto.rule_id,
    lifecycle_kind: dto.lifecycle_kind,
    from_state: dto.from_state,
    to_state: dto.to_state,
    entity_id: dto.entity_id,
  };
}

export class GlobalDashboardIntegrationService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;

  constructor(options: GlobalDashboardIntegrationServiceOptions) {
    this.tenant_id = options.tenant_id;
    this.logger = options.logger;
    this.database = options.database;
  }

  private fail(error_type: ErrorType, dto: ContextDto): Result<never> {
    const context = resultContextFromDto(dto);
    const error = createError(error_type, {
      tenant_id: this.tenant_id,
      user_id: context.user_id,
      role: context.role,
      timestamp: context.timestamp,
      correlation_id: context.correlation_id,
    });
    return err(error, context);
  }

  private guard(dto: ContextDto, operation: GlobalDashboardIntegrationApiOperation): Result<never> | null {
    if (dto.tenant_id === "") {
      return this.fail("tenant_id mismatch", dto);
    }
    if (bypassesTenantIsolation(dto.role) === false && dto.tenant_id !== this.tenant_id) {
      return this.fail("tenant_id mismatch", dto);
    }
    const access = globalDashboardIntegrationAccessError(dto.role);
    if (access !== "none") {
      return this.fail(access, dto);
    }
    if (isGlobalDashboardIntegrationApiAllowed(operation, dto.role) === false) {
      return this.fail("role unauthorized", dto);
    }
    return null;
  }

  private bypass(dto: ContextDto): boolean {
    return bypassesTenantIsolation(dto.role);
  }

  private load(sqlFactory: (bypass: boolean) => string, dto: ContextDto) {
    const bypass = this.bypass(dto);
    if (bypass === true) {
      return listAllRows(this.database, sqlFactory(true));
    }
    return listTenantRows(this.database, sqlFactory(false), dto.tenant_id);
  }

  async assets(dto: ContextDto, filter: GlobalDashboardIntegrationFilter): Promise<Result<readonly IntegrationAssetItem[]>> {
    const blocked = this.guard(dto, "assets");
    if (blocked !== null) {
      return blocked;
    }
    this.logger.info("global dashboard integration assets");
    const packs = buildPackEffects(dto.tenant_id, this.bypass(dto), await this.load(configurationPacksSelectSql, dto));
    const imports = buildImportHistory(dto.tenant_id, this.bypass(dto), await this.load(importHistorySelectSql, dto), "");
    return ok(
      buildAssets(
        dto.tenant_id,
        this.bypass(dto),
        await this.load(assetsSelectSql, dto),
        await this.load(assetHealthSelectSql, dto),
        packs,
        imports,
        filter,
      ),
      resultContextFromDto(dto),
    );
  }

  async workorders(dto: ContextDto, filter: GlobalDashboardIntegrationFilter): Promise<Result<readonly IntegrationWorkorderItem[]>> {
    const blocked = this.guard(dto, "workorders");
    if (blocked !== null) {
      return blocked;
    }
    const packs = buildPackEffects(dto.tenant_id, this.bypass(dto), await this.load(configurationPacksSelectSql, dto));
    return ok(
      buildWorkorders(dto.tenant_id, this.bypass(dto), dto.role, dto.user_id, await this.load(workordersSelectSql, dto), packs, filter),
      resultContextFromDto(dto),
    );
  }

  async pm(dto: ContextDto, filter: GlobalDashboardIntegrationFilter): Promise<Result<readonly IntegrationPmItem[]>> {
    const blocked = this.guard(dto, "pm");
    if (blocked !== null) {
      return blocked;
    }
    const packs = buildPackEffects(dto.tenant_id, this.bypass(dto), await this.load(configurationPacksSelectSql, dto));
    return ok(
      buildPm(
        dto.tenant_id,
        this.bypass(dto),
        await this.load(pmScheduleSelectSql, dto),
        await this.load(pmTemplateSelectSql, dto),
        packs,
        filter,
      ),
      resultContextFromDto(dto),
    );
  }

  async inventory(dto: ContextDto, filter: GlobalDashboardIntegrationFilter): Promise<Result<readonly IntegrationInventoryItem[]>> {
    const blocked = this.guard(dto, "inventory");
    if (blocked !== null) {
      return blocked;
    }
    return ok(
      buildInventory(
        dto.tenant_id,
        this.bypass(dto),
        await this.load(partsSelectSql, dto),
        await this.load(workorderPartsSelectSql, dto),
        await this.load(predictiveModelsSelectSql, dto),
        filter,
      ),
      resultContextFromDto(dto),
    );
  }

  async compliance(dto: ContextDto, filter: GlobalDashboardIntegrationFilter): Promise<Result<readonly IntegrationComplianceItem[]>> {
    const blocked = this.guard(dto, "compliance");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildCompliance(dto.tenant_id, this.bypass(dto), await this.load(inspectionsSelectSql, dto), filter), resultContextFromDto(dto));
  }

  async dvir(dto: ContextDto, filter: GlobalDashboardIntegrationFilter): Promise<Result<readonly IntegrationDvirItem[]>> {
    const blocked = this.guard(dto, "dvir");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildDvir(dto.tenant_id, this.bypass(dto), await this.load(violationsSelectSql, dto), filter), resultContextFromDto(dto));
  }

  async defects(dto: ContextDto, filter: GlobalDashboardIntegrationFilter): Promise<Result<readonly IntegrationDefectItem[]>> {
    const blocked = this.guard(dto, "defects");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildDefects(dto.tenant_id, this.bypass(dto), await this.load(violationsSelectSql, dto), filter), resultContextFromDto(dto));
  }

  async vendors(dto: ContextDto, filter: GlobalDashboardIntegrationFilter): Promise<Result<readonly IntegrationVendorItem[]>> {
    const blocked = this.guard(dto, "vendors");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildVendors(dto.tenant_id, this.bypass(dto), await this.load(vendorsSelectSql, dto), filter), resultContextFromDto(dto));
  }

  async telematics(dto: ContextDto, filter: GlobalDashboardIntegrationFilter): Promise<Result<IntegrationTelematicsResult>> {
    const blocked = this.guard(dto, "telematics");
    if (blocked !== null) {
      return blocked;
    }
    const packs = buildPackEffects(dto.tenant_id, this.bypass(dto), await this.load(configurationPacksSelectSql, dto));
    return ok(
      buildTelematics(dto.tenant_id, this.bypass(dto), await this.load(assetsSelectSql, dto), await this.load(telematicsSelectSql, dto), packs, filter),
      resultContextFromDto(dto),
    );
  }

  async aimi(dto: ContextDto, filter: GlobalDashboardIntegrationFilter): Promise<Result<readonly IntegrationAimiItem[]>> {
    const blocked = this.guard(dto, "aimi");
    if (blocked !== null) {
      return blocked;
    }
    return ok(
      buildAimi(
        dto.tenant_id,
        this.bypass(dto),
        canAccessIntegrationAimiInsights(dto.role),
        await this.load(integrationEventsSelectSql, dto),
        await this.load(predictiveModelsSelectSql, dto),
        await this.load(severityHistorySelectSql, dto),
        await this.load(inspectionsSelectSql, dto),
        await this.load(partsSelectSql, dto),
        filter,
      ),
      resultContextFromDto(dto),
    );
  }
}
