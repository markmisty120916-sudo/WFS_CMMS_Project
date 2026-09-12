import type { ConfigPack } from "./configTypes";

export function loadConfigPack(tenantId: string): Promise<ConfigPack> {
  void tenantId;
  throw new Error("Not implemented");
}
