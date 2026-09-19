WFS CMMS — MASTER BLUEPRINT V2 (2026 REVISION)

The Complete System Architecture, AIMI Intelligence Model, Workflow Logic, and UI/UX Specification

Hybrid Format — Master File

Zero Drift Architecture

1. SYSTEM OVERVIEW

WFS CMMS is a next‑generation, AI‑driven, multi‑tenant fleet maintenance management system designed for:

- School districts

- Commercial fleets

- Enterprise transportation operations

- Mixed equipment fleets

It includes:

- AIMI (Artificial Intelligence Maintenance Intelligence)

- Full CMMS verticals (Assets, Workorders, PM, Parts, Scheduling, Telematics, Compliance, Reporting)

- Neon Dark Command Center UI

- Voice‑activated diagnostics

- Multilingual support

- Adaptive UI

- Technician Learning Engine

- 3D Fleet Visualization

- Predictive maintenance

- Role‑based dashboards

- Tenant‑safe architecture

- Modular, scalable, drift‑proof design

- Universal “Find Vehicle” system (GPS, telematics, breadcrumbs)

This blueprint defines the entire system at a high level.

Deep‑dive details are stored in the vertical blueprint files.

2. CORE PRINCIPLES

Zero Drift

All logic, naming, and structure must follow this blueprint.

Cursor and Copilot reference this file as the single source of truth.

Modular Architecture

Each vertical is isolated but integrated through AIMI and the event bus.

Tenant Isolation

Every table includes tenant_id.

All data is scoped per tenant.

Role‑Based Access Control (RBAC)

- Master Technician

- Technician

- Fleet Manager

- Administrator

- Driver

- Inspector

- AIMI System Role (internal)

Event‑Driven System

All major actions emit events.

AIMI listens and reacts.

AI‑First Design

AIMI is the core of the system.

Voice‑First Design

All major workflows support voice commands.

Multilingual Design

All UI text, diagnostics, and voice commands support multiple languages.

Technician‑Friendly UI

- Neon dark mode

- Large buttons

- High contrast

- HUD mode

- Hands‑free workflows

Future‑Proof

New modules can be added without rewriting existing ones.

3. SYSTEM ARCHITECTURE OVERVIEW

3.1 Frontend

- Next.js

- TailwindCSS

- Neon Dark Command Center theme

- Adaptive UI engine

- Voice command interface

- Multilingual UI engine

- 3D fleet visualization (Three.js)

- Role‑based dashboards

- “Find Vehicle” map system

3.2 Backend

- Node.js / TypeScript

- Modular service architecture

- AIMI intelligence engines

- Event bus

- API versioning

- Telematics ingestion pipeline

- Diagnostic engine

- Technician learning engine

- Bulk upload engine (Asset Manager)

3.3 Database

- PostgreSQL

- Tenant‑scoped tables

- Soft deletes

- Immutable audit logs

- AIMI learning tables

- Diagnostic tables

- Telematics tables

- PM tables

- Workorder tables

- Asset tables

- Parts tables

- Scheduling tables

- Import history tables (Asset Manager)

3.4 Integrations

- Telematics providers

- OEM diagnostic libraries

- Azure Speech (voice)

- Azure Translator (multilingual)

- Email/SMS notifications

- SSO (future phase)

4. AIMI — ARTIFICIAL INTELLIGENCE MAINTENANCE INTELLIGENCE

AIMI is the core intelligence layer of WFS CMMS.

4.1 Severity Engine

Determines severity levels based on:

- Telematics

- Driver defects

- Technician notes

- PM findings

- Predictive models

- Historical patterns

4.2 Routing Engine

Routes workorders based on:

- Technician skill

- Workload

- Bay availability

- Severity

- Asset status

- Predictive urgency

4.3 Scheduling Engine

Schedules PM, repairs, inspections, and predictive tasks.

4.4 Predictive Engine

Forecasts failures using:

- Telematics

- PM history

- Repair history

- Technician notes

- Asset age

- Asset usage

- Environmental factors

4.5 Diagnostic Engine

Generates diagnostic flows for:

- Engine faults

- Transmission faults

- Electrical faults

- HVAC faults

- Emissions faults

- Hybrid faults

- Predictive faults

- Driver‑reported symptoms

Includes the AIMI Diagnose Button workflow.

4.6 Technician Learning Engine

Learns from:

- Technician behavior

- Diagnostic choices

- Repair outcomes

- Time‑to‑repair

- Notes

- Photos

- Voice commands

- Fleet patterns

- Shop patterns

Improves diagnostic accuracy and technician performance.

4.7 Multilingual NLP Engine

Supports voice and text in multiple languages.

5. WORKORDER SYSTEM OVERVIEW

Workorders include:

- Asset

- Severity

- Diagnostics

- Parts

- Labor

- Notes

- Photos

- Telematics

- PM linkage

- Predictive linkage

- Technician assignment

- Routing

- Scheduling

- AIMI insights

- Voice commands

- Multilingual support

5.1 AIMI Diagnose Button

A neon button at the top of every workorder:

AIMI Diagnose Issue

Triggers:

- Guided diagnostic flow

- Voice‑activated diagnostics

- Multilingual diagnostics

- Technician learning

- Dynamic troubleshooting tree

- Repair recommendations

- Verification steps

- Closeout checklist

6. ASSET SYSTEM OVERVIEW

Assets include:

- Asset profile

- Asset group

- Meters

- Telematics link

- PM schedule

- Workorder history

- Diagnostic history

- Predictive health

- 3D visualization

- AIMI health score

- Multilingual labels

- Voice commands

- “Find Vehicle” integration

7. ASSET MANAGER — TENANT ONBOARDING ENGINE (NEW)

Asset Manager is the universal onboarding and asset‑management module.

7.1 Bulk Upload Engine

Supports CSV, XLSX, JSON for:

- Vehicles / assets

- Parts / inventory

- Employees / users

- PM schedules

- Vendors

- Configuration packs

7.2 Bulk Validation

AIMI‑assisted validation:

- VIN format

- Required fields

- Duplicate detection

- PM interval sanity checks

- Role validity

- Tenant isolation rules

7.3 Bulk Preview

Shows:

- Create

- Update

- Reject

- Warnings

- AIMI suggestions

7.4 Bulk Commit

- Atomic transaction

- Full audit log

- Event Bus publishing

7.5 Asset Editor

- Create/edit/delete vehicles

- Attach PM schedules

- Attach vendors

- Attach telematics IDs

7.6 Parts Editor

- Create/edit/delete parts

- Stock levels

- Vendor linkage

7.7 Employee Editor

- Create/edit/delete users

- Role assignment

7.8 PM Schedule Editor

- PM templates

- PM schedules

- Asset group assignment

7.9 Configuration Pack Builder

Reusable packs for:

- PM templates

- Severity thresholds

- Work order categories

- Telematics mappings

7.10 Import History

- Success/partial/failure

- Who ran it

- What changed

7.11 RBAC

Only:

- Fleet Manager

- Master Technician

- SysAdmin

can use Asset Manager.

8. PM SYSTEM OVERVIEW

PM includes:

- PM templates

- PM schedules

- PM triggers

- PM completion

- PM findings

- PM severity

- PM predictive linkage

- PM voice commands

- PM multilingual support

9. PARTS SYSTEM OVERVIEW

Parts include:

- Inventory

- Stock levels

- Reorder points

- Vendor info

- Part usage history

- Predictive usage

- Diagnostic linkage

- Repair linkage

- PM linkage

10. SCHEDULING SYSTEM OVERVIEW

Scheduling includes:

- Technician schedules

- Bay schedules

- Asset availability

- Predictive scheduling

- PM scheduling

- Workorder scheduling

- Voice scheduling

- Multilingual scheduling

11. TELEMATICS SYSTEM OVERVIEW

Telematics includes:

- DTC ingestion

- Live data

- Fault detection

- Predictive modeling

- AIMI severity

- AIMI diagnostics

- AIMI routing

- AIMI scheduling

- Technician learning

- Asset health scoring

12. COMPLIANCE SYSTEM OVERVIEW

Compliance includes:

- Inspections

- Forms

- Checklists

- Driver reports

- DOT compliance

- School district compliance

- Multilingual compliance

- Voice compliance

13. UI/UX — NEON DARK COMMAND CENTER

UI includes:

- Neon purple accents

- Dark background

- Glowing buttons

- Adaptive UI

- Technician HUD mode

- Multilingual toggle

- Voice command button

- AIMI insight feed

- 3D fleet visualization

- Role‑based dashboards

14. VOICE SYSTEM OVERVIEW

Voice commands include:

- Create workorder

- Diagnose issue

- Next step

- Assign technician

- Close workorder

- Schedule PM

- Check asset health

- Check severity

- Check predictive alerts

- Multilingual voice commands

15. MULTILINGUAL SYSTEM OVERVIEW

Supports:

- English

- Spanish

- French

- German

- Portuguese

- Mandarin

- Arabic

All UI text, diagnostics, and voice commands are translated.

16. ADAPTIVE UI SYSTEM OVERVIEW

Adaptive UI adjusts:

- Brightness

- Contrast

- Neon intensity

- Button size

- Layout density

- Shop mode

- Office mode

- Night mode

- HUD mode

17. 3D FLEET VISUALIZATION

Includes:

- Asset icons

- Bay layout

- Technician positions

- Severity colors

- Predictive overlays

- Telematics heatmaps

- Click‑to‑open workorder

- Click‑to‑open asset detail

18. EVENT BUS

All major actions emit events:

- workorder.created

- workorder.updated

- workorder.completed

- telematics.event

- pm.completed

- asset.updated

- diagnostic.completed

- [technician.feedback](http://technician.feedback)

- predictive.alert

- bulk_import_completed

- bulk_import_failed

- configuration_pack_applied

AIMI listens and reacts.

19. DATABASE OVERVIEW

All tables include:

- id

- tenant_id

- created_at

- updated_at

- deleted_at (soft delete)

- audit_log (immutable)

AIMI tables include:

- DiagnosticFlows

- DiagnosticSteps

- DiagnosticHistory

- DiagnosticVoiceLogs

- TechnicianLearningProfile

- AIMILearningWeights

- PredictiveModels

- SeverityHistory

- RoutingHistory

Asset Manager tables include:

- ImportHistory

- ConfigurationPacks

20. API OVERVIEW

API is versioned:

- /api/v1/...

- /api/v2/... (future)

Includes:

- assets

- workorders

- pm

- parts

- scheduling

- telematics

- diagnostics

- aimi

- multilingual

- voice

- adaptive-ui

- 3d-visualization

- asset-manager

21. FUTURE EXPANSION

Blueprint V2 is designed for:

- New AI engines

- New dashboards

- New workflows

- New diagnostics

- New languages

- New UI modes

- New verticals

- New integrations

No rewrites required.

22. SYSTEM STABILIZATION PHASE

System Stabilization Phase is an official named phase of Master Blueprint V2 (2026 Revision).

It executes after the Global Dashboard Integration Phase.

This phase is additive. It must not modify or rename existing modules.

All naming, structure, modules, RBAC, EventBus types, and architecture remain as defined in this blueprint.

23. PRODUCTION HARDENING PHASE

Production Hardening Phase is an official named phase of Master Blueprint V2 (2026 Revision).

It executes after the System Stabilization Phase.

This phase is additive. It must not modify or rename existing modules.

All naming, structure, modules, RBAC, EventBus types, and architecture remain as defined in this blueprint.

END OF MASTER BLUEPRINT V2 (2026 REVISION)



