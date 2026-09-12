import type { Permission, Role } from "./roleTypes";

export interface RBACContext {
  userId: string;
  tenantId: string;
  roles: Role[];
  permissions: Permission[];
}
