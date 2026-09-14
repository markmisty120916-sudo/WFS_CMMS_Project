/**
 * AIMI Engine — Vehicle Telemetry Normalization
 * WFS Universal CMMS
 * Phase 7 intake. Structural normalization only.
 */

export type VehicleTelemetryIngestionEvent = {
  vehicleId?: string | number;
  createdAt?: string | Date;
  source?: string;
  speed?: number | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type NormalizedVehicleTelemetryRecord = {
  vehicleId: string;
  ingestedAt: string;
  source: string;
  rawTelemetry: {
    speed: number | null;
    latitude: number | null;
    longitude: number | null;
  };
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

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

function asOptionalNumber(value: number | null | undefined): number | null {
  if (value === undefined) {
    return null;
  }
  return value;
}

export function normalizeVehicleTelemetry(
  input: VehicleTelemetryIngestionEvent,
): NormalizedVehicleTelemetryRecord {
  // TODO: apply telematics domain normalization (coordinate systems, speed units, vendor maps).

  return {
    vehicleId: asIdString(input.vehicleId),
    ingestedAt: asIsoTimestamp(input.createdAt),
    source: asLabel(input.source),
    rawTelemetry: {
      speed: asOptionalNumber(input.speed),
      latitude: asOptionalNumber(input.latitude),
      longitude: asOptionalNumber(input.longitude),
    },
  };
}
