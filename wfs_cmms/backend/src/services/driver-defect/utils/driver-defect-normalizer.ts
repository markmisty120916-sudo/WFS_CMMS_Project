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

export function asBooleanFlag(value: unknown): boolean {
  if (value === true) {
    return true;
  }
  const text = asFieldString(value);
  if (text === "true") {
    return true;
  }
  return false;
}
