/**
 * AIMI Engine — Fleethealth Alert Routing
 * WFS Universal CMMS
 * Phase 6 visibility. Maps existing severity only.
 */

export type FleetHealthRoutingTarget = 'dashboard' | 'email' | 'sms' | 'none';

export type FleetHealthAlertRoutingInput = {
  recordId?: string;
  severity?: string;
};

export type FleetHealthAlertRoutingResult = {
  recordId: string;
  severity: string;
  routingTarget: FleetHealthRoutingTarget;
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
  // TODO: apply future routing rules (on-call roster, quiet hours, tenant channels).

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

  return {
    recordId: asLabel(input.recordId),
    severity: asLabel(input.severity),
    routingTarget,
  };
}
