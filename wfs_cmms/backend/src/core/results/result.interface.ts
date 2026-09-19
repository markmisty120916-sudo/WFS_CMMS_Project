import type { ResultContext } from "@/results/result-context";

export type Result<T> = {
  ok: boolean;
  value?: T;
  context?: ResultContext;
};

export function ok<T>(value: T, context?: ResultContext): Result<T> {
  return { ok: true, value, context };
}

export function err<T>(error: unknown, context?: ResultContext): Result<T> {
  return { ok: false, context };
}
