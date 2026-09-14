/**
 * AIMI Engine — Procurement Approval Engine
 * WFS Universal CMMS
 * Phase 5 governance. Proposal only. No persistence.
 */

export type ProcurementApprovalStatus = 'rejected' | 'unknown' | 'pending_review';

export type ProcurementApprovalInput = {
  orderId?: string;
  validationStatus?: string;
  requestType?: string;
};

export type ProcurementApprovalResult = {
  orderId: string;
  approvalStatus: ProcurementApprovalStatus;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

export function evaluateProcurementApproval(
  input: ProcurementApprovalInput,
): ProcurementApprovalResult {
  // TODO: apply future approval heuristics (spend limits, dual control, work-order linkage).

  let approvalStatus: ProcurementApprovalStatus = 'pending_review';

  if (input.validationStatus !== 'valid') {
    approvalStatus = 'rejected';
  }
  if (input.validationStatus === 'valid') {
    if (input.requestType === undefined || input.requestType === '') {
      approvalStatus = 'unknown';
    }
    if (input.requestType !== undefined) {
      if (input.requestType !== '') {
        approvalStatus = 'pending_review';
      }
    }
  }

  return {
    orderId: asLabel(input.orderId),
    approvalStatus,
  };
}
