/**
 * AIMI Engine — Procurement Ingestion
 * WFS Universal CMMS
 * Phase 5 intake. Structural normalization only.
 */

export type ProcurementIngestionSource = 'cmms' | 'manual' | 'unknown';

export type ProcurementIngestionInput = {
  orderId?: string | number;
  createdAt?: string | Date;
  source?: string;
  partNumber?: string;
  quantity?: number;
  requestedBy?: string;
};

export type ProcurementIngestionEvent = {
  orderId: string;
  createdAt: string;
  source: ProcurementIngestionSource;
  partNumber: string;
  quantity: number | 'unknown';
  requestedBy: string;
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

function asSource(value: string | undefined): ProcurementIngestionSource {
  if (value === 'cmms') {
    return 'cmms';
  }
  if (value === 'manual') {
    return 'manual';
  }
  return 'unknown';
}

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

export function processProcurementIngestion(
  input: ProcurementIngestionInput,
): ProcurementIngestionEvent {
  // TODO: apply procurement domain intake rules (vendor codes, unit of measure).

  let quantity: number | 'unknown' = 'unknown';
  if (input.quantity !== undefined) {
    quantity = input.quantity;
  }

  return {
    orderId: asIdString(input.orderId),
    createdAt: asIsoTimestamp(input.createdAt),
    source: asSource(input.source),
    partNumber: asLabel(input.partNumber),
    quantity,
    requestedBy: asLabel(input.requestedBy),
  };
}
