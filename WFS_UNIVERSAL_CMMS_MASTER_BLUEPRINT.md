SYSTEM IDENTITY

Walters Fleet Solutions (WFS) is a universal, multi‑tenant Computerized Maintenance Management System (CMMS) designed to manage any fleet type, any size, in any operational environment.

Supported fleet types include:

School districts

City and county fleets

Police and fire fleets

Utility fleets

Construction fleets

Commercial fleets

Private fleets

Mixed‑asset fleets

WFS is built as a universal platform with:

Multi‑tenant architecture

Multi‑fleet support

Multi‑role support

Modular engine architecture

Unified event bus

Unified API layer

Unified database schema

AIMI intelligence integration

Zero‑drift blueprint enforcement

WFS CORE PRINCIPLES

Universal applicability

Scalable architecture

Intelligence‑enhanced operations

Modular engine design

Event‑driven orchestration

Governed safety, compliance, readiness, and fleet health

Zero‑drift system behavior defined by blueprint

GLOBAL SYSTEM RULES

All engines must follow the master blueprint.

AIMI governs safety, compliance, readiness, and fleet health.

No engine may override AIMI governance.

All events must be logged and auditable.

All tenants are isolated at the data and logic layers.

All routing, dispatch, and operational decisions must pass AIMI checks.

All intelligence objects must include tier, phase, confidence, explanation, and audit.

All engines must expose standardized API endpoints.

All engines must publish events to the event bus.

Cursor must generate code according to the blueprint with zero drift.

GLOBAL ARCHITECTURE OVERVIEW

WFS consists of:

Operational Engines

Safety & Compliance Engines

Environmental Engines

Financial Engines

Telemetry Engines

System Engines

AIMI Intelligence Engine

All engines communicate through:

Unified Event Bus

Unified API Layer

Unified Database Schema

Unified Intelligence Layer

WFS uses a microservice architecture:

Each engine is an independent service.

Each service has its own domain.

Each domain publishes events.

AIMI consumes all events.

AIMI produces intelligence objects.

Engines react to intelligence objects.

WFS DATA MODEL OVERVIEW

The WFS data model includes:

Assets

Work orders

PM schedules

DVIR submissions

Fault codes

Breakdowns

Inventory

Vendors

Technicians

Drivers

Routes

Dispatch schedules

Telematics data

Environmental data

Safety rules

Compliance rules

Readiness rules

Fleet health rules

AIMI intelligence objects

Audit logs

Tenant configuration

WFS EVENT MODEL OVERVIEW

All engines publish events such as:

work_order.created

pm.generated

dvir.submitted

fault.detected

breakdown.occurred

inventory.used

vendor.assigned

technician.assigned

driver.assigned

route.generated

dispatch.scheduled

telematics.alert

weather.alert

traffic.alert

environment.alert

aimi.intelligence.generated

AIMI consumes all events and produces:

Intelligence objects

Governance decisions

Safety flags

Compliance flags

Readiness flags

Fleet health flags

Autonomous actions (if allowed)

WFS ENGINE ARCHITECTURE

Each engine includes:

Input layer

Processing layer

Output layer

Governance layer

AIMI integration layer

API layer

Event publishing layer

Audit layer

WFS TENANT ARCHITECTURE

Each tenant includes:

Tenant configuration

Tenant assets

Tenant users

Tenant roles

Tenant rules

Tenant data isolation

Tenant intelligence isolation

WFS SECURITY ARCHITECTURE

Includes:

Role‑based access control

Tenant isolation

Audit logging

Event integrity

AIMI governance enforcement

Compliance enforcement

Safety enforcement

CORE ENGINES

OPERATIONAL ENGINES

WORK ORDER ENGINE

Creates, manages, updates, and closes work orders.

Handles labor, parts, vendor usage, technician assignment, driver assignment, and asset downtime.

Publishes work order events.

PM ENGINE

Generates preventive maintenance schedules.

Tracks PM compliance.

Creates PM work orders.

Publishes PM events.

DVIR ENGINE

Processes driver vehicle inspection reports.

Creates DVIR defects.

Routes defects to work orders.

Publishes DVIR events.

FAULT CODE ENGINE

Receives telematics fault codes.

Classifies severity.

Creates fault events.

Routes faults to work orders.

Publishes fault events.

BREAKDOWN ENGINE

Handles breakdown events.

Creates emergency work orders.

Triggers routing, dispatch, vendor, and technician workflows.

Publishes breakdown events.

INVENTORY ENGINE

Manages inventory quantities, usage, cost, and criticality.

Handles reorder logic.

Publishes inventory events.

VENDOR ENGINE

Manages vendor profiles, certifications, cost, performance, and assignments.

Publishes vendor events.

TECHNICIAN ENGINE

Manages technician profiles, certifications, availability, and assignments.

Publishes technician events.

DRIVER ENGINE

Manages driver profiles, certifications, safety records, and assignments.

Publishes driver events.

ROUTING ENGINE

Generates routes for technicians, drivers, and assets.

Publishes routing events.

DISPATCH ENGINE

Schedules dispatch actions.

Coordinates technician and driver movement.

Publishes dispatch events.

SCHEDULING ENGINE

Manages calendars, assignments, and operational timing.

Publishes scheduling events.

SAFETY & COMPLIANCE ENGINES

SAFETY ENGINE

Defines safety rules.

Evaluates safety violations.

Publishes safety events.

COMPLIANCE ENGINE

Defines compliance rules.

Evaluates compliance violations.

Publishes compliance events.

CERTIFICATION ENGINE

Tracks certifications for technicians, drivers, and vendors.

Publishes certification events.

READINESS ENGINE

Calculates readiness for assets, technicians, drivers, vendors, and routes.

Publishes readiness events.

FLEET HEALTH ENGINE

Calculates fleet health based on faults, breakdowns, PM compliance, DVIR defects, and work order history.

Publishes fleet health events.

ENVIRONMENTAL ENGINES

WEATHER ENGINE

Receives weather data.

Publishes weather alerts.

TRAFFIC ENGINE

Receives traffic data.

Publishes traffic alerts.

ENVIRONMENT ENGINE

Receives environmental hazard data.

Publishes environment alerts.

ROAD CONDITION ENGINE

Receives road condition data.

Publishes road condition alerts.

FINANCIAL ENGINES

COST ENGINE

Calculates cost for work orders, PMs, inventory, vendors, and labor.

Publishes cost events.

BUDGET ENGINE

Tracks budgets and spending.

Publishes budget events.

PARTS COST ENGINE

Tracks part cost changes.

Publishes parts cost events.

VENDOR COST ENGINE

Tracks vendor cost performance.

Publishes vendor cost events.

TELEMETRY ENGINES

TELEMATICS ENGINE

Receives telematics data.

Publishes telematics alerts.

GPS ENGINE

Receives GPS location data.

Publishes GPS events.

SENSOR ENGINE

Receives sensor data.

Publishes sensor alerts.

ALERT ENGINE

Normalizes alerts from all telemetry sources.

Publishes unified alert events.

SYSTEM ENGINES

NOTIFICATION ENGINE

Sends notifications to users.

Publishes notification events.

AUDIT ENGINE

Logs all system actions.

Publishes audit events.

LOGGING ENGINE

Handles system logs.

Publishes logging events.

SECURITY ENGINE

Manages authentication, authorization, and role enforcement.

Publishes security events.

USER ENGINE

Manages user profiles.

Publishes user events.

ROLE ENGINE

Manages roles and permissions.

Publishes role events.

MULTI‑TENANT ENGINE

Manages tenant isolation and configuration.

Publishes tenant events.

AIMI INTELLIGENCE ENGINE

AIMI is the unified intelligence layer for WFS. AIMI consumes all events from all engines, processes them through structured tiers and phases, and produces intelligence objects, governance decisions, readiness evaluations, safety evaluations, compliance evaluations, fleet health evaluations, and autonomous actions when allowed.

AIMI STRUCTURE

AIMI consists of:

Tier 1 — Interpretation Layer

Tier 2 — Classification Layer

Tier 3 — Evaluation Layer

Tier 4 — Prediction Layer

Tier 5 — Optimization Layer

Tier 6 — Autonomous Action Layer

Each tier contains multiple phases. Each phase produces intelligence objects with:

tier

phase

confidence

explanation

audit

tenant_id

asset_id

operator_id

timestamp

AIMI TIER 1 — INTERPRETATION LAYER

Tier 1 interprets raw events from all engines and converts them into structured intelligence inputs.

Tier 1 INPUT SOURCES

Tier 1 receives interpreted events from:

Work Order Engine

PM Engine

DVIR Engine

Fault Code Engine

Breakdown Engine

Inventory Engine

Vendor Engine

Technician Engine

Driver Engine

Routing Engine

Dispatch Engine

Scheduling Engine

Safety Engine

Compliance Engine

Certification Engine

Readiness Engine

Fleet Health Engine

Weather Engine

Traffic Engine

Environment Engine

Road Condition Engine

Telematics Engine

GPS Engine

Sensor Engine

Alert Engine

Tier 1 PROCESSING

Event normalization

Event classification

Event tagging

Event context extraction

Event correlation

Event timestamp alignment

Event source validation

Event integrity checks

Tier 1 OUTPUTS

interpreted_event

interpreted_severity

interpreted_context

interpreted_source

interpreted_timestamp

interpreted_asset

interpreted_operator

interpreted_environment

Tier 1 PHASES

Phase 100 — Event Normalization

Phase 110 — Event Classification

Phase 120 — Event Tagging

Phase 130 — Event Context Extraction

Phase 140 — Event Correlation

Phase 150 — Event Integrity Validation

Phase 160 — Event Publishing to Tier 2

AIMI TIER 2 — CLASSIFICATION LAYER

Tier 2 classifies interpreted events from Tier 1 into structured categories.

Tier 2 PROCESSING

Event category classification

Operational impact classification

Safety impact classification

Compliance impact classification

Readiness impact classification

Fleet health impact classification

Environmental impact classification

Temporal classification

Spatial classification

Tier 2 CLASSIFICATION TYPES

Event categories:

Operational event

Maintenance event

Safety event

Compliance event

Readiness event

Fleet health event

Environmental event

Telemetry event

Routing event

Dispatch event

Scheduling event

Severity levels:

Low

Medium

High

Critical

Operational impact:

No impact

Minor impact

Moderate impact

Major impact

Operational stop

Safety impact:

No safety risk

Potential safety risk

Active safety risk

Critical safety violation

Compliance impact:

No compliance issue

Potential compliance issue

Active compliance issue

Critical compliance violation

Readiness impact:

No readiness impact

Reduced readiness

Low readiness

Zero readiness

Fleet health impact:

No health impact

Minor health impact

Moderate health impact

Major health impact

Critical health failure

Environmental impact:

No environmental impact

Environmental hazard

Environmental threat

Environmental stop

Tier 2 OUTPUTS

classified_event

classified_category

classified_severity

classified_operational_impact

classified_safety_impact

classified_compliance_impact

classified_readiness_impact

classified_fleet_health_impact

classified_environmental_impact

classified_timestamp

classified_asset

classified_operator

Tier 2 PHASES

Phase 200 — Category Classification

Phase 210 — Severity Classification

Phase 220 — Operational Impact Classification

Phase 230 — Safety Impact Classification

Phase 240 — Compliance Impact Classification

Phase 250 — Readiness Impact Classification

Phase 260 — Fleet Health Impact Classification

Phase 270 — Environmental Impact Classification

Phase 280 — Publishing to Tier 3

AIMI TIER 3 — EVALUATION LAYER

Tier 3 evaluates classified events to determine operational, safety, compliance, readiness, fleet health, and environmental status.

Tier 3 PROCESSING

Operational evaluation

Safety evaluation

Compliance evaluation

Readiness evaluation

Fleet health evaluation

Environmental evaluation

Multi‑factor evaluation

Cross‑engine evaluation

Historical evaluation

Threshold evaluation

Tier 3 OUTPUTS

evaluated_operational_status

evaluated_safety_status

evaluated_compliance_status

evaluated_readiness_status

evaluated_fleet_health_status

evaluated_environmental_status

evaluated_timestamp

evaluated_asset

evaluated_operator

Tier 3 STATUS TYPES

Operational status:

Operational

Operational degraded

Operational limited

Operational stop

Safety status:

Safe

Potentially unsafe

Unsafe

Critical unsafe

Compliance status:

Compliant

Potentially non‑compliant

Non‑compliant

Critical non‑compliant

Readiness status:

Ready

Partially ready

Low readiness

Zero readiness

Fleet health status:

Healthy

Minor issues

Moderate issues

Major issues

Critical failure

Environmental status:

Clear

Hazard present

Threat present

Environmental stop

Tier 3 PHASES

Phase 300 — Operational Evaluation

Phase 310 — Safety Evaluation

Phase 320 — Compliance Evaluation

Phase 330 — Readiness Evaluation

Phase 340 — Fleet Health Evaluation

Phase 350 — Environmental Evaluation

Phase 360 — Multi‑Factor Evaluation

Phase 370 — Publishing to Tier 4

AIMI TIER 4 — PREDICTION LAYER

Tier 4 predicts future operational, maintenance, safety, compliance, readiness, fleet health, and environmental outcomes.

Tier 4 PROCESSING

Predictive modeling

Failure prediction

Breakdown prediction

PM prediction

DVIR defect prediction

Fault escalation prediction

Safety risk prediction

Compliance risk prediction

Readiness degradation prediction

Fleet health degradation prediction

Environmental risk prediction

Tier 4 OUTPUTS

predicted_failure

predicted_breakdown

predicted_pm_need

predicted_dvir_defect

predicted_fault_escalation

predicted_safety_risk

predicted_compliance_risk

predicted_readiness_drop

predicted_fleet_health_drop

predicted_environmental_risk

predicted_timestamp

predicted_asset

predicted_operator

Tier 4 PHASES

Phase 400 — Failure Prediction

Phase 410 — Breakdown Prediction

Phase 420 — PM Prediction

Phase 430 — DVIR Defect Prediction

Phase 440 — Fault Escalation Prediction

Phase 450 — Safety Risk Prediction

Phase 460 — Compliance Risk Prediction

Phase 470 — Readiness Drop Prediction

Phase 480 — Fleet Health Drop Prediction

Phase 490 — Environmental Risk Prediction

Phase 495 — Publishing to Tier 5

AIMI TIER 5 — OPTIMIZATION LAYER

Tier 5 optimizes operational decisions based on predictions and evaluations.

Tier 5 PROCESSING

Route optimization

Dispatch optimization

Technician optimization

Driver optimization

Vendor optimization

Inventory optimization

PM optimization

Work order optimization

Safety optimization

Compliance optimization

Readiness optimization

Fleet health optimization

Tier 5 OUTPUTS

optimized_route

optimized_dispatch

optimized_technician_assignment

optimized_driver_assignment

optimized_vendor_assignment

optimized_inventory_usage

optimized_pm_schedule

optimized_work_order

optimized_safety_action

optimized_compliance_action

optimized_readiness_action

optimized_fleet_health_action

Tier 5 PHASES

Phase 500 — Route Optimization

Phase 510 — Dispatch Optimization

Phase 520 — Technician Optimization

Phase 530 — Driver Optimization

Phase 540 — Vendor Optimization

Phase 550 — Inventory Optimization

Phase 560 — PM Optimization

Phase 570 — Work Order Optimization

Phase 580 — Safety Optimization

Phase 590 — Compliance Optimization

Phase 595 — Readiness Optimization

Phase 597 — Fleet Health Optimization

Phase 599 — Publishing to Tier 6

AIMI TIER 6 — AUTONOMOUS ACTION LAYER

Tier 6 generates autonomous actions when allowed by tenant configuration and governance rules.

Tier 6 PROCESSING

Autonomous work order creation

Autonomous PM creation

Autonomous routing

Autonomous dispatch

Autonomous technician assignment

Autonomous driver assignment

Autonomous vendor assignment

Autonomous inventory reservation

Autonomous safety enforcement

Autonomous compliance enforcement

Autonomous readiness enforcement

Autonomous fleet health enforcement

Tier 6 OUTPUTS

autonomous_action

autonomous_work_order

autonomous_pm

autonomous_route

autonomous_dispatch

autonomous_technician_assignment

autonomous_driver_assignment

autonomous_vendor_assignment

autonomous_inventory_reservation

autonomous_safety_enforcement

autonomous_compliance_enforcement

autonomous_readiness_enforcement

autonomous_fleet_health_enforcement

Tier 6 PHASES

Phase 600 — Autonomous Action Generation

Phase 610 — Autonomous Work Order Creation

Phase 620 — Autonomous PM Creation

Phase 630 — Autonomous Routing

Phase 640 — Autonomous Dispatch

Phase 650 — Autonomous Technician Assignment

Phase 660 — Autonomous Driver Assignment

Phase 670 — Autonomous Vendor Assignment

Phase 680 — Autonomous Inventory Reservation

Phase 690 — Autonomous Safety Enforcement

Phase 695 — Autonomous Compliance Enforcement

Phase 697 — Autonomous Readiness Enforcement

Phase 699 — Autonomous Fleet Health Enforcement

AIMI INTEGRATION WITH ALL ENGINES

AIMI integrates with every engine in WFS. Each engine publishes events to AIMI, and AIMI returns intelligence objects, governance decisions, readiness evaluations, safety evaluations, compliance evaluations, fleet health evaluations, optimizations, and autonomous actions when allowed.

AIMI INTEGRATION RULES

All engines must publish events to AIMI.

All engines must consume AIMI intelligence objects relevant to their domain.

All engines must enforce AIMI governance decisions.

All engines must apply AIMI safety, compliance, readiness, and fleet health rules.

All engines must support AIMI autonomous actions when enabled.

All engines must log AIMI interactions in the audit layer.

All engines must expose AIMI integration endpoints.

AIMI INTEGRATION OBJECT TYPES

AIMI produces:

interpreted_event

classified_event

evaluated_status

predicted_outcome

optimized_action

autonomous_action

AIMI produces domain‑specific intelligence objects for:

Work orders

PM schedules

DVIR defects

Fault codes

Breakdowns

Inventory usage

Vendor assignments

Technician assignments

Driver assignments

Routes

Dispatch schedules

Safety rules

Compliance rules

Readiness rules

Fleet health rules

Environmental conditions

AIMI INTEGRATION WITH WORK ORDER ENGINE

Work Order Engine publishes:

work_order.created

work_order.updated

work_order.closed

work_order.delayed

work_order.blocked

AIMI returns:

evaluated_operational_status

evaluated_safety_status

evaluated_compliance_status

evaluated_readiness_status

evaluated_fleet_health_status

predicted_failure

predicted_breakdown

optimized_work_order

autonomous_work_order (if allowed)

Work Order Engine must:

Apply AIMI safety restrictions.

Apply AIMI compliance restrictions.

Apply AIMI readiness restrictions.

Apply AIMI fleet health restrictions.

Apply AIMI optimized work order actions.

Create autonomous work orders when allowed.

AIMI INTEGRATION WITH PM ENGINE

PM Engine publishes:

pm.generated

pm.compliance.changed

pm.overdue

pm.completed

AIMI returns:

predicted_pm_need

optimized_pm_schedule

autonomous_pm (if allowed)

PM Engine must:

Adjust PM schedules based on AIMI predictions.

Apply AIMI optimized PM intervals.

Create autonomous PMs when allowed.

AIMI INTEGRATION WITH DVIR ENGINE

DVIR Engine publishes:

dvir.submitted

dvir.defect.created

dvir.defect.severity.changed

AIMI returns:

evaluated_safety_status

evaluated_compliance_status

predicted_dvir_defect

optimized_safety_action

optimized_compliance_action

DVIR Engine must:

Route defects according to AIMI evaluations.

Apply AIMI safety and compliance rules.

AIMI INTEGRATION WITH FAULT CODE ENGINE

Fault Code Engine publishes:

fault.detected

fault.severity.changed

fault.cleared

AIMI returns:

predicted_fault_escalation

evaluated_fleet_health_status

optimized_work_order

autonomous_work_order (if allowed)

Fault Code Engine must:

Escalate faults according to AIMI predictions.

Trigger work orders based on AIMI evaluations.

AIMI INTEGRATION WITH BREAKDOWN ENGINE

Breakdown Engine publishes:

breakdown.occurred

breakdown.severity.changed

AIMI returns:

predicted_breakdown

optimized_dispatch

optimized_route

optimized_vendor_assignment

optimized_technician_assignment

autonomous_dispatch (if allowed)

Breakdown Engine must:

Trigger routing and dispatch based on AIMI optimization.

Apply AIMI autonomous actions when allowed.

AIMI INTEGRATION WITH INVENTORY ENGINE

Inventory Engine publishes:

inventory.used

inventory.low

inventory.critical

inventory.restocked

AIMI returns:

optimized_inventory_usage

optimized_inventory_reservation

predicted_inventory_need

Inventory Engine must:

Reserve inventory according to AIMI optimization.

Trigger restock workflows based on AIMI predictions.

AIMI INTEGRATION WITH VENDOR ENGINE

Vendor Engine publishes:

vendor.assigned

vendor.performance.changed

vendor.cost.changed

AIMI returns:

optimized_vendor_assignment

evaluated_compliance_status

evaluated_readiness_status

Vendor Engine must:

Assign vendors according to AIMI optimization.

Apply AIMI compliance and readiness rules.

AIMI INTEGRATION WITH TECHNICIAN ENGINE

Technician Engine publishes:

technician.assigned

technician.availability.changed

technician.certification.changed

AIMI returns:

optimized_technician_assignment

evaluated_readiness_status

evaluated_safety_status

Technician Engine must:

Assign technicians according to AIMI optimization.

Apply AIMI readiness and safety rules.

AIMI INTEGRATION WITH DRIVER ENGINE

Driver Engine publishes:

driver.assigned

driver.availability.changed

[driver.safety](http://driver.safety).changed

driver.certification.changed

AIMI returns:

optimized_driver_assignment

evaluated_safety_status

evaluated_compliance_status

evaluated_readiness_status

Driver Engine must:

Assign drivers according to AIMI optimization.

Apply AIMI safety, compliance, and readiness rules.

AIMI INTEGRATION WITH ROUTING ENGINE

Routing Engine publishes:

route.generated

route.updated

route.blocked

AIMI returns:

optimized_route

predicted_route_risk

autonomous_route (if allowed)

Routing Engine must:

Generate routes according to AIMI optimization.

Apply AIMI autonomous routing when allowed.

AIMI INTEGRATION WITH DISPATCH ENGINE

Dispatch Engine publishes:

dispatch.scheduled

dispatch.updated

dispatch.blocked

AIMI returns:

optimized_dispatch

predicted_dispatch_risk

autonomous_dispatch (if allowed)

Dispatch Engine must:

Schedule dispatch according to AIMI optimization.

Apply AIMI autonomous dispatch when allowed.

AIMI INTEGRATION WITH SCHEDULING ENGINE

Scheduling Engine publishes:

schedule.created

schedule.updated

schedule.conflict

AIMI returns:

optimized_schedule

predicted_schedule_conflict

Scheduling Engine must:

Resolve conflicts according to AIMI predictions.

Apply AIMI optimized scheduling.

AIMI INTEGRATION WITH SAFETY ENGINE

Safety Engine publishes:

safety.violation

safety.rule.updated

AIMI returns:

evaluated_safety_status

optimized_safety_action

autonomous_safety_enforcement (if allowed)

Safety Engine must:

Apply AIMI safety evaluations.

Enforce AIMI safety actions.

AIMI INTEGRATION WITH COMPLIANCE ENGINE

Compliance Engine publishes:

compliance.violation

compliance.rule.updated

AIMI returns:

evaluated_compliance_status

optimized_compliance_action

autonomous_compliance_enforcement (if allowed)

Compliance Engine must:

Apply AIMI compliance evaluations.

Enforce AIMI compliance actions.

AIMI INTEGRATION WITH CERTIFICATION ENGINE

Certification Engine publishes:

certification.updated

certification.expired

AIMI returns:

evaluated_readiness_status

evaluated_compliance_status

Certification Engine must:

Apply AIMI readiness and compliance evaluations.

AIMI INTEGRATION WITH READINESS ENGINE

Readiness Engine publishes:

readiness.changed

AIMI returns:

evaluated_readiness_status

predicted_readiness_drop

optimized_readiness_action

autonomous_readiness_enforcement (if allowed)

Readiness Engine must:

Apply AIMI readiness evaluations.

Enforce AIMI readiness actions.

AIMI INTEGRATION WITH FLEET HEALTH ENGINE

Fleet Health Engine publishes:

fleet_health.changed

AIMI returns:

evaluated_fleet_health_status

predicted_fleet_health_drop

optimized_fleet_health_action

autonomous_fleet_health_enforcement (if allowed)

Fleet Health Engine must:

Apply AIMI fleet health evaluations.

Enforce AIMI fleet health actions.

AIMI INTEGRATION WITH ENVIRONMENTAL ENGINES

Weather Engine publishes:

weather.alert

Traffic Engine publishes:

traffic.alert

Environment Engine publishes:

environment.alert

Road Condition Engine publishes:

road_condition.alert

AIMI returns:

evaluated_environmental_status

predicted_environmental_risk

optimized_environmental_action

Environmental engines must:

Apply AIMI environmental evaluations.

Trigger environmental actions based on AIMI predictions.

AIMI INTEGRATION WITH TELEMETRY ENGINES

Telematics Engine publishes:

telematics.alert

GPS Engine publishes:

gps.location

Sensor Engine publishes:

sensor.alert

Alert Engine publishes:

alert.normalized

AIMI returns:

evaluated_operational_status

evaluated_safety_status

evaluated_fleet_health_status

predicted_failure

predicted_breakdown

Telemetry engines must:

Apply AIMI evaluations.

Trigger actions based on AIMI predictions.

AIMI INTEGRATION WITH SYSTEM ENGINES

Notification Engine publishes:

notification.sent

Audit Engine publishes:

audit.logged

Logging Engine publishes:

log.entry

Security Engine publishes:

security.event

User Engine publishes:

user.updated

Role Engine publishes:

role.updated

Multi‑Tenant Engine publishes:

tenant.updated

AIMI returns:

governance decisions

intelligence objects

autonomous actions (if allowed)

System engines must:

Apply AIMI governance.

Log AIMI interactions.

Enforce AIMI rules.

DATABASE SCHEMA

The WFS database schema is fully normalized and multi‑tenant. All tables include:

tenant_id

created_at

updated_at

audit fields

ASSET TABLE

asset_id

tenant_id

asset_type

asset_subtype

make

model

year

vin

serial_number

status

readiness_status

fleet_health_status

WORK ORDER TABLE

work_order_id

tenant_id

asset_id

status

priority

labor_hours

parts_cost

vendor_id

technician_id

driver_id

downtime_start

downtime_end

operational_status

safety_status

compliance_status

readiness_status

fleet_health_status

PM TABLE

pm_id

tenant_id

asset_id

pm_type

interval_miles

interval_hours

interval_days

last_completed

next_due

pm_status

DVIR TABLE

dvir_id

tenant_id

asset_id

driver_id

defect_id

severity

status

FAULT TABLE

fault_id

tenant_id

asset_id

fault_code

severity

status

BREAKDOWN TABLE

breakdown_id

tenant_id

asset_id

severity

status

INVENTORY TABLE

inventory_id

tenant_id

part_number

description

quantity

criticality

cost

VENDOR TABLE

vendor_id

tenant_id

name

certifications

performance_score

cost_rating

TECHNICIAN TABLE

technician_id

tenant_id

name

certifications

availability

safety_status

readiness_status

DRIVER TABLE

driver_id

tenant_id

name

certifications

safety_status

readiness_status

ROUTE TABLE

route_id

tenant_id

asset_id

technician_id

driver_id

status

risk_level

DISPATCH TABLE

dispatch_id

tenant_id

asset_id

technician_id

driver_id

status

risk_level

SCHEDULE TABLE

schedule_id

tenant_id

entity_type

entity_id

start_time

end_time

status

SAFETY RULE TABLE

safety_rule_id

tenant_id

rule_name

rule_description

severity

COMPLIANCE RULE TABLE

compliance_rule_id

tenant_id

rule_name

rule_description

severity

READINESS RULE TABLE

readiness_rule_id

tenant_id

rule_name

rule_description

severity

FLEET HEALTH RULE TABLE

fleet_health_rule_id

tenant_id

rule_name

rule_description

severity

WEATHER TABLE

weather_id

tenant_id

condition

severity

TRAFFIC TABLE

traffic_id

tenant_id

condition

severity

ENVIRONMENT TABLE

environment_id

tenant_id

condition

severity

ROAD CONDITION TABLE

road_condition_id

tenant_id

condition

severity

TELEMATICS TABLE

telematics_id

tenant_id

asset_id

alert_type

severity

GPS TABLE

gps_id

tenant_id

asset_id

latitude

longitude

timestamp

SENSOR TABLE

sensor_id

tenant_id

asset_id

sensor_type

value

severity

ALERT TABLE

alert_id

tenant_id

source

severity

status

AIMI INTELLIGENCE OBJECT TABLE

intelligence_id

tenant_id

asset_id

operator_id

tier

phase

object_type

confidence

explanation

payload

timestamp

AUDIT TABLE

audit_id

tenant_id

entity_type

entity_id

action

timestamp

user_id

details

TENANT TABLE

tenant_id

name

configuration

governance_settings

API BLUEPRINT

All engines expose REST, GraphQL, and WebSocket endpoints.

REST ENDPOINTS

GET /assets

POST /assets

GET /assets/{id}

PUT /assets/{id}

GET /workorders

POST /workorders

GET /workorders/{id}

PUT /workorders/{id}

GET /pm

POST /pm

GET /pm/{id}

PUT /pm/{id}

GET /dvir

POST /dvir

GET /dvir/{id}

PUT /dvir/{id}

GET /faults

POST /faults

GET /faults/{id}

PUT /faults/{id}

GET /breakdowns

POST /breakdowns

GET /breakdowns/{id}

PUT /breakdowns/{id}

GET /inventory

POST /inventory

GET /inventory/{id}

PUT /inventory/{id}

GET /vendors

POST /vendors

GET /vendors/{id}

PUT /vendors/{id}

GET /technicians

POST /technicians

GET /technicians/{id}

PUT /technicians/{id}

GET /drivers

POST /drivers

GET /drivers/{id}

PUT /drivers/{id}

GET /routes

POST /routes

GET /routes/{id}

PUT /routes/{id}

GET /dispatch

POST /dispatch

GET /dispatch/{id}

PUT /dispatch/{id}

GET /schedule

POST /schedule

GET /schedule/{id}

PUT /schedule/{id}

GET /safety

POST /safety

GET /safety/{id}

PUT /safety/{id}

GET /compliance

POST /compliance

GET /compliance/{id}

PUT /compliance/{id}

GET /readiness

POST /readiness

GET /readiness/{id}

PUT /readiness/{id}

GET /fleethealth

POST /fleethealth

GET /fleethealth/{id}

PUT /fleethealth/{id}

GET /environment

POST /environment

GET /environment/{id}

PUT /environment/{id}

GET /telematics

POST /telematics

GET /telematics/{id}

PUT /telematics/{id}

GET /gps

POST /gps

GET /gps/{id}

PUT /gps/{id}

GET /sensor

POST /sensor

GET /sensor/{id}

PUT /sensor/{id}

GET /alerts

POST /alerts

GET /alerts/{id}

PUT /alerts/{id}

GET /aimi/intelligence

POST /aimi/intelligence

GraphQL Schema

type Asset { ... }

type WorkOrder { ... }

type PM { ... }

type DVIR { ... }

type Fault { ... }

type Breakdown { ... }

type Inventory { ... }

type Vendor { ... }

type Technician { ... }

type Driver { ... }

type Route { ... }

type Dispatch { ... }

type Schedule { ... }

type SafetyRule { ... }

type ComplianceRule { ... }

type ReadinessRule { ... }

type FleetHealthRule { ... }

type Environment { ... }

type Telematics { ... }

type GPS { ... }

type Sensor { ... }

type Alert { ... }

type Intelligence { ... }

WebSocket Channels

ws://events/workorders

ws://events/pm

ws://events/dvir

ws://events/faults

ws://events/breakdowns

ws://events/inventory

ws://events/vendors

ws://events/technicians

ws://events/drivers

ws://events/routes

ws://events/dispatch

ws://events/schedule

ws://events/safety

ws://events/compliance

ws://events/readiness

ws://events/fleethealth

ws://events/environment

ws://events/telematics

ws://events/gps

ws://events/sensor

ws://events/alerts

ws://events/aimi

UI BLUEPRINT

UI PORTALS

Asset Portal

Work Order Portal

PM Portal

DVIR Portal

Fault Portal

Breakdown Portal

Inventory Portal

Vendor Portal

Technician Portal

Driver Portal

Routing Portal

Dispatch Portal

Scheduling Portal

Safety Portal

Compliance Portal

Readiness Portal

Fleet Health Portal

Environmental Portal

Telemetry Portal

AIMI Intelligence Portal

Tenant Admin Portal

UI COMPONENTS

Asset list

Asset detail

Work order list

Work order detail

PM schedule

DVIR submission

Fault viewer

Breakdown viewer

Inventory dashboard

Vendor dashboard

Technician dashboard

Driver dashboard

Route viewer

Dispatch viewer

Schedule calendar

Safety dashboard

Compliance dashboard

Readiness dashboard

Fleet health dashboard

Environmental dashboard

Telemetry dashboard

AIMI intelligence viewer

Tenant configuration

UI RULES

All UI components must consume AIMI intelligence.

All UI components must display AIMI governance flags.

All UI components must display readiness, safety, compliance, and fleet health status.

All UI components must support autonomous actions when enabled.

BACKEND BLUEPRINT

SERVICE ORCHESTRATION

Each engine is a microservice.

Each microservice publishes events.

AIMI consumes all events.

AIMI produces intelligence objects.

Engines react to intelligence objects.

EVENT BUS

All events flow through the unified event bus.

All engines subscribe to relevant topics.

AIMI subscribes to all topics.

AIMI publishes intelligence topics.

BACKEND RULES

All services must enforce AIMI governance.

All services must apply AIMI optimizations.

All services must support AIMI autonomous actions.

All services must log all AIMI interactions.

ZERO‑DRIFT RULES

The blueprint defines all system behavior.

Cursor must generate code exactly according to the blueprint.

Cursor must not infer behavior not defined in the blueprint.

Cursor must not mutate engine logic.

Cursor must not alter AIMI tier or phase definitions.

Cursor must not alter database schema.

Cursor must not alter API endpoints.

Cursor must not alter UI structure.

Cursor must not alter backend orchestration.

All future changes must be appended to the blueprint, not inferred.

CURSOR BUILD INSTRUCTIONS

Cursor must scaffold the system in the following order:

1. Create project structure.

2. Create unified event bus.

3. Create unified API layer.

4. Create unified database schema.

5. Scaffold all engines.

6. Scaffold AIMI Intelligence Engine.

7. Implement AIMI tiers and phases.

8. Implement AIMI integration endpoints.

9. Implement AIMI governance enforcement.

10. Implement AIMI autonomous action support.

11. Scaffold UI portals and components.

12. Scaffold backend orchestration.

13. Implement audit logging.

14. Implement tenant isolation.

15. Implement security architecture.

16. Validate zero‑drift rules.

17. Generate final build.

Cursor must generate code exactly according to the blueprint with zero drift.

Cursor must not modify blueprint content.

Cursor must not infer missing logic.

Cursor must not restructure engines.

Cursor must not restructure AIMI.

Cursor must not restructure database schema.

Cursor must not restructure API endpoints.

Cursor must not restructure UI.

Cursor must not restructure backend.

Cursor must enforce blueprint fidelity at all times.

