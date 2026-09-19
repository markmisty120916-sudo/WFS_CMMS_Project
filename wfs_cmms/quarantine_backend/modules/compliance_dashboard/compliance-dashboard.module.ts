import { createComplianceDashboardRouter } from "./compliance-dashboard.routes";
import { ComplianceDashboardService, type ComplianceDashboardServiceOptions } from "./compliance-dashboard.service";
import { mountComplianceDashboardExpress } from "./compliance-dashboard.express";

export function createComplianceDashboardModule(options: ComplianceDashboardServiceOptions) {
  const service = new ComplianceDashboardService(options);
  return Object.freeze({
    service,
    router: createComplianceDashboardRouter(service),
    mountExpress: mountComplianceDashboardExpress,
  });
}
