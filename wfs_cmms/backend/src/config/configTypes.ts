export interface ConfigPack {
  tenantId: string;
  features: Record<string, boolean>;
  limits: Record<string, number>;
  branding: {
    name: string;
    logoUrl?: string;
  };
  environment: "production" | "sandbox" | "development";
}
