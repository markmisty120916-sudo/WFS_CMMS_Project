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

export function applyDelta(quantity: string, delta: string): string | null {
  const current = asFiniteNumber(quantity);
  const change = asFiniteNumber(delta);
  if (current === null) {
    return null;
  }
  if (change === null) {
    return null;
  }
  return String(current + change);
}

export function isAtOrBelow(quantity: string, reorder_point: string): boolean {
  const current = asFiniteNumber(quantity);
  if (current === null) {
    return false;
  }
  if (reorder_point === "") {
    if (current <= 0) {
      return true;
    }
    return false;
  }
  const point = asFiniteNumber(reorder_point);
  if (point === null) {
    return false;
  }
  if (current <= point) {
    return true;
  }
  return false;
}
