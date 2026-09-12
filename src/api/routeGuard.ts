import type { ApiRequest } from "./apiTypes";

export function requireApiAccess(req: ApiRequest): void {
  void req;
  throw new Error("Not implemented");
}
