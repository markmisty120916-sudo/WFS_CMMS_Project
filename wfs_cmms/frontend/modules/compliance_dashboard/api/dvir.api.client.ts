import { complianceDashboardRequest } from "./compliance-dashboard.api.client";
import type { ComplianceDashboardSession } from "../compliance-dashboard.interface";

export async function listDvir(session: ComplianceDashboardSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return complianceDashboardRequest(session, "/compliance/dvir", query);
}

export async function listDriverDefects(session: ComplianceDashboardSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return complianceDashboardRequest(session, "/driver/defects", query);
}
