WFS UNIVERSAL MASTER BLUEPRINT
Walters Fleet Solutions — Universal CMMS
AIMI — Intelligence Engine Inside WFS

WFS (Walters Fleet Solutions) is a universal, multi‑tenant CMMS platform for any fleet: school districts, city/county fleets, police/fire, utility…

1. System Identity and Goals
Identity
WFS is a universal, multi‑tenant CMMS designed to support any fleet type with zero drift and full automation.

Goals
Make technicians’ and fleet managers’ lives easier

Eliminate chaos in work orders, PM, inspections, inventory

Provide real‑time fleet health and trip readiness

Be turnkey for Northwest ISD and reusable for other fleets

Ensure Cursor can build the entire CMMS automatically

2. High‑Level Architecture
Architecture Style
Modular

Service‑oriented

API‑driven

Multi‑tenant

AIMI intelligence integrated

Layers
Backend (CMMS services + AIMI engine)

Frontend (React UI for techs, managers, admins)

Database (multi‑tenant isolation)

AIMI (severity, diagnostics, fleet health, readiness)

Core Modules
Tenants & Users

Assets

Work Orders

Preventive Maintenance

Inspections

Inventory / Parts

AIMI Diagnostics

Fleet Health

Trip Readiness

Admin / Configuration

3. Backend Folder Structure
Code
wfs_cmms/
  src/
    core/
    modules/
      tenants/
      users/
      assets/
      workorders/
      pm/
      inspections/
      inventory/
      aimi/
      tripreadiness/
    api/
    db/
4. Data Models (Schemas)
All entities include:
tenantId, createdAt, updatedAt

Tenant
id, name, type, timezone, locale, isActive

Role
id, tenantId, name, permissions[]

User
id, tenantId, email, displayName, roleId, isActive

Asset
id, tenantId, name, assetTag, category, location, status, criticality, manufacturer, model, year, vinOrSerial, meterReading

Work Order
id, tenantId, assetId, type, status, priority, severity, requestedByUserId, assignedToUserId, summary, description, dueDate, completedAt, aimiDiagnosticId

PM Plan
id, tenantId, assetId, name, triggerType, intervalDays, intervalMeter, lastCompletedAt, lastMeterReading, isActive

Inspection Template
id, tenantId, name, assetCategory, items[]

Inspection Result
id, tenantId, assetId, templateId, workOrderId, performedByUserId, performedAt, items[]

Inventory Part
id, tenantId, sku, name, description, unitOfMeasure, minStockLevel, reorderPoint

Part Stock
id, tenantId, partId, location, quantityOnHand, quantityReserved, quantityOnOrder

AIMI Diagnostic Event
id, tenantId, assetId, source, code, description, severity, detectedAt, resolvedAt, linkedWorkOrderId

Fleet Health Snapshot
id, tenantId, score, calculatedAt, assetScores[]

Trip Readiness Check
id, tenantId, assetId, scheduledDeparture, status, blockingReasons

5. API Specifications
Base path: /api/v1  
Headers: Authorization, X‑Tenant‑ID, Content‑Type

Tenants
GET /tenants
POST /tenants
GET /tenants/:id
PATCH /tenants/:id
DELETE /tenants/:id

Users & Roles
POST /users
GET /users
GET /users/:id
PATCH /users/:id
DELETE /users/:id
GET /roles
POST /roles

Assets
POST /assets
GET /assets
GET /assets/:id
PATCH /assets/:id
DELETE /assets/:id
POST /assets/:id/meter

Work Orders
POST /workorders
GET /workorders
GET /workorders/:id
PATCH /workorders/:id
POST /workorders/:id/assign
POST /workorders/:id/start
POST /workorders/:id/complete
POST /workorders/:id/cancel

PM
POST /pm
GET /pm
GET /pm/:id
PATCH /pm/:id
POST /pm/:id/complete

Inspections
POST /inspections/templates
GET /inspections/templates
POST /inspections
GET /inspections

Inventory
POST /parts
GET /parts
GET /parts/:id
PATCH /parts/:id
POST /parts/:id/stock

AIMI Diagnostics
POST /aimi/diagnostics
GET /aimi/diagnostics
GET /aimi/diagnostics/:id
POST /aimi/diagnostics/:id/resolve

Fleet Health
GET /fleethealth
POST /fleethealth/recalculate

Trip Readiness
POST /tripreadiness
GET /tripreadiness
GET /tripreadiness/:id

Health Check
GET /health

6. Workflow Logic
Work Orders
States: draft, open, in_progress, on_hold, completed, cancelled
Rules:

Managers cancel

Techs start/complete

AIMI auto‑creates WOs

Completing WOs updates meters, PM, fleet health

PM
Time/meter triggers auto‑create PM WOs

Completing PM updates lastCompletedAt and lastMeterReading

Inspections
Failed items auto‑create corrective WOs

Required inspections must be done before trip readiness

Inventory
Stock decreases when used

Stock increases when received

Reserved stock held for open WOs

Below reorderPoint → reorder flag

Fleet Health
Recalculates on WO, PM, inspection, diagnostic events

Trip Readiness
Ready if no critical/major WOs, inspections done, health ≥ threshold

Blocked if any fail

7. AIMI Intelligence Rules
Severity Model
Levels: info, minor, major, critical
Inputs: diagnostics, inspections, health, WOs, PM
Rules: safety faults → critical; repeated faults escalate

Fleet Health Scoring
Range: 0–100
Weights: overdue PM −10, critical WO −15, major WO −8, clean inspection +5

Trip Readiness
Uses health score, WOs, inspections, severity
Returns ready or blocked with reasons

PM Intelligence
Shorten intervals, escalate priority, flag repeated breakdowns

Diagnostic Intelligence
Map codes → severity + actions
Auto‑create WOs
Track resolution time

8. Multi‑Tenant Rules
Isolation
Every record has tenantId

All queries filtered by tenantId

APIs require X‑Tenant‑ID

Roles & Permissions
Tenant‑scoped roles

Permissions: workorders., assets., pm., inspections., inventory., aimi.

Tenant Configuration
Categories

Inspection templates

PM templates

Severity thresholds

9. Frontend / UI Blueprint
Tech Stack
React + TypeScript

Structure
/src/app
/src/components
/src/pages

Layout
Sidebar navigation
Top bar (tenant, user, search)
Main content area

Screens
Dashboard
Work Orders
Assets
PM
Inspections
Inventory
AIMI / Fleet Health
Trip Readiness
Admin / Tenant Config

10. Non‑Functional Requirements
Performance: responsive for large fleets
Security: role‑based access, tenant isolation
Reliability: logging, error handling, health checks
Maintainability: modular code
Scalability: multi‑tenant design

11. Build Instructions
Create backend project using Section 3 structure

Implement data models from Section 4

Implement APIs from Section 5

Implement workflows from Section 6

Implement AIMI engine from Section 7

Enforce multi‑tenant rules from Section 8

Create frontend project using Section 9

Connect frontend to backend APIs

Test full CMMS flow end‑to‑end