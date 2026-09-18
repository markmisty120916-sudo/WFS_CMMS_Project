import { complianceDashboardRequest } from "./compliance-dashboard.api.client";
import type { ComplianceDashboardSession } from "../compliance-dashboard.interface";

export async function listInspections(session: ComplianceDashboardSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return complianceDashboardRequest(session, "/compliance/inspections", query);
}
