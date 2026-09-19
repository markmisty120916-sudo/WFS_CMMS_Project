/**
 * LoggerModule — Core
 * Master Blueprint V2 / TENANT-ISOLATION §2
 * Per-request correlation_id. No global state. No random source.
 */

export type CorrelationIdInput = {
  tenant_id: string;
  user_id: string;
  timestamp: string;
};

export function createCorrelationId(input: CorrelationIdInput): string {
  if (input.tenant_id === "") {
    throw new Error("tenant_id required");
  }
  if (input.user_id === "") {
    throw new Error("user_id required");
  }
  if (input.timestamp === "") {
    throw new Error("timestamp required");
  }
  return input.tenant_id + ":" + input.user_id + ":" + input.timestamp;
}
