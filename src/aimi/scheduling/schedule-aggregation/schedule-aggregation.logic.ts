/**
 * AIMI Engine — Schedule Aggregation
 * WFS Universal CMMS
 * Phase P3 forecast. Delay from duration vs window only.
 */

export type ScheduleDelayProjectionInput = {
  scheduleId?: string;
  windowStart?: string | Date;
  windowEnd?: string | Date;
  predictedDurationMinutes?: number | null;
};

export type ScheduleDelayProjectionResult = {
  scheduleId: string;
  predictedDelayMinutes: number | null;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

function asTimeMs(value: string | Date | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value instanceof Date) {
    const ms = value.getTime();
    if (ms !== ms) {
      return undefined;
    }
    return ms;
  }
  if (value === '') {
    return undefined;
  }
  const parsed = Date.parse(value);
  if (parsed !== parsed) {
    return undefined;
  }
  return parsed;
}

export function projectScheduleDelay(input: ScheduleDelayProjectionInput): ScheduleDelayProjectionResult {
  // TODO: apply future delay-projection models (queueing, parts wait, overtime).

  const scheduleId = asLabel(input.scheduleId);

  if (input.predictedDurationMinutes === undefined || input.predictedDurationMinutes === null) {
    return { scheduleId, predictedDelayMinutes: null };
  }

  const startMs = asTimeMs(input.windowStart);
  const endMs = asTimeMs(input.windowEnd);
  if (endMs === undefined) {
    return { scheduleId, predictedDelayMinutes: null };
  }
  if (startMs === undefined) {
    return { scheduleId, predictedDelayMinutes: null };
  }

  const windowMinutes = (endMs - startMs) / 60000;
  let predictedDelayMinutes = 0;

  if (input.predictedDurationMinutes > windowMinutes) {
    predictedDelayMinutes = input.predictedDurationMinutes - windowMinutes;
  }

  return {
    scheduleId,
    predictedDelayMinutes,
  };
}

export type ScheduleProjectedCapacity = 'high' | 'medium' | 'low' | 'unknown';

export type ScheduleAggregationInput = {
  scheduleId?: string;
  slotFeasible?: boolean;
  projectedCapacity?: ScheduleProjectedCapacity;
  predictedDelayMinutes?: number | null;
};

export type ScheduleAggregationResult = {
  scheduleId: string;
  slotFeasible: boolean;
  projectedCapacity: ScheduleProjectedCapacity;
  predictedDelayMinutes: number | null;
};

export function aggregateScheduleData(input: ScheduleAggregationInput): ScheduleAggregationResult {
  // TODO: add future schedule analytics (bay utilization, delay histograms).

  let slotFeasible = false;
  if (input.slotFeasible !== undefined) {
    slotFeasible = input.slotFeasible;
  }

  let projectedCapacity: ScheduleProjectedCapacity = 'unknown';
  if (input.projectedCapacity !== undefined) {
    projectedCapacity = input.projectedCapacity;
  }

  let predictedDelayMinutes: number | null = null;
  if (input.predictedDelayMinutes !== undefined) {
    predictedDelayMinutes = input.predictedDelayMinutes;
  }

  return {
    scheduleId: asLabel(input.scheduleId),
    slotFeasible,
    projectedCapacity,
    predictedDelayMinutes,
  };
}
