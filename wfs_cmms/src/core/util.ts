export function asNonEmptyString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value;
}

export function asIsoDate(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value;
}

export function isNonEmpty(value: string): boolean {
  return value !== "";
}
