import type { Database } from "../../../../src/core/database/database.interface";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { createError } from "../../../../src/core/errors/error-factory";
import type { ErrorType } from "../../../../src/core/errors/error-types";
import type { Logger } from "../../../../src/core/logger/logger.interface";
import { err } from "../../../../src/core/results/err";
import { ok } from "../../../../src/core/results/ok";
import type { Result } from "../../../../src/core/results/result.interface";
import type { ResultContext } from "../../../../src/core/results/result-context";
import { isPartsManagerApiAllowed } from "./api/parts-manager-dashboard.api.permissions";
import type { PartsManagerApiOperation } from "./api/parts-manager-dashboard.api.contract";
import { buildAlerts } from "./engines/parts-alerts.engine";
import { buildAwaitingParts } from "./engines/parts-awaiting.engine";
import { buildInventoryOverview } from "./engines/parts-inventory-overview.engine";
import { buildPredictiveUsage } from "./engines/parts-predictive-usage.engine";
import { buildUsageHistory } from "./engines/parts-usage-history.engine";
import { buildVendors } from "./engines/parts-vendors.engine";
import { partsManagerAccessError } from "./parts-manager-dashboard-rules";
import type {
  PartsAlertItem,
  PartsAwaitingItem,
  PartsInventoryOverview,
  PartsManagerFilter,
  PartsPredictiveItem,
  PartsUsageItem,
  PartsVendorItem,
} from "./parts-manager-dashboard.interface";
import { listTenantRows } from "./parts-manager-dashboard.repository";

export type PartsManagerDashboardServiceOptions = {
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

export class PartsManagerDashboardService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;

  constructor(options: PartsManagerDashboardServiceOptions) {
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

  private guard(dto: ContextDto, operation: PartsManagerApiOperation): Result<never> | null {
    if (dto.tenant_id !== this.tenant_id) {
      return this.fail("tenant_id mismatch", dto);
    }
    const access = partsManagerAccessError(dto.role);
    if (access !== "none") {
      return this.fail(access, dto);
    }
    if (isPartsManagerApiAllowed(operation, dto.role) === false) {
      return this.fail("role unauthorized", dto);
    }
    return null;
  }

  private loadParts() {
    return listTenantRows(
      this.database,
      "SELECT part_id, tenant_id, name, description, quantity, location, created_at, updated_at, deleted_at FROM Parts WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private loadRequests() {
    return listTenantRows(
      this.database,
      "SELECT request_id, tenant_id, workorder_id, part_id, quantity, status, created_at, updated_at, deleted_at FROM PartRequests WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private loadWorkorders() {
    return listTenantRows(
      this.database,
      "SELECT workorder_id, tenant_id, asset_id, description, severity, status, created_at, updated_at, deleted_at FROM Workorders WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private loadVendors() {
    return listTenantRows(
      this.database,
      "SELECT vendor_id, tenant_id, vendor_name, location, created_at, updated_at, deleted_at FROM Vendors WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private loadUsage() {
    return listTenantRows(
      this.database,
      "SELECT part_usage_id, tenant_id, workorder_id, part_id, quantity, created_at, updated_at, deleted_at FROM WorkorderParts WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private loadSchedules() {
    return listTenantRows(
      this.database,
      "SELECT pm_schedule_id, tenant_id, asset_id, pm_template_id, status, created_at, updated_at, deleted_at FROM PMSchedule WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private loadEvents() {
    return listTenantRows(
      this.database,
      "SELECT event_id, tenant_id, event_type, payload, timestamp, created_at, updated_at, deleted_at FROM IntegrationEvents WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  async inventoryOverview(dto: ContextDto, filter: PartsManagerFilter): Promise<Result<PartsInventoryOverview>> {
    const blocked = this.guard(dto, "inventory_overview");
    if (blocked !== null) {
      return blocked;
    }
    const overview = buildInventoryOverview(dto.tenant_id, await this.loadParts(), filter);
    this.logger.info("parts inventory overview");
    return ok(overview, resultContextFromDto(dto));
  }

  async awaitingParts(dto: ContextDto, filter: PartsManagerFilter): Promise<Result<readonly PartsAwaitingItem[]>> {
    const blocked = this.guard(dto, "awaiting_parts");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildAwaitingParts(dto.tenant_id, await this.loadRequests(), await this.loadWorkorders(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async vendors(dto: ContextDto, filter: PartsManagerFilter): Promise<Result<readonly PartsVendorItem[]>> {
    const blocked = this.guard(dto, "list_vendors");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildVendors(dto.tenant_id, await this.loadVendors(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async usageHistory(dto: ContextDto, filter: PartsManagerFilter): Promise<Result<readonly PartsUsageItem[]>> {
    const blocked = this.guard(dto, "usage_history");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildUsageHistory(dto.tenant_id, await this.loadUsage(), await this.loadSchedules(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async predictiveUsage(dto: ContextDto): Promise<Result<readonly PartsPredictiveItem[]>> {
    const blocked = this.guard(dto, "predictive_usage");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildPredictiveUsage(dto.tenant_id, await this.loadEvents());
    return ok(items, resultContextFromDto(dto));
  }

  async alerts(dto: ContextDto, filter: PartsManagerFilter): Promise<Result<readonly PartsAlertItem[]>> {
    const blocked = this.guard(dto, "inventory_alerts");
    if (blocked !== null) {
      return blocked;
    }
    const overview = buildInventoryOverview(dto.tenant_id, await this.loadParts(), filter);
    const awaiting = buildAwaitingParts(dto.tenant_id, await this.loadRequests(), await this.loadWorkorders(), filter);
    const items = buildAlerts(dto.tenant_id, overview, awaiting, await this.loadEvents());
    return ok(items, resultContextFromDto(dto));
  }
}
