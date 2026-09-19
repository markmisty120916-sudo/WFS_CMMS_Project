import type { ConfigPack } from "./configTypes";

export const defaultConfigPack: ConfigPack = {
  tenantId: "",
  features: {},
  limits: {},
  branding: {
    name: "",
  },
  environment: "development",
};
