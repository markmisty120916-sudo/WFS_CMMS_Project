/**
 * AIMI Engine — Fleethealth Alert Routing
 * WFS Universal CMMS
 * Phase 6 visibility plus prediction-aware routing. Maps existing values only.
 */

export type FleetHealthRoutingTarget = 'dashboard' | 'email' | 'sms' | 'none';

export type FleetHealthProjectedSeverity = 'low' | 'medium' | 'high' | 'unknown';

export type FleetHealthAlertRoutingInput = {
  recordId?: string;
  severity?: string;
  predictedFailureWindow?: number | null;
  projectedSeverity?: FleetHealthProjectedSeverity;
  trend?: 'worsening' | 'improving' | 'stable' | 'unknown';
};

export type FleetHealthAlertRoutingResult = {
  recordId: string;
  severity: string;
  routingTarget: FleetHealthRoutingTarget;
  predictedFailureWindow: number | null;
  projectedSeverity: FleetHealthProjectedSeverity;
  trend: 'worsening' | 'improving' | 'stable' | 'unknown';
  escalationRecommended: boolean;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

export function routeFleethealthAlert(
  input: FleetHealthAlertRoutingInput,
): FleetHealthAlertRoutingResult {
  // TODO: refine routing with prediction (failure-window tightness, projected severity).
  // TODO: format prediction visibility fields for UI display.

  let routingTarget: FleetHealthRoutingTarget = 'dashboard';

  if (input.severity === 'low') {
    routingTarget = 'dashboard';
  }
  if (input.severity === 'medium') {
    routingTarget = 'email';
  }
  if (input.severity === 'high') {
    routingTarget = 'sms';
  }
  if (input.severity === 'unknown') {
    routingTarget = 'dashboard';
  }
  if (input.severity === undefined || input.severity === '') {
    routingTarget = 'dashboard';
  }

  if (input.projectedSeverity === 'high') {
    if (routingTarget === 'dashboard') {
      routingTarget = 'email';
    }
    if (routingTarget === 'none') {
      routingTarget = 'email';
    }
  }
  if (input.trend === 'worsening') {
    if (routingTarget === 'dashboard') {
      routingTarget = 'email';
    }
    if (routingTarget === 'none') {
      routingTarget = 'email';
    }
  }

  let predictedFailureWindow: number | null = null;
  if (input.predictedFailureWindow !== undefined) {
    predictedFailureWindow = input.predictedFailureWindow;
  }

  let projectedSeverity: FleetHealthProjectedSeverity = 'unknown';
  if (input.projectedSeverity !== undefined) {
    projectedSeverity = input.projectedSeverity;
  }

  let trend: 'worsening' | 'improving' | 'stable' | 'unknown' = 'unknown';
  if (input.trend !== undefined) {
    trend = input.trend;
  }

  let escalationRecommended = false;
  if (projectedSeverity === 'high') {
    if (trend === 'worsening') {
      escalationRecommended = true;
    }
  }

  return {
    recordId: asLabel(input.recordId),
    severity: asLabel(input.severity),
    routingTarget,
    predictedFailureWindow,
    projectedSeverity,
    trend,
    escalationRecommended,
  };
}
