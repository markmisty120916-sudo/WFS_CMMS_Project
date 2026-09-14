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

export type ScheduleSlotRecommendation = 'reject_slot' | 'use_with_buffer' | 'use_as_is';
export type ScheduleCapacityRecommendation = 'avoid_overbooking' | 'monitor_load' | 'normal_scheduling';

export type ScheduleOptionsRecommendationInput = {
  scheduleId?: string;
  slotFeasible?: boolean;
  projectedCapacity?: 'high' | 'medium' | 'low' | 'unknown';
  predictedDelayMinutes?: number | null;
};

export type ScheduleOptionsRecommendationResult = {
  scheduleId: string;
  slotRecommendation: ScheduleSlotRecommendation;
  capacityRecommendation: ScheduleCapacityRecommendation;
  bufferRecommended: boolean;
};

export function recommendScheduleOptions(
  input: ScheduleOptionsRecommendationInput,
): ScheduleOptionsRecommendationResult {
  // TODO: refine schedule options (travel, bay type). Do not write a schedule.

  let slotRecommendation: ScheduleSlotRecommendation = 'use_as_is';
  let capacityRecommendation: ScheduleCapacityRecommendation = 'normal_scheduling';

  if (input.predictedDelayMinutes !== undefined) {
    if (input.predictedDelayMinutes !== null) {
      if (input.predictedDelayMinutes > 30) {
        slotRecommendation = 'use_with_buffer';
      }
    }
  }
  if (input.slotFeasible === false) {
    slotRecommendation = 'reject_slot';
  }

  if (input.projectedCapacity === 'medium') {
    capacityRecommendation = 'monitor_load';
  }
  if (input.projectedCapacity === 'low') {
    capacityRecommendation = 'avoid_overbooking';
  }

  let bufferRecommended = false;
  if (input.predictedDelayMinutes !== undefined) {
    if (input.predictedDelayMinutes !== null) {
      if (input.predictedDelayMinutes > 45) {
        bufferRecommended = true;
      }
    }
  }

  return {
    scheduleId: asLabel(input.scheduleId),
    slotRecommendation,
    capacityRecommendation,
    bufferRecommended,
  };
}
