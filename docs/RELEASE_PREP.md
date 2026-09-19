# Final Release Preparation

Sources of truth: Master Blueprint V2 (2026 Revision) §24, docs/ANCHOR_PROMPT.md, docs/SESSION_RESUME.md.

This document is additive. It does not rename modules, EventBus types, RBAC roles, or tenant isolation rules. AIMI classification logic is unchanged.

## Required environment variables

| Variable | Scope | Rule |
| --- | --- | --- |
| `WFS_CMMS_DATABASE_URL` | backend | PostgreSQL connection string (Master Blueprint V2 §3.3). Missing is reported by startup diagnostics; invalid values fail build validation. |
| `WFS_CMMS_API_BASE` | backend | Must be `/v1` when set (existing API versioning). |
| `NEXT_PUBLIC_WFS_CMMS_API_BASE` | frontend | Must be `/v1` when set. Dashboards continue to call `/v1` when unset. |
| `NODE_ENV` | containers | `production` in release images. |

Template: `docs/ENVIRONMENT.template.md`.

## Required request headers

Unchanged from Global Dashboard Integration:

- `Authorization`
- `X-Tenant-Id`

Empty `tenant_id` is rejected on matched integration routes, including additive `/integration/ready` and `/integration/startup`.

## Required service dependencies

- PostgreSQL (tenant-scoped tables, Master Blueprint V2 §3.3)
- Node.js / TypeScript backend (modular services, §3.2)
- Next.js frontend (role-based dashboards, §3.1)
- Existing in-process event bus (no new event types)
- AIMI engines already wired through `/v1/integration/aimi` (no new AIMI module)
- Telematics ingestion already wired through `/v1/integration/telematics` (Find Vehicle)

## Required health checks

Existing:

- `GET /v1/integration/health` — assets / AIMI / telematics / compliance circuit status and maintenance flag

Additive:

- `GET /v1/integration/ready` — environment validation plus circuit readiness
- `GET /v1/integration/startup` — startup diagnostics (endpoints, dashboards, env, mock_data=absent)

Probes must send `Authorization` and `X-Tenant-Id`. Tenant isolation is not bypassed.

## Required AIMI + telematics configuration

No new AIMI or telematics keys. Release uses existing integration adapters:

- AIMI: IntegrationEvents, PredictiveModels, SeverityHistory via `/v1/integration/aimi`
- Telematics / Find Vehicle: `/v1/integration/telematics`
- Workorders: `/v1/integration/workorders`
- PM: `/v1/integration/pm`
- Inventory: `/v1/integration/inventory`
- Compliance / DVIR / defects: `/v1/integration/compliance`, `/v1/integration/dvir`, `/v1/integration/defects`

Severity remains S1–S5. Event types in `GLOBAL_DASHBOARD_INTEGRATION_EVENT_TYPES` are unchanged.

## Required tenant isolation rules

Unchanged:

- Every request is scoped by `tenant_id`
- Empty `tenant_id` is rejected
- Record `tenant_id` must match session `tenant_id` except Silent Master Key bypass already defined on the integration layer

## Required RBAC rules

Unchanged. Integration access still uses `canAccessGlobalDashboardIntegration` and existing per-operation gates. Additive `ready` and `startup` use the same integration access function as `health`. No roles were added or renamed.

Master Blueprint V2 §2 core roles remain: Master Technician, Technician, Fleet Manager, Administrator, Driver, Inspector, AIMI System Role (internal). Existing dashboard roles already present in the integration layer are not modified.

## Integration endpoint references

- `GET /v1/integration/assets`
- `GET /v1/integration/workorders`
- `GET /v1/integration/pm`
- `GET /v1/integration/inventory`
- `GET /v1/integration/compliance`
- `GET /v1/integration/dvir`
- `GET /v1/integration/defects`
- `GET /v1/integration/vendors`
- `GET /v1/integration/telematics`
- `GET /v1/integration/aimi`
- `GET /v1/integration/health`
- `GET /v1/integration/ready` (additive)
- `GET /v1/integration/startup` (additive)

## Dashboard wiring references

Dashboards load through `DashboardIntegrationShell` with live `/v1/integration/*` clients (no mock payloads):

- technician
- master_technician
- fleet_manager
- parts_manager
- compliance
- driver
- silent_master_key

Asset Manager remains its existing module route and is not rewritten.

Additive frontend: `ReleasePreflightBanner` on the integration shell, environment validation, structured startup log key `wfs.cmms.release.startup`, fallback state when preflight fails.

## Build and deploy hints

- Build validation: `scripts/validate-release-config.ts` (`runReleaseBuildValidation`)
- Images: `deploy/Dockerfile.backend`, `deploy/Dockerfile.frontend` (non-root user, no secret copy, HEALTHCHECK)
- CI/CD: `docs/CI_CD_HINTS.md`
