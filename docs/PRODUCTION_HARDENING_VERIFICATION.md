# Production Hardening Phase — Verification Log

Sources of truth: Master Blueprint V2 (2026 Revision) §23, docs/ANCHOR_PROMPT.md, docs/SESSION_RESUME.md.
No new modules, EventBus types, RBAC roles, or architecture. Existing dashboard modules were not rewritten. AIMI classification logic was not changed.

## 1. Reliability

- Retry: frontend `globalDashboardIntegrationRequest` retries critical integration GETs (assets, workorders, PM, inventory, compliance, DVIR, defects, vendors, telematics, AIMI) up to 3 attempts. All ten clients share that request helper.
- Circuit breakers: AIMI, telematics, and compliance open after 5 failures for 30s on both backend controller and frontend client.
- Fallback UI: integration panels render loading, empty, and error states via `PanelFallback`.
- Lazy mount: `LazyIntegrationPanel` defers panel children after first paint.

## 2. Performance

- In-memory TTL cache (15s) for integration list responses (assets, workorders, PM, inventory, compliance, AIMI, telematics breadcrumbs).
- Pagination: `page` / `limit` (default 50, max 100) on list results and telematics points.
- Background refresh: integration hook interval 30s.
- Filters normalized consistently: `asset`/`asset_id`, `vendor`/`vendor_id`, severity, status, page, limit.

## 3. Security

- RBAC: controller checks `isGlobalDashboardIntegrationApiAllowed` before every operation (existing permission functions unchanged).
- Tenant isolation: router rejects empty tenant_id on matched integration routes; service guard still enforces mismatch except Silent Master Key bypass (unchanged).
- Input validation: query IDs, S1–S5 severity, workorder/asset status tokens, page/limit.
- Output sanitization: strips `<`/`>` and truncates strings on JSON responses.
- Rate limiting: AIMI and telematics 30 requests / 60s per tenant.

## 4. Operational

- Structured JSON log line per integration operation in the controller; service `logger.info` per endpoint.
- Dashboard error reporting: `wfs.cmms.integration.errors` sessionStorage hook.
- Dashboard usage telemetry: `wfs.cmms.integration.telemetry` on shell view.
- Health: additive GET `/v1/integration/health` reports assets/AIMI/telematics/compliance circuit status and maintenance flag.
- Maintenance banner: `MaintenanceModeBanner` from health `maintenance=on` or `wfs.cmms.maintenance=1`.

## 5. Consistency

- Severity colors remain S1 red, S2 orange, S3 yellow, S4 green, S5 cyan.
- Status labels still use workorder/asset state tokens and `integrationStatusLabel`.
- PM interval format unchanged: `{miles} mi / {hours} hr`.
- Dashboard filters use the same five keys plus page/limit.

## Endpoints

Unchanged paths, additive query `page`/`limit` and additive health:

- GET /v1/integration/assets
- GET /v1/integration/workorders
- GET /v1/integration/pm
- GET /v1/integration/inventory
- GET /v1/integration/compliance
- GET /v1/integration/dvir
- GET /v1/integration/defects
- GET /v1/integration/vendors
- GET /v1/integration/telematics
- GET /v1/integration/aimi
- GET /v1/integration/health
