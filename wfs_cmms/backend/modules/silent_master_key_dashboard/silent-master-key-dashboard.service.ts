import type { Database } from "@/database/database.interface";
import type { ContextDto } from "@/dto/context.dto";
import { createError } from "@/errors/error-factory";
import type { ErrorType } from "@/errors/error-types";
import type { Logger } from "@/logger/logger.interface";
import { err } from "@/results/err";
import { ok } from "@/results/ok";
import type { Result } from "@/results/result.interface";
import type { ResultContext } from "@/results/result-context";
import { isSilentMasterKeyAimiType, isSilentMasterKeyDiagnosticType, isSilentMasterKeyPredictiveType } from "./adapters/aimi.adapter";
import { isSilentMasterKeyApiAllowed } from "./api/silent-master-key-dashboard.api.permissions";
import type { SilentMasterKeyApiOperation } from "./api/silent-master-key-dashboard.api.contract";
import { silentMasterKeyAccessError, silentMasterKeyMutateError, severityOverrideReducesSafety } from "./silent-master-key-dashboard-rules";
import type {
  SilentMasterKeyDashboardItem,
  SilentMasterKeyEventItem,
  SilentMasterKeyFilter,
  SilentMasterKeyOverrideInput,
  SilentMasterKeyOverrideResult,
  SilentMasterKeyWorkorderItem,
} from "./silent-master-key-dashboard.interface";
import { asField, listTenantRows } from "./silent-master-key-dashboard.repository";
import { buildDashboardSwitchList } from "./engines/silent-master-key-dashboards.engine";
import { buildSilentMasterKeyEvents } from "./engines/silent-master-key-events.engine";
import {
  applyRoutingOverride,
  applySchedulingOverride,
  applySeverityOverride,
  loadOverrideWorkorder,
} from "./engines/silent-master-key-overrides.engine";
import { buildSilentMasterKeyWorkorders } from "./engines/silent-master-key-workorders.engine";

export type SilentMasterKeyDashboardServiceOptions = {
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

export class SilentMasterKeyDashboardService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;

  constructor(options: SilentMasterKeyDashboardServiceOptions) {
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

  private guard(dto: ContextDto, operation: SilentMasterKeyApiOperation): Result<never> | null {
    if (dto.tenant_id !== this.tenant_id) {
      return this.fail("tenant_id mismatch", dto);
    }
    const access = silentMasterKeyAccessError(dto.role);
    if (access !== "none") {
      return this.fail(access, dto);
    }
    if (isSilentMasterKeyApiAllowed(operation, dto.role) === false) {
      return this.fail("role unauthorized", dto);
    }
    if (operation === "severity_override" || operation === "routing_override" || operation === "scheduling_override") {
      const mutate = silentMasterKeyMutateError(dto.role);
      if (mutate !== "none") {
        return this.fail(mutate, dto);
      }
    }
    return null;
  }

  private loadWorkorders() {
    return listTenantRows(
      this.database,
      "SELECT workorder_id, tenant_id, asset_id, source, description, severity, routing_tech_id, routing_bay_id, scheduled_start, scheduled_end, status, created_by, created_at, updated_at, deleted_at FROM Workorders WHERE tenant_id = $1 AND deleted_at IS NULL",
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

  async dashboards(dto: ContextDto): Promise<Result<readonly SilentMasterKeyDashboardItem[]>> {
    const blocked = this.guard(dto, "dashboards");
    if (blocked !== null) {
      return blocked;
    }
    this.logger.info("silent master key dashboards");
    return ok(buildDashboardSwitchList(dto.tenant_id), resultContextFromDto(dto));
  }

  async aimi(dto: ContextDto, filter: SilentMasterKeyFilter): Promise<Result<readonly SilentMasterKeyEventItem[]>> {
    const blocked = this.guard(dto, "aimi");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildSilentMasterKeyEvents(dto.tenant_id, await this.loadEvents(), filter, isSilentMasterKeyAimiType), resultContextFromDto(dto));
  }

  async predictive(dto: ContextDto, filter: SilentMasterKeyFilter): Promise<Result<readonly SilentMasterKeyEventItem[]>> {
    const blocked = this.guard(dto, "predictive");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildSilentMasterKeyEvents(dto.tenant_id, await this.loadEvents(), filter, isSilentMasterKeyPredictiveType), resultContextFromDto(dto));
  }

  async diagnostics(dto: ContextDto, filter: SilentMasterKeyFilter): Promise<Result<readonly SilentMasterKeyEventItem[]>> {
    const blocked = this.guard(dto, "diagnostics");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildSilentMasterKeyEvents(dto.tenant_id, await this.loadEvents(), filter, isSilentMasterKeyDiagnosticType), resultContextFromDto(dto));
  }

  async workorders(dto: ContextDto, filter: SilentMasterKeyFilter): Promise<Result<readonly SilentMasterKeyWorkorderItem[]>> {
    const blocked = this.guard(dto, "workorders");
    if (blocked !== null) {
      return blocked;
    }
    return ok(buildSilentMasterKeyWorkorders(dto.tenant_id, await this.loadWorkorders(), filter), resultContextFromDto(dto));
  }

  async overrideSeverity(dto: ContextDto, input: SilentMasterKeyOverrideInput): Promise<Result<SilentMasterKeyOverrideResult>> {
    const blocked = this.guard(dto, "severity_override");
    if (blocked !== null) {
      return blocked;
    }
    if (input.workorder_id === "") {
      return this.fail("entity_id required", dto);
    }
    if (input.reason === "") {
      return this.fail("dto invalid", dto);
    }
    const current = await loadOverrideWorkorder(this.database, dto.tenant_id, input.workorder_id);
    if (current === null) {
      return this.fail("entity_id mismatch", dto);
    }
    if (severityOverrideReducesSafety(asField(current, "severity"), input.severity) === true) {
      return this.fail("lifecycle postcondition failed", dto);
    }
    const written = await applySeverityOverride(this.database, dto, input, current);
    return ok(written, resultContextFromDto(dto));
  }

  async overrideRouting(dto: ContextDto, input: SilentMasterKeyOverrideInput): Promise<Result<SilentMasterKeyOverrideResult>> {
    const blocked = this.guard(dto, "routing_override");
    if (blocked !== null) {
      return blocked;
    }
    if (input.workorder_id === "") {
      return this.fail("entity_id required", dto);
    }
    if (input.reason === "") {
      return this.fail("dto invalid", dto);
    }
    const current = await loadOverrideWorkorder(this.database, dto.tenant_id, input.workorder_id);
    if (current === null) {
      return this.fail("entity_id mismatch", dto);
    }
    const written = await applyRoutingOverride(this.database, dto, input, current);
    return ok(written, resultContextFromDto(dto));
  }

  async overrideScheduling(dto: ContextDto, input: SilentMasterKeyOverrideInput): Promise<Result<SilentMasterKeyOverrideResult>> {
    const blocked = this.guard(dto, "scheduling_override");
    if (blocked !== null) {
      return blocked;
    }
    if (input.workorder_id === "") {
      return this.fail("entity_id required", dto);
    }
    if (input.reason === "") {
      return this.fail("dto invalid", dto);
    }
    const current = await loadOverrideWorkorder(this.database, dto.tenant_id, input.workorder_id);
    if (current === null) {
      return this.fail("entity_id mismatch", dto);
    }
    const written = await applySchedulingOverride(this.database, dto, input, current);
    return ok(written, resultContextFromDto(dto));
  }
}
