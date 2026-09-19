export type EngineEnvironment = "development" | "staging" | "production";

export interface EngineTenantContext {
  tenantId: string;
}

export interface EngineUserContext {
  userId: string;
  roleId: string;
}

export interface EngineConfigPack {
  categories: unknown;
  inspectionTemplates: unknown;
  pmTemplates: unknown;
  severityThresholds: unknown;
}

export interface EngineRequest<TPayload = unknown> {
  payload: TPayload;
}

export interface EngineError {
  code: string;
  message: string;
  details?: unknown;
}

export interface EngineResponse<TResult = unknown> {
  success: boolean;
  result?: TResult;
  error?: EngineError;
}

export interface EngineContext {
  tenant: EngineTenantContext;
  user: EngineUserContext;
  permissions: readonly string[];
  configPack: EngineConfigPack;
  environment: EngineEnvironment;
}

export type EngineHandler<TPayload = unknown, TResult = unknown> = (
  request: EngineRequest<TPayload>,
  context: EngineContext
) => Promise<EngineResponse<TResult>>;

export interface EngineMetadata {
  name: string;
  version: string;
  description: string;
  dependencies: readonly string[];
}

export interface AIMIEngine<TPayload = unknown, TResult = unknown> {
  metadata: EngineMetadata;
  handler: EngineHandler<TPayload, TResult>;
}

export interface EngineRegistryEntry<TPayload = unknown, TResult = unknown> {
  name: string;
  engine: AIMIEngine<TPayload, TResult>;
}
