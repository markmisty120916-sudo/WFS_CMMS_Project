import type { TenantContext } from "./tenantContext";

export function loadTenantContext(tenantId: string): Promise<TenantContext> {
  void tenantId;
  throw new Error("Not implemented");
}
