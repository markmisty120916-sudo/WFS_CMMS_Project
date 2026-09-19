import type { GlobalDashboardIntegrationSession } from "../../global-dashboard-integration.interface";
import { globalDashboardIntegrationRequest } from "./global-dashboard-integration.api.client";
import { RELEASE_PREP_CLIENT_ROUTES } from "../global-dashboard-integration.release-prep";

export async function listIntegrationReady(
  session: GlobalDashboardIntegrationSession | null,
  query: Readonly<Record<string, string>>,
): Promise<unknown> {
  return globalDashboardIntegrationRequest(session, RELEASE_PREP_CLIENT_ROUTES.ready, query);
}

export async function listIntegrationStartup(
  session: GlobalDashboardIntegrationSession | null,
  query: Readonly<Record<string, string>>,
): Promise<unknown> {
  return globalDashboardIntegrationRequest(session, RELEASE_PREP_CLIENT_ROUTES.startup, query);
}
