import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import type { GlobalDashboardIntegrationApiOperation } from "./api/global-dashboard-integration.api.contract";
import { isGlobalDashboardIntegrationApiAllowed } from "./api/global-dashboard-integration.api.permissions";
import {
  cacheGet,
  cacheKey,
  cacheSet,
  circuitAllows,
  circuitFailure,
  circuitSuccess,
  integrationFilterFromQuery,
  integrationHealthStatus,
  isIntegrationMaintenanceMode,
  paginateIntegrationList,
  rateLimitAllows,
  sanitizeIntegrationValue,
  structuredIntegrationLog,
  validateIntegrationQuery,
} from "./global-dashboard-integration.hardening";
import type { IntegrationTelematicsResult } from "./global-dashboard-integration.interface";
import type { GlobalDashboardIntegrationService } from "./global-dashboard-integration.service";

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(sanitizeIntegrationValue(body)));
}

export function createGlobalDashboardIntegrationController(service: GlobalDashboardIntegrationService) {
  return {
    async handle(
      _req: IncomingMessage,
      res: ServerResponse,
      dto: ContextDto,
      operation: string,
      query: Readonly<Record<string, string>>,
    ): Promise<void> {
      if (validateIntegrationQuery(query) === false) {
        send(res, 400, { ok: false, error: "dto invalid" });
        return;
      }
      const typed = operation as GlobalDashboardIntegrationApiOperation;
      if (isGlobalDashboardIntegrationApiAllowed(typed, dto.role) === false) {
        send(res, 400, { ok: false, error: "role unauthorized" });
        return;
      }
      if (rateLimitAllows(dto.tenant_id, typed) === false) {
        send(res, 429, { ok: false, error: "dto invalid" });
        return;
      }
      if (circuitAllows(typed) === false) {
        send(res, 503, { ok: false, error: "dto invalid" });
        return;
      }
      const filter = integrationFilterFromQuery(query);
      const key = cacheKey(dto.tenant_id, typed, filter);
      if (typed !== "health") {
        const cached = cacheGet(key);
        if (cached !== null) {
          send(res, 200, cached);
          return;
        }
      }
      if (typed === "health") {
        const health = {
          ok: true,
          value: integrationHealthStatus(),
        };
        send(res, 200, health);
        return;
      }
      let result: { ok: boolean; value?: unknown } = { ok: false };
      try {
        if (typed === "assets") {
          result = await service.assets(dto, filter);
        }
        if (typed === "workorders") {
          result = await service.workorders(dto, filter);
        }
        if (typed === "pm") {
          result = await service.pm(dto, filter);
        }
        if (typed === "inventory") {
          result = await service.inventory(dto, filter);
        }
        if (typed === "compliance") {
          result = await service.compliance(dto, filter);
        }
        if (typed === "dvir") {
          result = await service.dvir(dto, filter);
        }
        if (typed === "defects") {
          result = await service.defects(dto, filter);
        }
        if (typed === "vendors") {
          result = await service.vendors(dto, filter);
        }
        if (typed === "telematics") {
          result = await service.telematics(dto, filter);
        }
        if (typed === "aimi") {
          result = await service.aimi(dto, filter);
        }
      } catch {
        if (typed === "aimi" || typed === "telematics" || typed === "compliance") {
          circuitFailure(typed);
        }
        send(res, 400, { ok: false, error: "dto invalid" });
        return;
      }
      if (result.ok === true && Array.isArray(result.value) === true) {
        result = {
          ok: true,
          value: paginateIntegrationList(result.value as readonly unknown[], filter.page, filter.limit),
        };
      }
      if (result.ok === true && typed === "telematics" && result.value !== undefined) {
        const telematics = result.value as IntegrationTelematicsResult;
        result = {
          ok: true,
          value: Object.freeze({
            tenant_id: telematics.tenant_id,
            label: telematics.label,
            points: paginateIntegrationList(telematics.points, filter.page, filter.limit),
          }),
        };
      }
      if (result.ok === true) {
        circuitSuccess(typed);
        cacheSet(key, result);
      }
      if (result.ok === false && (typed === "aimi" || typed === "telematics" || typed === "compliance")) {
        circuitFailure(typed);
      }
      if (typeof console !== "undefined" && typeof console.info === "function") {
        console.info(structuredIntegrationLog(typed, dto.tenant_id, dto.user_id, String(dto.role), result.ok === true ? "ok" : "error"));
      }
      send(res, result.ok === true ? 200 : 400, {
        ...result,
        maintenance: isIntegrationMaintenanceMode() === true ? "on" : "off",
      });
    },
  };
}
