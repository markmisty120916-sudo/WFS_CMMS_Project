/**
 * Results Layer — Core
 * Master Blueprint V2 / AIMI-RULES §2.3
 * Constructs an immutable Ok result. Does not substitute defaults.
 */

import type { OkResult } from "./result.interface";
import { freezeResultContext, type ResultContext } from "./result-context";

export function ok<T>(value: T, context: ResultContext): OkResult<T> {
  const sealed = freezeResultContext(context);
  return Object.freeze({
    ok: true as const,
    value,
    error: null,
    context: sealed,
  });
}
