import type { Database } from "../../../../src/core/database/database.interface";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { createError } from "../../../../src/core/errors/error-factory";
import type { ErrorType } from "../../../../src/core/errors/error-types";
import type { Logger } from "../../../../src/core/logger/logger.interface";
import { err } from "../../../../src/core/results/err";
import { ok } from "../../../../src/core/results/ok";
import type { Result } from "../../../../src/core/results/result.interface";
import type { ResultContext } from "../../../../src/core/results/result-context";
import { isFleetManagerApiAllowed } from "./api/fleet-manager-dashboard.api.permissions";
import type { FleetManagerApiOperation } from "./api/fleet-manager-dashboard.api.contract";
import { buildAimiInsights } from "./engines/fleet-aimi-insights.engine";
import { buildBreakdowns } from "./engines/fleet-breakdowns.engine";
import { buildFindVehicle } from "./engines/fleet-find-vehicle.engine";
import { buildFleetHealth } from "./engines/fleet-health.engine";
import { buildInventoryImpact } from "./engines/fleet-inventory-impact.engine";
import { buildPmStatus } from "./engines/fleet-pm-status.engine";
import { buildTechnicianWorkload } from "./engines/fleet-technician-workload.engine";
import { fleetManagerAccessError } from "./fleet-manager-dashboard-rules";
import type {
  FleetAimiInsightItem,
  FleetBreakdownItem,
  FleetFindVehicleResult,
  FleetHealthOverview,
  FleetInventoryImpactItem,
  FleetManagerFilter,
  FleetPmStatusItem,
  FleetTechnicianWorkloadItem,
} from "./fleet-manager-dashboard.interface";
import { listTenantRows } from "./fleet-manager-dashboard.repository";

export type FleetManagerDashboardServiceOptions = {
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

export class FleetManagerDashboardService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;

  constructor(options: FleetManagerDashboardServiceOptions) {
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

  private guard(dto: ContextDto, operation: FleetManagerApiOperation): Result<never> | null {
    if (dto.tenant_id !== this.tenant_id) {
      return this.fail("tenant_id mismatch", dto);
    }
    const access = fleetManagerAccessError(dto.role);
    if (access !== "none") {
      return this.fail(access, dto);
    }
    if (isFleetManagerApiAllowed(operation, dto.role) === false) {
      return this.fail("role unauthorized", dto);
    }
    return null;
  }

  private async loadAssets(): Promise<readonly Readonly<Record<string, unknown>>[]> {
    return listTenantRows(
      this.database,
      "SELECT asset_id, tenant_id, vin, unit_number, make, model, year, status, created_at, updated_at, deleted_at FROM Assets WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private async loadHealth(): Promise<readonly Readonly<Record<string, unknown>>[]> {
    return listTenantRows(
      this.database,
      "SELECT health_id, tenant_id, asset_id, health_score, predictive_score, last_update, created_at, updated_at, deleted_at FROM AssetHealth WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private async loadWorkorders(): Promise<readonly Readonly<Record<string, unknown>>[]> {
    return listTenantRows(
      this.database,
      "SELECT workorder_id, tenant_id, asset_id, source, description, severity, routing_tech_id, routing_bay_id, scheduled_start, scheduled_end, status, created_at, updated_at, deleted_at FROM Workorders WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private async loadSchedules(): Promise<readonly Readonly<Record<string, unknown>>[]> {
    return listTenantRows(
      this.database,
      "SELECT pm_schedule_id, tenant_id, asset_id, pm_template_id, due_miles, due_hours, status, created_at, updated_at, deleted_at FROM PMSchedule WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private async loadParts(): Promise<readonly Readonly<Record<string, unknown>>[]> {
    return listTenantRows(
      this.database,
      "SELECT part_id, tenant_id, name, description, quantity, location, created_at, updated_at, deleted_at FROM Parts WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private async loadTelematics(): Promise<readonly Readonly<Record<string, unknown>>[]> {
    return listTenantRows(
      this.database,
      "SELECT telematics_id, tenant_id, asset_id, fault_code, fault_description, severity, timestamp, created_at, updated_at, deleted_at FROM AssetTelematics WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private async loadEvents(): Promise<readonly Readonly<Record<string, unknown>>[]> {
    return listTenantRows(
      this.database,
      "SELECT event_id, tenant_id, event_type, payload, timestamp, created_at, updated_at, deleted_at FROM IntegrationEvents WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  async health(dto: ContextDto, filter: FleetManagerFilter): Promise<Result<FleetHealthOverview>> {
    const blocked = this.guard(dto, "fleet_health");
    if (blocked !== null) {
      return blocked;
    }
    const overview = buildFleetHealth(dto.tenant_id, await this.loadAssets(), await this.loadHealth(), await this.loadWorkorders(), await this.loadSchedules(), filter);
    this.logger.info("fleet health");
    return ok(overview, resultContextFromDto(dto));
  }

  async breakdowns(dto: ContextDto, filter: FleetManagerFilter): Promise<Result<readonly FleetBreakdownItem[]>> {
    const blocked = this.guard(dto, "fleet_breakdowns");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildBreakdowns(dto.tenant_id, await this.loadWorkorders(), await this.loadAssets(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async pmStatus(dto: ContextDto, filter: FleetManagerFilter): Promise<Result<readonly FleetPmStatusItem[]>> {
    const blocked = this.guard(dto, "fleet_pm_status");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildPmStatus(dto.tenant_id, await this.loadSchedules(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async inventoryImpact(dto: ContextDto, filter: FleetManagerFilter): Promise<Result<readonly FleetInventoryImpactItem[]>> {
    const blocked = this.guard(dto, "fleet_inventory_impact");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildInventoryImpact(dto.tenant_id, await this.loadParts(), await this.loadWorkorders(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async technicianWorkload(dto: ContextDto, filter: FleetManagerFilter): Promise<Result<readonly FleetTechnicianWorkloadItem[]>> {
    const blocked = this.guard(dto, "fleet_technician_workload");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildTechnicianWorkload(dto.tenant_id, await this.loadWorkorders(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async findVehicle(dto: ContextDto, filter: FleetManagerFilter): Promise<Result<FleetFindVehicleResult>> {
    const blocked = this.guard(dto, "fleet_find_vehicle");
    if (blocked !== null) {
      return blocked;
    }
    const result = buildFindVehicle(dto.tenant_id, await this.loadAssets(), await this.loadTelematics(), filter);
    return ok(result, resultContextFromDto(dto));
  }

  async aimiInsights(dto: ContextDto): Promise<Result<readonly FleetAimiInsightItem[]>> {
    const blocked = this.guard(dto, "fleet_aimi_insights");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildAimiInsights(dto.tenant_id, await this.loadEvents());
    return ok(items, resultContextFromDto(dto));
  }
}
