export type GlobalDashboardIntegrationReleasePrepOperation = "ready" | "startup";

export type GlobalDashboardIntegrationReleasePrepRoute = {
  readonly method: "GET";
  readonly path: string;
  readonly operation: GlobalDashboardIntegrationReleasePrepOperation;
};

export const GLOBAL_DASHBOARD_INTEGRATION_RELEASE_PREP_ROUTES: readonly GlobalDashboardIntegrationReleasePrepRoute[] =
  Object.freeze([
    Object.freeze({ method: "GET" as const, path: "/integration/ready", operation: "ready" as const }),
    Object.freeze({ method: "GET" as const, path: "/integration/startup", operation: "startup" as const }),
  ]);
