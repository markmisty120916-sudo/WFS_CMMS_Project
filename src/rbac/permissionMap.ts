import { Permission, Role } from "./roleTypes";

export type PermissionMap = Record<Role, Permission[]>;

export const permissionMap: PermissionMap = {
  [Role.Admin]: [],
  [Role.Manager]: [],
  [Role.Technician]: [],
  [Role.Viewer]: [],
};
