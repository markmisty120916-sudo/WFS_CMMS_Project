import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import type { GlobalDashboardIntegrationFilter } from "./global-dashboard-integration.interface";
import type { GlobalDashboardIntegrationService } from "./global-dashboard-integration.service";

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function filterFromQuery(query: Readonly<Record<string, string>>): GlobalDashboardIntegrationFilter {
  return Object.freeze({
    asset_id: query.asset_id || query.asset || "",
    workorder_id: query.workorder_id || "",
    severity: query.severity || "",
    status: query.status || "",
    vendor_id: query.vendor_id || query.vendor || "",
  });
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
      const filter = filterFromQuery(query);
      if (operation === "assets") {
        const result = await service.assets(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "workorders") {
        const result = await service.workorders(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "pm") {
        const result = await service.pm(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "inventory") {
        const result = await service.inventory(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "compliance") {
        const result = await service.compliance(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "dvir") {
        const result = await service.dvir(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "defects") {
        const result = await service.defects(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "vendors") {
        const result = await service.vendors(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "telematics") {
        const result = await service.telematics(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "aimi") {
        const result = await service.aimi(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      send(res, 404, { ok: false });
    },
  };
}
