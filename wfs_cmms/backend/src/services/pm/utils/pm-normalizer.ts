export function asFieldString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return "";
}

export function asDeletedAt(value: unknown): string | null {
  if (value === null) {
    return null;
  }
  if (value === undefined) {
    return null;
  }
  const text = asFieldString(value);
  if (text === "") {
    return null;
  }
  return text;
}

export function normalizeTenantId(tenant_id: string): string {
  if (tenant_id === "") {
    throw new Error("tenant_id required");
  }
  return tenant_id;
}

export function asFiniteNumber(value: string): number | null {
  if (value === "") {
    return null;
  }
  const parsed = Number(value);
  if (Number.isFinite(parsed) === false) {
    return null;
  }
  return parsed;
}

export function addMeter(current: string, interval: string): string {
  const current_n = asFiniteNumber(current);
  const interval_n = asFiniteNumber(interval);
  if (current_n === null) {
    return interval;
  }
  if (interval_n === null) {
    return current;
  }
  return String(current_n + interval_n);
}

export function meterReached(current: string, due: string): boolean {
  const current_n = asFiniteNumber(current);
  const due_n = asFiniteNumber(due);
  if (current_n === null) {
    return false;
  }
  if (due_n === null) {
    return false;
  }
  if (current_n < due_n) {
    return false;
  }
  return true;
}
