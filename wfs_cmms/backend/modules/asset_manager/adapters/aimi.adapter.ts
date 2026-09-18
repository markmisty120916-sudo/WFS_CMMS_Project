import { isPmIntervalSane, isSeverityLevel, isVinFormat } from "../asset-manager-rules";

export function aimiValidateVin(vin: string): boolean {
  return isVinFormat(vin);
}

export function aimiValidatePmInterval(interval_miles: string, interval_hours: string): boolean {
  return isPmIntervalSane(interval_miles, interval_hours);
}

export function aimiValidateSeverityThreshold(value: string): boolean {
  return isSeverityLevel(value);
}

export function aimiDuplicateDetected(existing_keys: readonly string[], key: string): boolean {
  const normalized = key.trim().toUpperCase();
  if (normalized === "") {
    return false;
  }
  let index = 0;
  while (index < existing_keys.length) {
    if (existing_keys[index] === normalized) {
      return true;
    }
    index = index + 1;
  }
  return false;
}
