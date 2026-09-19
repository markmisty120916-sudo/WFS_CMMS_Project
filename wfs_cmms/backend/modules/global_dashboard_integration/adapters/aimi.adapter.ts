export function predictiveModelsSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT model_id, tenant_id, asset_id, predictive_score, failure_risk, created_at, updated_at, deleted_at FROM PredictiveModels WHERE deleted_at IS NULL";
  }
  return "SELECT model_id, tenant_id, asset_id, predictive_score, failure_risk, created_at, updated_at, deleted_at FROM PredictiveModels WHERE tenant_id = $1 AND deleted_at IS NULL";
}

export function severityHistorySelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT severity_id, tenant_id, workorder_id, severity, reason, created_at, updated_at, deleted_at FROM SeverityHistory WHERE deleted_at IS NULL";
  }
  return "SELECT severity_id, tenant_id, workorder_id, severity, reason, created_at, updated_at, deleted_at FROM SeverityHistory WHERE tenant_id = $1 AND deleted_at IS NULL";
}

export function integrationEventsSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT event_id, tenant_id, event_type, payload, timestamp, created_at, updated_at, deleted_at FROM IntegrationEvents WHERE deleted_at IS NULL";
  }
  return "SELECT event_id, tenant_id, event_type, payload, timestamp, created_at, updated_at, deleted_at FROM IntegrationEvents WHERE tenant_id = $1 AND deleted_at IS NULL";
}
