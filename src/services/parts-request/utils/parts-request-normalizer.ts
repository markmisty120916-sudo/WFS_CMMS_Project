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

export function isQuantityCovered(on_hand: string, requested: string): boolean {
  const stock = asFiniteNumber(on_hand);
  const need = asFiniteNumber(requested);
  if (stock === null) {
    return false;
  }
  if (need === null) {
    return false;
  }
  if (need <= 0) {
    return false;
  }
  if (stock < need) {
    return false;
  }
  return true;
}
