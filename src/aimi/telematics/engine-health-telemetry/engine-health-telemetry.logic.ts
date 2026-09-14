/**
 * AIMI Engine — Engine Health Telemetry
 * WFS Universal CMMS
 * Phase P4 forecast. Deterministic health mapping only.
 */

export type NormalizedTelemetry = {
  vehicleId: string;
  ingestedAt: string;
  rawTelemetry: {
    engineTemp?: number;
    batteryVoltage?: number;
    faultFlags?: boolean;
    minorFlags?: boolean;
  };
  projectedHealth?: TelematicsProjectedHealth;
};

export type TelematicsProjectedHealth = 'good' | 'fair' | 'poor' | 'unknown';

export type TelematicsHealthProjection = {
  vehicleId: string;
  projectedHealth: TelematicsProjectedHealth;
};

const ENGINE_TEMP_POOR_THRESHOLD = 110;
const BATTERY_VOLTAGE_SLIGHTLY_LOW = 12.4;

export function projectTelematicsHealth(input: NormalizedTelemetry): TelematicsHealthProjection {
  // TODO: apply statistical/ML health projection (temp trends, voltage sag, DTC patterns).
  // TODO: format projectedHealth for UI display.

  const vehicleId = input.vehicleId;
  const telemetry = input.rawTelemetry;

  if (telemetry.engineTemp === undefined) {
    if (telemetry.batteryVoltage === undefined) {
      if (telemetry.faultFlags === undefined) {
        if (telemetry.minorFlags === undefined) {
          let projectedHealth: TelematicsProjectedHealth = 'unknown';
          if (input.projectedHealth !== undefined) {
            projectedHealth = input.projectedHealth;
          }
          return { vehicleId, projectedHealth };
        }
      }
    }
  }

  let projectedHealth: TelematicsProjectedHealth = 'good';

  if (telemetry.batteryVoltage !== undefined) {
    if (telemetry.batteryVoltage < BATTERY_VOLTAGE_SLIGHTLY_LOW) {
      projectedHealth = 'fair';
    }
  }
  if (telemetry.minorFlags === true) {
    projectedHealth = 'fair';
  }
  if (telemetry.engineTemp !== undefined) {
    if (telemetry.engineTemp > ENGINE_TEMP_POOR_THRESHOLD) {
      projectedHealth = 'poor';
    }
  }
  if (telemetry.faultFlags === true) {
    projectedHealth = 'poor';
  }
  if (input.projectedHealth !== undefined) {
    projectedHealth = input.projectedHealth;
  }

  return {
    vehicleId,
    projectedHealth,
  };
}
