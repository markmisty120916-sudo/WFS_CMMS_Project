/**
 * AIMI Engine — Schedule Recommendation
 * WFS Universal CMMS
 * Phase P3 forecast. Deterministic capacity mapping only.
 */

export type ScheduleProjectedCapacity = 'low' | 'medium' | 'high';

export type ScheduleCapacityProjectionInput = {
  scheduleId?: string;
  technicianLoad?: number;
};

export type ScheduleCapacityProjectionResult = {
  scheduleId: string;
  projectedCapacity: ScheduleProjectedCapacity | null;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

export function projectScheduleCapacity(
  input: ScheduleCapacityProjectionInput,
): ScheduleCapacityProjectionResult {
  // TODO: apply multi-factor capacity models (bay count, skill mix, overtime).

  const scheduleId = asLabel(input.scheduleId);

  if (input.technicianLoad === undefined) {
    return { scheduleId, projectedCapacity: null };
  }

  let projectedCapacity: ScheduleProjectedCapacity = 'low';

  if (input.technicianLoad < 0.8) {
    projectedCapacity = 'medium';
  }
  if (input.technicianLoad < 0.5) {
    projectedCapacity = 'high';
  }

  return {
    scheduleId,
    projectedCapacity,
  };
}
