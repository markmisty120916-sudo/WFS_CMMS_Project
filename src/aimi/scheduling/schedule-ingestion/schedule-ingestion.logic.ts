/**
 * AIMI Engine — Schedule Ingestion
 * WFS Universal CMMS
 * Phase 3 intake. Structural normalization only.
 */

export type ScheduleIngestionSource = 'cmms' | 'manual' | 'unknown';

export type ScheduleIngestionInput = {
  scheduleId?: string | number;
  createdAt?: string | Date;
  source?: string;
  vehicleId?: string | number;
  windowStart?: string | Date;
  windowEnd?: string | Date;
};

export type ScheduleIngestionEvent = {
  scheduleId: string;
  createdAt: string;
  source: ScheduleIngestionSource;
  vehicleId: string;
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

function asWindow(value: string | Date | undefined): string {
  if (value === undefined) {
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

function asSource(value: string | undefined): ScheduleIngestionSource {
  if (value === 'cmms') {
    return 'cmms';
  }
  if (value === 'manual') {
    return 'manual';
  }
  return 'unknown';
}

export function processScheduleIngestion(input: ScheduleIngestionInput): ScheduleIngestionEvent {
  // TODO: apply schedule domain intake rules (shop calendars, source systems).

  return {
    scheduleId: asIdString(input.scheduleId),
    createdAt: asIsoTimestamp(input.createdAt),
    source: asSource(input.source),
    vehicleId: asIdString(input.vehicleId),
    windowStart: asWindow(input.windowStart),
    windowEnd: asWindow(input.windowEnd),
  };
}
