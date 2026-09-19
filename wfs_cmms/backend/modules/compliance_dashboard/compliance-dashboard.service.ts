import type { Database } from "@/database/database.interface";
import type { ContextDto } from "@/dto/context.dto";
import { createError } from "@/errors/error-factory";
import type { ErrorType } from "@/errors/error-types";
import type { Logger } from "@/logger/logger.interface";
import { err } from "@/results/err";
import { ok } from "@/results/ok";
import type { Result } from "@/results/result.interface";
import type { ResultContext } from "@/results/result-context";
import { isComplianceDashboardApiAllowed } from "./api/compliance-dashboard.api.permissions";
import type { ComplianceDashboardApiOperation } from "./api/compliance-dashboard.api.contract";
import { buildComplianceAimiInsights } from "./engines/compliance-aimi-insights.engine";
import { buildDistrictCompliance } from "./engines/compliance-district.engine";
import { buildDotCompliance } from "./engines/compliance-dot.engine";
import { buildComplianceDvir } from "./engines/compliance-dvir.engine";
import { buildComplianceFindings } from "./engines/compliance-findings.engine";
import { buildComplianceInspections } from "./engines/compliance-inspections.engine";
import { buildMultilingualCompliance } from "./engines/compliance-multilingual.engine";
import { buildComplianceOverview } from "./engines/compliance-overview.engine";
import { buildSafetyWorkorders } from "./engines/compliance-safety-workorders.engine";
import { buildVoiceCompliance } from "./engines/compliance-voice.engine";
import { complianceDashboardAccessError } from "./compliance-dashboard-rules";
import type {
  ComplianceAimiInsightItem,
  ComplianceDashboardFilter,
  ComplianceDistrictItem,
  ComplianceDotItem,
  ComplianceDvirItem,
  ComplianceFindingItem,
  ComplianceInspectionItem,
  ComplianceMultilingualItem,
  ComplianceOverview,
  ComplianceSafetyWorkorderItem,
  ComplianceVoiceItem,
} from "./compliance-dashboard.interface";
import { listTenantRows } from "./compliance-dashboard.repository";

export type ComplianceDashboardServiceOptions = {
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

export class ComplianceDashboardService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;

  constructor(options: ComplianceDashboardServiceOptions) {
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

  private guard(dto: ContextDto, operation: ComplianceDashboardApiOperation): Result<never> | null {
    if (dto.tenant_id !== this.tenant_id) {
      return this.fail("tenant_id mismatch", dto);
    }
    const access = complianceDashboardAccessError(dto.role);
    if (access !== "none") {
      return this.fail(access, dto);
    }
    if (isComplianceDashboardApiAllowed(operation, dto.role) === false) {
      return this.fail("role unauthorized", dto);
    }
    return null;
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

  private loadWorkorders() {
    return listTenantRows(
      this.database,
      "SELECT workorder_id, tenant_id, asset_id, source, description, severity, routing_tech_id, status, created_by, created_at, updated_at, deleted_at FROM Workorders WHERE tenant_id = $1 AND deleted_at IS NULL",
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

  async overview(dto: ContextDto, filter: ComplianceDashboardFilter): Promise<Result<ComplianceOverview>> {
    const blocked = this.guard(dto, "overview");
    if (blocked !== null) {
      return blocked;
    }
    const overview = buildComplianceOverview(dto.tenant_id, await this.loadInspections(), filter);
    this.logger.info("compliance overview");
    return ok(overview, resultContextFromDto(dto));
  }

  async inspections(dto: ContextDto, filter: ComplianceDashboardFilter): Promise<Result<readonly ComplianceInspectionItem[]>> {
    const blocked = this.guard(dto, "inspections");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildComplianceInspections(dto.tenant_id, await this.loadInspections(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async dvir(dto: ContextDto, filter: ComplianceDashboardFilter): Promise<Result<readonly ComplianceDvirItem[]>> {
    const blocked = this.guard(dto, "dvir");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildComplianceDvir(dto.tenant_id, await this.loadViolations(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async safetyWorkorders(dto: ContextDto, filter: ComplianceDashboardFilter): Promise<Result<readonly ComplianceSafetyWorkorderItem[]>> {
    const blocked = this.guard(dto, "safety_workorders");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildSafetyWorkorders(dto.tenant_id, await this.loadWorkorders(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async findings(dto: ContextDto, filter: ComplianceDashboardFilter): Promise<Result<readonly ComplianceFindingItem[]>> {
    const blocked = this.guard(dto, "findings");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildComplianceFindings(dto.tenant_id, await this.loadInspections(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async dot(dto: ContextDto, filter: ComplianceDashboardFilter): Promise<Result<readonly ComplianceDotItem[]>> {
    const blocked = this.guard(dto, "dot");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildDotCompliance(dto.tenant_id, await this.loadInspections(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async district(dto: ContextDto, filter: ComplianceDashboardFilter): Promise<Result<readonly ComplianceDistrictItem[]>> {
    const blocked = this.guard(dto, "district");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildDistrictCompliance(dto.tenant_id, await this.loadInspections(), filter);
    return ok(items, resultContextFromDto(dto));
  }

  async multilingual(dto: ContextDto): Promise<Result<readonly ComplianceMultilingualItem[]>> {
    const blocked = this.guard(dto, "multilingual");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildMultilingualCompliance(dto.tenant_id, await this.loadEvents());
    return ok(items, resultContextFromDto(dto));
  }

  async voice(dto: ContextDto): Promise<Result<readonly ComplianceVoiceItem[]>> {
    const blocked = this.guard(dto, "voice");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildVoiceCompliance(dto.tenant_id, await this.loadEvents());
    return ok(items, resultContextFromDto(dto));
  }

  async aimiInsights(dto: ContextDto): Promise<Result<readonly ComplianceAimiInsightItem[]>> {
    const blocked = this.guard(dto, "aimi_insights");
    if (blocked !== null) {
      return blocked;
    }
    const items = buildComplianceAimiInsights(dto.tenant_id, await this.loadEvents());
    return ok(items, resultContextFromDto(dto));
  }
}
