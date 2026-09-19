import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "@/dto/context.dto";
import { isGlobalDashboardIntegrationReleasePrepAllowed } from "./api/global-dashboard-integration.api.release-prep.permissions";
import type { GlobalDashboardIntegrationReleasePrepOperation } from "./api/global-dashboard-integration.api.release-prep";
import { sanitizeIntegrationValue } from "./global-dashboard-integration.hardening";
import {
  releaseReadiness,
  releaseStartupDiagnostics,
  structuredReleaseLog,
} from "./global-dashboard-integration.release-prep";

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(sanitizeIntegrationValue(body)));
}

export function createGlobalDashboardIntegrationReleasePrepController() {
  return {
    async handle(
      _req: IncomingMessage,
      res: ServerResponse,
      dto: ContextDto,
      operation: GlobalDashboardIntegrationReleasePrepOperation,
    ): Promise<void> {
      if (isGlobalDashboardIntegrationReleasePrepAllowed(operation, dto.role) === false) {
        send(res, 400, { ok: false, error: "role unauthorized" });
        return;
      }
      const env = typeof process === "undefined" ? {} : process.env;
      if (operation === "startup") {
        if (typeof console !== "undefined" && typeof console.info === "function") {
          console.info(structuredReleaseLog("startup_route", dto.tenant_id));
        }
        send(res, 200, { ok: true, value: releaseStartupDiagnostics(env) });
        return;
      }
      const ready = releaseReadiness(env);
      if (typeof console !== "undefined" && typeof console.info === "function") {
        console.info(structuredReleaseLog("ready_route", ready.ok === true ? "ok" : "error"));
      }
      send(res, ready.ok === true ? 200 : 503, ready);
    },
  };
}
