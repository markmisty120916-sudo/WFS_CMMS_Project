/**
 * Results Layer — Core
 * Master Blueprint V2 / AIMI-RULES §2.3
 * Immutable Ok/Err result. No fallback values. No silent failures.
 */

import type { CoreError } from "../errors/error.interface";
import type { ResultContext } from "./result-context";

export type OkResult<T> = {
  readonly ok: true;
  readonly value: T;
  readonly error: null;
  readonly context: ResultContext;
};

export type ErrResult = {
  readonly ok: false;
  readonly value: null;
  readonly error: CoreError;
  readonly context: ResultContext;
};

export type Result<T> = OkResult<T> | ErrResult;
