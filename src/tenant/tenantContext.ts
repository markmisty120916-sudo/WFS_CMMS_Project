import type { EngineConfigPack, EngineEnvironment } from "../types/engineContracts";

export interface TenantContext {
  tenantId: string;
  configPack: EngineConfigPack;
  permissions: readonly string[];
  environment: EngineEnvironment;
}
