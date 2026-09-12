import type { Permission } from "./roleTypes";
import type { RBACContext } from "./rbacContext";

export function requirePermission(context: RBACContext, permission: Permission): void {
  void context;
  void permission;
  throw new Error("Not implemented");
}
