/**
 * LoggerModule — Core
 * Master Blueprint V2 / BACKEND-STRUCTURE §4
 * Deterministic log levels. Immutable rank order.
 */

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export function logLevelRank(level: LogLevel): number {
  if (level === "trace") {
    return 10;
  }
  if (level === "debug") {
    return 20;
  }
  if (level === "info") {
    return 30;
  }
  if (level === "warn") {
    return 40;
  }
  if (level === "error") {
    return 50;
  }
  return 60;
}

export function isLogLevelEnabled(level: LogLevel, minimum: LogLevel): boolean {
  if (logLevelRank(level) < logLevelRank(minimum)) {
    return false;
  }
  return true;
}
