import type { GlobalDashboardIntegrationSession } from "../../global-dashboard-integration.interface";
import { GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES, globalDashboardIntegrationRequest } from "./global-dashboard-integration.api.client";

export async function listIntegrationAssets(
  session: GlobalDashboardIntegrationSession | null,
  query: Readonly<Record<string, string>>,
): Promise<unknown> {
  return globalDashboardIntegrationRequest(session, GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES.assets, query);
}
