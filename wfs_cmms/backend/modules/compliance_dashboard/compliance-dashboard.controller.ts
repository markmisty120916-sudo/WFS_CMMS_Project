import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import type { ComplianceDashboardFilter } from "./compliance-dashboard.interface";
import type { ComplianceDashboardService } from "./compliance-dashboard.service";

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function filterFromQuery(query: Readonly<Record<string, string>>): ComplianceDashboardFilter {
  return Object.freeze({
    asset: query.asset || "",
    inspection_type: query.inspection_type || "",
    severity: query.severity || "",
    driver: query.driver || "",
    technician: query.technician || "",
    compliance_category: query.compliance_category || "",
  });
}

export function createComplianceDashboardController(service: ComplianceDashboardService) {
  return {
    async handle(
      _req: IncomingMessage,
      res: ServerResponse,
      dto: ContextDto,
      operation: string,
      query: Readonly<Record<string, string>>,
    ): Promise<void> {
      const filter = filterFromQuery(query);
      if (operation === "overview") {
        const result = await service.overview(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "inspections") {
        const result = await service.inspections(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "dvir") {
        const result = await service.dvir(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "safety_workorders") {
        const result = await service.safetyWorkorders(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "findings") {
        const result = await service.findings(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "dot") {
        const result = await service.dot(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "district") {
        const result = await service.district(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "multilingual") {
        const result = await service.multilingual(dto);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "voice") {
        const result = await service.voice(dto);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "aimi_insights") {
        const result = await service.aimiInsights(dto);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      send(res, 404, { ok: false });
    },
  };
}
