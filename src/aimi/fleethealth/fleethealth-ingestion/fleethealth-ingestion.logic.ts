/**
 * AIMI Engine — Fleethealth Ingestion
 * WFS Universal CMMS
 * Phase 1 intake. Structural normalization only.
 */

export type FleetHealthIngestionSource = 'cmms' | 'telematics' | 'unknown';

export type FleetHealthIngestionInput = {
  id?: string | number;
  createdAt?: string | Date;
  source?: string;
  vehicleId?: string | number;
  healthStatus?: string;
  severity?: string;
};

export type FleetHealthIngestionEvent = {
  id: string;
  createdAt: string;
  source: FleetHealthIngestionSource;
  vehicleId: string;
  healthStatus: string;
  severity: string;
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

function asSource(value: string | undefined): FleetHealthIngestionSource {
  if (value === 'cmms') {
    return 'cmms';
  }
  if (value === 'telematics') {
    return 'telematics';
  }
  return 'unknown';
}

export function processFleethealthIngestion(
  input: FleetHealthIngestionInput,
): FleetHealthIngestionEvent {
  // TODO: apply fleet-health domain intake rules (status vocabulary, signal sources).

  const healthStatus =
    input.healthStatus === undefined || input.healthStatus === '' ? 'unknown' : input.healthStatus;
  const severity = input.severity === undefined || input.severity === '' ? 'unknown' : input.severity;

  return {
    id: asIdString(input.id),
    createdAt: asIsoTimestamp(input.createdAt),
    source: asSource(input.source),
    vehicleId: asIdString(input.vehicleId),
    healthStatus,
    severity,
  };
}
