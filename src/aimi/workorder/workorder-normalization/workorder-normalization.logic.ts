/**
 * AIMI Engine — Workorder Normalization
 * WFS Universal CMMS
 * Phase 1 intake. Structural normalization only.
 */

export type WorkorderIngestionSource = 'cmms' | 'manual' | 'unknown';

export type WorkorderIngestionEvent = {
  id?: string | number;
  createdAt?: string | Date;
  source?: string;
  vehicleId?: string | number;
  priority?: string;
  status?: string;
};

export type NormalizedWorkorder = {
  workorderId: string;
  ingestedAt: string;
  source: WorkorderIngestionSource;
  vehicleId: string;
  priority: string;
  status: string;
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

function asSource(value: string | undefined): WorkorderIngestionSource {
  if (value === 'cmms') {
    return 'cmms';
  }
  if (value === 'manual') {
    return 'manual';
  }
  return 'unknown';
}

export function normalizeWorkorder(input: WorkorderIngestionEvent): NormalizedWorkorder {
  // TODO: apply work-order domain normalization (priority scale, status mapping).

  const priority = input.priority === undefined || input.priority === '' ? 'unknown' : input.priority;
  const status = input.status === undefined || input.status === '' ? 'unknown' : input.status;

  return {
    workorderId: asIdString(input.id),
    ingestedAt: asIsoTimestamp(input.createdAt),
    source: asSource(input.source),
    vehicleId: asIdString(input.vehicleId),
    priority,
    status,
  };
}
