export interface ApiRequest {
  tenantId: string;
  userId: string;
  params: Record<string, unknown>;
  body: unknown;
}

export interface ApiResponse {
  status: number;
  data?: unknown;
  error?: unknown;
}
