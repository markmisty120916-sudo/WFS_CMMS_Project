/**
 * AIMI Engine — Schedule Normalization
 * WFS Universal CMMS
 * Phase 3 intake. Structural normalization only.
 */

export type ScheduleIngestionEvent = {
  scheduleId?: string | number;
  createdAt?: string | Date;
  windowStart?: string | Date | null;
  windowEnd?: string | Date | null;
};

export type NormalizedScheduleRecord = {
  scheduleId: string;
  ingestedAt: string;
  windowStart: string;
  windowEnd: string;
};

function asIdString(value: string | number | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  const id = String(value);
  if (id === '') {
    return 'unknown';
  }
  return id;
}

function asIsoTimestamp(value: string | Date | undefined): string {
  if (value === undefined) {
    return '1970-01-01T00:00:00.000Z';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value === '') {
    return '1970-01-01T00:00:00.000Z';
  }
  return value;
}

function asWindow(value: string | Date | null | undefined): string {
  if (value === undefined || value === null) {
    return 'unknown';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value === '') {
    return 'unknown';
  }
  return value;
}

export function normalizeSchedule(input: ScheduleIngestionEvent): NormalizedScheduleRecord {
  // TODO: apply schedule domain normalization (timezone, shop hours, overlapping windows).

  return {
    scheduleId: asIdString(input.scheduleId),
    ingestedAt: asIsoTimestamp(input.createdAt),
    windowStart: asWindow(input.windowStart),
    windowEnd: asWindow(input.windowEnd),
  };
}
