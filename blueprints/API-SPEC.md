# API SPEC  

## Full API Specification for Master Blueprint V2  

## Part of Hybrid Blueprint Structure

---

# 1. API OVERVIEW  

The WFS CMMS API is:

- REST‑based  

- JSON‑only  

- versioned  

- tenant‑safe  

- role‑safe  

- AIMI‑aware  

- event‑driven  

Base URL:  

`https://api.wfs-cmms.com/v1/`

All endpoints require:

- Authorization: Bearer <JWT>  

- X-Tenant-Id: <tenant_id>  

- Content-Type: application/json  

---

# 2. AUTH & TENANT HEADERS  

## 2.1 Required Headers  

- Authorization: Bearer <JWT>  

- X-Tenant-Id: <tenant_id>  

- Content-Type: application/json  

Requests without tenant_id or valid JWT are rejected.

---

# 3. ASSETS API  

## 3.1 List Assets  

GET /assets  

Query: status, group_id  

200 → array of assets

## 3.2 Get Asset  

GET /assets/{asset_id}

## 3.3 Create Asset  

POST /assets  

Body: asset_number, vin, make, model, year, type, location

## 3.4 Update Asset  

PUT /assets/{asset_id}

## 3.5 Delete Asset (Soft)  

DELETE /assets/{asset_id}

---

# 4. WORKORDERS API  

## 4.1 List Workorders  

GET /workorders  

Query: status, asset_id, severity, assigned_to

## 4.2 Get Workorder  

GET /workorders/{workorder_id}

## 4.3 Create Workorder  

POST /workorders  

Body: asset_id, source, initial_severity, description

## 4.4 Update Workorder  

PUT /workorders/{workorder_id}

## 4.5 Close Workorder  

POST /workorders/{workorder_id}/close

## 4.6 Workorder Notes  

POST /workorders/{workorder_id}/notes  

GET /workorders/{workorder_id}/notes

## 4.7 Workorder Photos  

POST /workorders/{workorder_id}/photos

## 4.8 Workorder Timeline  

GET /workorders/{workorder_id}/timeline

---

# 5. PM API  

## 5.1 List PM Templates  

GET /pm/templates

## 5.2 Create PM Template  

POST /pm/templates

## 5.3 List PM Schedules  

GET /pm/schedules?asset_id=...

## 5.4 Complete PM  

POST /pm/{pm_schedule_id}/complete  

Body: findings, technician_id

---

# 6. PARTS API  

## 6.1 List Parts  

GET /parts

## 6.2 Get Part  

GET /parts/{part_id}

## 6.3 Create Part  

POST /parts

## 6.4 Inventory  

GET /parts/{part_id}/inventory  

PUT /parts/{part_id}/inventory

## 6.5 Part Requests  

POST /workorders/{workorder_id}/parts/requests  

GET /workorders/{workorder_id}/parts/requests

---

# 7. SCHEDULING API  

## 7.1 Technician Schedule  

GET /scheduling/technicians  

GET /scheduling/technicians/{technician_id}

## 7.2 Bay Schedule  

GET /scheduling/bays  

GET /scheduling/bays/{bay_id}

## 7.3 Schedule Workorder  

POST /scheduling/workorders/{workorder_id}  

Body: scheduled_start, scheduled_end, technician_id, bay_id

---

# 8. TELEMATICS API  

## 8.1 Ingest Telematics Event  

POST /telematics/events  

Body: asset_id, event_type, event_data

## 8.2 List Faults  

GET /telematics/faults?asset_id=...

## 8.3 Live Data  

GET /telematics/live?asset_id=...

---

# 9. COMPLIANCE API  

## 9.1 List Inspections  

GET /compliance/inspections

## 9.2 Create Inspection  

POST /compliance/inspections

## 9.3 Complete Inspection  

POST /compliance/inspections/{inspection_id}/complete

---

# 10. AIMI API  

## 10.1 AIMI Diagnose  

POST /aimi/diagnostics/launch  

Body: workorder_id, symptoms  

Response: diagnostic path, first steps

## 10.2 AIMI Severity  

GET /aimi/severity/{workorder_id}

## 10.3 AIMI Routing  

GET /aimi/routing/{workorder_id}

## 10.4 AIMI Scheduling  

GET /aimi/scheduling/{workorder_id}

## 10.5 AIMI Insights  

GET /aimi/insights

---

# 11. MULTILINGUAL API  

## 11.1 Translate Text  

POST /multilingual/translate  

Body: text, source_language, target_language

## 11.2 Detect Language  

POST /multilingual/detect

---

# 12. VOICE API  

## 12.1 Voice Command  

POST /voice/commands  

Body: command_text, language, context

---

# 13. INTEGRATION & EVENTS API  

## 13.1 List Events  

GET /events?type=...

## 13.2 Webhooks (Future)  

POST /webhooks/register  

DELETE /webhooks/{webhook_id}

---

# 14. ERROR MODEL  

Standard error:

{

  "error": {

    "code": "STRING_CODE",

    "message": "Human readable message",

    "details": {}

  }

}

Examples: TENANT_REQUIRED, UNAUTHORIZED, FORBIDDEN, VALIDATION_FAILED, NOT_FOUND, CONFLICT, RATE_LIMITED

---

# 15. VERSIONING  

Current: /v1/  

Future: /v2/  

Breaking changes require new version.

---

# 16. FUTURE API EXPANSION  

Supports future:

- new vertical endpoints  

- new AIMI endpoints  

- new multilingual endpoints  

- new voice endpoints  

- new integration endpoints  

No rewrites required.

---

# END OF API SPEC BLUEPRINT



