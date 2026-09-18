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
