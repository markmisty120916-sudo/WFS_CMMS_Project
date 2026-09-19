import type { Database } from "@/database/database.interface";
import type { ContextDto } from "@/dto/context.dto";
import { createError } from "@/errors/error-factory";
import type { ErrorType } from "@/errors/error-types";
import type { Logger } from "@/logger/logger.interface";
import { err } from "@/results/err";
import { ok } from "@/results/ok";
import type { Result } from "@/results/result.interface";
import type { ResultContext } from "@/results/result-context";
import { isDriverPortalApiAllowed } from "./api/driver-portal.api.permissions";
import type { DriverPortalApiOperation } from "./api/driver-portal.api.contract";
import { driverPortalAccessError, driverPortalMutateError } from "./driver-portal-rules";
import type {
  DriverAssignedVehicle,
  DriverComplianceItem,
  DriverDefectItem,
  DriverDvirItem,
  DriverInspectionItem,
  DriverPmItem,
  DriverPortalFilter,
  DriverPortalWriteInput,
  DriverPortalWriteResult,
  DriverSafetyAlertItem,
  DriverTelematicsItem,
  DriverWorkorderItem,
} from "./driver-portal.interface";
import { listTenantRows } from "./driver-portal.repository";
import { buildAssignedVehicle } from "./engines/driver-assigned-vehicle.engine";
import { buildDriverCompliance } from "./engines/driver-compliance.engine";
import { buildDriverDefects } from "./engines/driver-defects.engine";
import { buildDriverDvir } from "./engines/driver-dvir.engine";
import { buildDriverInspections } from "./engines/driver-inspections.engine";
import { buildDriverPm } from "./engines/driver-pm.engine";
import { buildDriverSafetyAlerts } from "./engines/driver-safety-alerts.engine";
import { buildDriverTelematics } from "./engines/driver-telematics.engine";
import { buildDriverWorkorders } from "./engines/driver-workorders.engine";
import {
  acknowledgeDriverAlert,
  submitDriverDefect,
  submitDriverNote,
  submitDriverPhoto,
} from "./engines/driver-write.engine";

export type DriverPortalServiceOptions = {
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

export class DriverPortalService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;

  constructor(options: DriverPortalServiceOptions) {
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

  private guard(dto: ContextDto, operation: DriverPortalApiOperation): Result<never> | null {
    if (dto.tenant_id !== this.tenant_id) {
      return this.fail("tenant_id mismatch", dto);
    }
    const access = driverPortalAccessError(dto.role);
    if (access !== "none") {
      return this.fail(access, dto);
    }
    if (isDriverPortalApiAllowed(operation, dto.role) === false) {
      return this.fail("role unauthorized", dto);
    }
    if (
      operation === "dvir_submit" ||
      operation === "defect_submit" ||
      operation === "note_added" ||
      operation === "photo_added" ||
      operation === "alert_acknowledged"
    ) {
      const mutate = driverPortalMutateError(dto.role);
      if (mutate !== "none") {
        return this.fail(mutate, dto);
      }
    }
    return null;
  }

  private loadAssets() {
    return listTenantRows(
      this.database,
      "SELECT asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, created_at, updated_at, deleted_at FROM Assets WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private loadHealth() {
    return listTenantRows(
      this.database,
      "SELECT health_id, tenant_id, asset_id, health_score, predictive_score, last_update, created_at, updated_at, deleted_at FROM AssetHealth WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private loadWorkorders() {
    return listTenantRows(
      this.database,
      "SELECT workorder_id, tenant_id, asset_id, source, description, severity, routing_tech_id, routing_bay_id, scheduled_start, scheduled_end, status, created_by, created_at, updated_at, deleted_at FROM Workorders WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private loadSchedules() {
    return listTenantRows(
      this.database,
      "SELECT pm_schedule_id, tenant_id, asset_id, pm_template_id, due_miles, due_hours, status, created_at, updated_at, deleted_at FROM PMSchedule WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private loadInspections() {
    return listTenantRows(
      this.database,
      "SELECT inspection_id, tenant_id, asset_id, type, status, created_at, updated_at, deleted_at FROM ComplianceInspections WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private loadViolations() {
    return listTenantRows(
      this.database,
      "SELECT violation_id, tenant_id, asset_id, description, severity, status, created_at, updated_at, deleted_at FROM ComplianceViolations WHERE tenant_id = $1 AND deleted_at IS NULL",
      this.tenant_id,
    );
  }

  private loadTelematics() {
    return listTenantRows(
      this.database,
      "SELECT telematics_id, tenant_id, asset_id, fault_code, fault_description, severity, timestamp, created_at, updated_at, deleted_at FROM AssetTelematics WHERE tenant_id = $1 AND deleted_at IS NULL",
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

  async assignedVehicle(dto: ContextDto, filter: DriverPortalFilter): Promise<Result<DriverAssignedVehicle>> {
    const blocked = this.guard(dto, "assigned_vehicle");
    if (blocked !== null) {
      return blocked;
    }
    const vehicle = buildAssignedVehicle(dto.tenant_id, dto.user_id, await this.loadAssets(), await this.loadHealth(), await this.loadWorkorders(), filter);
    this.logger.info("driver assigned vehicle");
    return ok(vehicle, resultContextFromDto(dto));
  }

  async dvir(dto: ContextDto, filter: DriverPortalFilter): Promise<Result<readonly DriverDvirItem[]>> {
    const blocked = this.guard(dto, "dvir");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildDriverDvir(dto.tenant_id, await this.loadWorkorders(), filter), resultContextFromDto(dto));
  }

  async defects(dto: ContextDto, filter: DriverPortalFilter): Promise<Result<readonly DriverDefectItem[]>> {
    const blocked = this.guard(dto, "defect");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildDriverDefects(dto.tenant_id, await this.loadViolations(), filter), resultContextFromDto(dto));
  }

  async inspections(dto: ContextDto, filter: DriverPortalFilter): Promise<Result<readonly DriverInspectionItem[]>> {
    const blocked = this.guard(dto, "inspections");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildDriverInspections(dto.tenant_id, await this.loadInspections(), filter), resultContextFromDto(dto));
  }

  async workorders(dto: ContextDto, filter: DriverPortalFilter): Promise<Result<readonly DriverWorkorderItem[]>> {
    const blocked = this.guard(dto, "workorders");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildDriverWorkorders(dto.tenant_id, await this.loadWorkorders(), filter), resultContextFromDto(dto));
  }

  async aimiSafety(dto: ContextDto, filter: DriverPortalFilter): Promise<Result<readonly DriverSafetyAlertItem[]>> {
    const blocked = this.guard(dto, "aimi_safety");
    if (blocked !== null) {
      return blocked;
    }
    const alerts = buildDriverSafetyAlerts(
      dto.tenant_id,
      await this.loadAssets(),
      await this.loadInspections(),
      await this.loadTelematics(),
      await this.loadEvents(),
      filter,
    );
    return ok(alerts, resultContextFromDto(dto));
  }

  async pm(dto: ContextDto, filter: DriverPortalFilter): Promise<Result<readonly DriverPmItem[]>> {
    const blocked = this.guard(dto, "pm");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildDriverPm(dto.tenant_id, await this.loadSchedules(), filter), resultContextFromDto(dto));
  }

  async compliance(dto: ContextDto, filter: DriverPortalFilter): Promise<Result<readonly DriverComplianceItem[]>> {
    const blocked = this.guard(dto, "compliance");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildDriverCompliance(dto.tenant_id, await this.loadInspections(), await this.loadViolations(), filter), resultContextFromDto(dto));
  }

  async telematics(dto: ContextDto, filter: DriverPortalFilter): Promise<Result<readonly DriverTelematicsItem[]>> {
    const blocked = this.guard(dto, "telematics");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildDriverTelematics(dto.tenant_id, await this.loadTelematics(), filter), resultContextFromDto(dto));
  }

  async submitDvir(dto: ContextDto, input: DriverPortalWriteInput): Promise<Result<DriverPortalWriteResult>> {
    const blocked = this.guard(dto, "dvir_submit");
    if (blocked !== null) {
      return blocked;
    }
    if (input.asset_id === "") {
      return this.fail("entity_id required", dto);
    }
    const written = await submitDriverDefect(this.database, dto, input, "dvir");
    return ok(written, resultContextFromDto(dto));
  }

  async submitDefect(dto: ContextDto, input: DriverPortalWriteInput): Promise<Result<DriverPortalWriteResult>> {
    const blocked = this.guard(dto, "defect_submit");
    if (blocked !== null) {
      return blocked;
    }
    if (input.asset_id === "") {
      return this.fail("entity_id required", dto);
    }
    const written = await submitDriverDefect(this.database, dto, input, "driver");
    return ok(written, resultContextFromDto(dto));
  }

  async addNote(dto: ContextDto, input: DriverPortalWriteInput): Promise<Result<DriverPortalWriteResult>> {
    const blocked = this.guard(dto, "note_added");
    if (blocked !== null) {
      return blocked;
    }
    if (input.workorder_id === "") {
      return this.fail("entity_id required", dto);
    }
    const written = await submitDriverNote(this.database, dto, input);
    return ok(written, resultContextFromDto(dto));
  }

  async addPhoto(dto: ContextDto, input: DriverPortalWriteInput): Promise<Result<DriverPortalWriteResult>> {
    const blocked = this.guard(dto, "photo_added");
    if (blocked !== null) {
      return blocked;
    }
    if (input.workorder_id === "") {
      return this.fail("entity_id required", dto);
    }
    const written = await submitDriverPhoto(this.database, dto, input);
    return ok(written, resultContextFromDto(dto));
  }

  async acknowledgeAlert(dto: ContextDto, input: DriverPortalWriteInput): Promise<Result<DriverPortalWriteResult>> {
    const blocked = this.guard(dto, "alert_acknowledged");
    if (blocked !== null) {
      return blocked;
    }
    if (input.alert_id === "") {
      return this.fail("entity_id required", dto);
    }
    const written = await acknowledgeDriverAlert(this.database, dto, input);
    return ok(written, resultContextFromDto(dto));
  }
}
