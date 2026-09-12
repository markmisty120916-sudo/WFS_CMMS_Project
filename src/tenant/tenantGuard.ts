import type { TenantContext } from "./tenantContext";

export function requireTenant(context: TenantContext): void {
  void context;
  throw new Error("Not implemented");
}
