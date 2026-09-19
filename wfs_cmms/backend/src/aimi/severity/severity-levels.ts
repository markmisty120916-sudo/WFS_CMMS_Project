/**
 * AIMI Severity Engine
 * Master Blueprint V2 / AIMI-SEVERITY §2
 * Five immutable severity levels. Cannot be renamed or expanded.
 */

export type SeverityLevel = "S1" | "S2" | "S3" | "S4" | "S5";

export function severityRank(level: SeverityLevel): number {
  if (level === "S1") {
    return 1;
  }
  if (level === "S2") {
    return 2;
  }
  if (level === "S3") {
    return 3;
  }
  if (level === "S4") {
    return 4;
  }
  return 5;
}

export function isHigherSeverity(candidate: SeverityLevel, current: SeverityLevel): boolean {
  if (severityRank(candidate) < severityRank(current)) {
    return true;
  }
  return false;
}
