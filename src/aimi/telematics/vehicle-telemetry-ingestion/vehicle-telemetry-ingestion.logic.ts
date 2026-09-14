/**
 * AIMI Engine — Vehicle Telemetry Ingestion
 * WFS Universal CMMS
 * Phase 7 intake. Structural normalization only.
 */

export type VehicleTelemetryIngestionSource = 'telematics' | 'cmms' | 'unknown';

export type VehicleTelemetryIngestionInput = {
  vehicleId?: string | number;
  createdAt?: string | Date;
  source?: string;
  speed?: number | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type VehicleTelemetryIngestionEvent = {
  vehicleId: string;
  createdAt: string;
  source: VehicleTelemetryIngestionSource;
  speed: number | null;
  latitude: number | null;
  longitude: number | null;
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

function asSource(value: string | undefined): VehicleTelemetryIngestionSource {
  if (value === 'telematics') {
    return 'telematics';
  }
  if (value === 'cmms') {
    return 'cmms';
  }
  return 'unknown';
}

function asOptionalNumber(value: number | null | undefined): number | null {
  if (value === undefined) {
    return null;
  }
  return value;
}

export function processVehicleTelemetryIngestion(
  input: VehicleTelemetryIngestionInput,
): VehicleTelemetryIngestionEvent {
  // TODO: apply telematics domain intake rules (vendor payloads, unit conversion).

  return {
    vehicleId: asIdString(input.vehicleId),
    createdAt: asIsoTimestamp(input.createdAt),
    source: asSource(input.source),
    speed: asOptionalNumber(input.speed),
    latitude: asOptionalNumber(input.latitude),
    longitude: asOptionalNumber(input.longitude),
  };
}
