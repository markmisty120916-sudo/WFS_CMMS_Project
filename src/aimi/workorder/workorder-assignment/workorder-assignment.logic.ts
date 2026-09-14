/**
 * AIMI Engine — Workorder Assignment
 * WFS Universal CMMS
 * Phase 4 operational proposal. No persistence.
 */

export type WorkorderAssignmentInput = {
  workorderId?: string;
  candidateTechnicianId?: string;
  skillRequired?: string;
  region?: string;
  skillMatch?: boolean;
  regionMatch?: boolean;
};

export type WorkorderAssignmentProposal = {
  workorderId: string;
  technicianId: string;
  assignmentStatus: 'proposed';
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

export function proposeWorkorderAssignment(
  input: WorkorderAssignmentInput,
): WorkorderAssignmentProposal {
  // TODO: apply assignment heuristics (skill matrix, region coverage, load).

  let technicianId = 'unassigned';

  if (input.skillMatch === false) {
    technicianId = 'unassigned';
  }
  if (input.regionMatch === false) {
    technicianId = 'unassigned';
  }
  if (input.skillMatch !== false) {
    if (input.regionMatch !== false) {
      if (input.candidateTechnicianId !== undefined) {
        if (input.candidateTechnicianId !== '') {
          technicianId = input.candidateTechnicianId;
        }
      }
    }
  }

  return {
    workorderId: asLabel(input.workorderId),
    technicianId,
    assignmentStatus: 'proposed',
  };
}
