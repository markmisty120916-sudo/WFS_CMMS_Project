/**
 * Results Layer — Core
 * Master Blueprint V2 / TENANT-ISOLATION §2 / AIMI-RULES §2.4
 * Constructs an immutable Err result. Rejects cross-tenant error masking.
 */

import type { CoreError } from "../errors/error.interface";
import type { ErrResult } from "./result.interface";
import { freezeResultContext, type ResultContext } from "./result-context";

export function err(error: CoreError, context: ResultContext): ErrResult {
  const sealed = freezeResultContext(context);
  if (error.tenant_id !== sealed.tenant_id) {
    throw new Error("tenant_id mismatch");
  }
  if (error.user_id === "") {
    throw new Error("user_id required");
  }
  return Object.freeze({
    ok: false as const,
    value: null,
    error,
    context: sealed,
  });
}
