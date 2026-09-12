import type { ApiRequest, ApiResponse } from "./apiTypes";

export type ApiRouter = Record<string, (req: ApiRequest) => Promise<ApiResponse>>;

export const router: ApiRouter = {};
