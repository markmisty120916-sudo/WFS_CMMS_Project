/**
 * AIMI Engine — Procurement Order Validation
 * WFS Universal CMMS
 * Phase 5 governance. Structural checks only.
 */

export type ProcurementValidationStatus = 'valid' | 'invalid';

export type ProcurementOrderValidationInput = {
  orderId?: string;
  partNumber?: string;
  quantity?: number;
  requestedBy?: string;
};

export type ProcurementOrderValidationResult = {
  orderId: string;
  validationStatus: ProcurementValidationStatus;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

export function validateProcurementOrder(
  input: ProcurementOrderValidationInput,
): ProcurementOrderValidationResult {
  // TODO: apply future validation rules (catalog match, min/max order qty, restricted parts).

  let validationStatus: ProcurementValidationStatus = 'valid';

  if (input.partNumber === undefined || input.partNumber === '') {
    validationStatus = 'invalid';
  }
  if (input.requestedBy === undefined || input.requestedBy === '') {
    validationStatus = 'invalid';
  }
  if (input.quantity === undefined) {
    validationStatus = 'invalid';
  }
  if (input.quantity !== undefined) {
    if (input.quantity <= 0) {
      validationStatus = 'invalid';
    }
  }

  return {
    orderId: asLabel(input.orderId),
    validationStatus,
  };
}
