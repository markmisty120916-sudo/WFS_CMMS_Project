# DATABASE SCHEMA  

## Unified Database Schema Specification for Master Blueprint V2  

## Part of Hybrid Blueprint Structure

---

# 1. DATABASE OVERVIEW  

The database schema defines all tables required for:

- assets  

- workorders  

- PM  

- diagnostics  

- telematics  

- AIMI engines  

- predictive models  

- technician learning  

- tenant isolation  

- RBAC  

- compliance  

- parts  

- scheduling  

- event bus  

- multilingual  

- voice  

All tables must:

- include tenant_id  

- include soft deletes  

- include audit logging  

- follow naming conventions  

- follow AIMI Tier 2 rules  

- follow RBAC rules  

- follow Tenant Isolation rules  

---

# 2. CORE TABLES  

## 2.1 Tenants  

Stores tenant metadata.

Fields:  

- tenant_id (PK)  

- name  

- status  

- created_at  

- updated_at  

- deleted_at  

## 2.2 Users  

Stores user accounts.

Fields:  

- user_id (PK)  

- tenant_id  

- name  

- email  

- role  

- status  

- created_at  

- updated_at  

- deleted_at  

## 2.3 Roles  

Stores RBAC roles.

Fields:  

- role_id (PK)  

- tenant_id  

- role_name  

- created_at  

- updated_at  

- deleted_at  

## 2.4 Permissions  

Stores role permissions.

Fields:  

- permission_id (PK)  

- tenant_id  

- role_id  

- permission_key  

- created_at  

- updated_at  

- deleted_at  

---

# 3. ASSET TABLES  

## 3.1 Assets  

Stores asset metadata.

Fields:  

- asset_id (PK)  

- tenant_id  

- vin  

- unit_number  

- make  

- model  

- year  

- mileage  

- hours  

- status  

- created_at  

- updated_at  

- deleted_at  

## 3.2 AssetHealth  

Stores AIMI health calculations.

Fields:  

- health_id (PK)  

- tenant_id  

- asset_id  

- health_score  

- predictive_score  

- last_update  

- created_at  

- updated_at  

- deleted_at  

## 3.3 AssetTelematics  

Stores telematics events.

Fields:  

- telematics_id (PK)  

- tenant_id  

- asset_id  

- fault_code  

- fault_description  

- severity  

- timestamp  

- created_at  

- updated_at  

- deleted_at  

---

# 4. WORKORDER TABLES  

## 4.1 Workorders  

Stores workorder metadata.

Fields:  

- workorder_id (PK)  

- tenant_id  

- asset_id  

- source  

- description  

- severity  

- routing_tech_id  

- routing_bay_id  

- scheduled_start  

- scheduled_end  

- status  

- created_by  

- created_at  

- updated_at  

- deleted_at  

## 4.2 WorkorderNotes  

Stores technician notes.

Fields:  

- note_id (PK)  

- tenant_id  

- workorder_id  

- user_id  

- note_text  

- created_at  

- updated_at  

- deleted_at  

## 4.3 WorkorderPhotos  

Stores technician photos.

Fields:  

- photo_id (PK)  

- tenant_id  

- workorder_id  

- user_id  

- photo_url  

- created_at  

- updated_at  

- deleted_at  

## 4.4 WorkorderLabor  

Stores labor entries.

Fields:  

- labor_id (PK)  

- tenant_id  

- workorder_id  

- user_id  

- hours  

- created_at  

- updated_at  

- deleted_at  

## 4.5 WorkorderParts  

Stores parts usage.

Fields:  

- part_usage_id (PK)  

- tenant_id  

- workorder_id  

- part_id  

- quantity  

- created_at  

- updated_at  

- deleted_at  

---

# 5. PM TABLES  

## 5.1 PMTemplates  

Stores PM templates.

Fields:  

- pm_template_id (PK)  

- tenant_id  

- name  

- interval_miles  

- interval_hours  

- created_at  

- updated_at  

- deleted_at  

## 5.2 PMSchedule  

Stores PM schedules.

Fields:  

- pm_schedule_id (PK)  

- tenant_id  

- asset_id  

- pm_template_id  

- due_miles  

- due_hours  

- status  

- created_at  

- updated_at  

- deleted_at  

## 5.3 PMHistory  

Stores PM completion history.

Fields:  

- pm_history_id (PK)  

- tenant_id  

- asset_id  

- pm_template_id  

- completed_at  

- created_at  

- updated_at  

- deleted_at  

---

# 6. PARTS TABLES  

## 6.1 Parts  

Stores parts inventory.

Fields:  

- part_id (PK)  

- tenant_id  

- name  

- description  

- quantity  

- location  

- created_at  

- updated_at  

- deleted_at  

## 6.2 PartRequests  

Stores technician part requests.

Fields:  

- request_id (PK)  

- tenant_id  

- workorder_id  

- part_id  

- quantity  

- status  

- created_at  

- updated_at  

- deleted_at  

---

# 7. COMPLIANCE TABLES  

## 7.1 ComplianceInspections  

Stores inspection records.

Fields:  

- inspection_id (PK)  

- tenant_id  

- asset_id  

- type  

- status  

- created_at  

- updated_at  

- deleted_at  

## 7.2 ComplianceViolations  

Stores violations.

Fields:  

- violation_id (PK)  

- tenant_id  

- asset_id  

- description  

- severity  

- status  

- created_at  

- updated_at  

- deleted_at  

---

# 8. AIMI TABLES  

## 8.1 AIMILearningWeights  

Stores AIMI learning weights.

Fields:  

- weight_id (PK)  

- tenant_id  

- key  

- value  

- created_at  

- updated_at  

- deleted_at  

## 8.2 TechnicianLearningProfile  

Stores technician learning data.

Fields:  

- profile_id (PK)  

- tenant_id  

- user_id  

- steps_taken  

- steps_skipped  

- avg_time_to_repair  

- created_at  

- updated_at  

- deleted_at  

## 8.3 PredictiveModels  

Stores predictive model outputs.

Fields:  

- model_id (PK)  

- tenant_id  

- asset_id  

- predictive_score  

- failure_risk  

- created_at  

- updated_at  

- deleted_at  

## 8.4 SeverityHistory  

Stores severity decisions.

Fields:  

- severity_id (PK)  

- tenant_id  

- workorder_id  

- severity  

- reason  

- created_at  

- updated_at  

- deleted_at  

## 8.5 RoutingHistory  

Stores routing decisions.

Fields:  

- routing_id (PK)  

- tenant_id  

- workorder_id  

- technician_id  

- bay_id  

- reason  

- created_at  

- updated_at  

- deleted_at  

## 8.6 SchedulingHistory  

Stores scheduling decisions.

Fields:  

- scheduling_id (PK)  

- tenant_id  

- workorder_id  

- scheduled_start  

- scheduled_end  

- reason  

- created_at  

- updated_at  

- deleted_at  

## 8.7 DiagnosticHistory  

Stores diagnostic flow history.

Fields:  

- diagnostic_id (PK)  

- tenant_id  

- workorder_id  

- steps_taken  

- steps_skipped  

- outcome  

- created_at  

- updated_at  

- deleted_at  

---

# 9. EVENT BUS TABLES  

## 9.1 IntegrationEvents  

Stores all events.

Fields:  

- event_id (PK)  

- tenant_id  

- event_type  

- payload  

- timestamp  

- created_at  

- updated_at  

- deleted_at  

## 9.2 IntegrationLogs  

Stores event logs.

Fields:  

- log_id (PK)  

- tenant_id  

- event_id  

- message  

- created_at  

- updated_at  

- deleted_at  

---

# 10. MULTILINGUAL TABLES  

## 10.1 MultilingualLogs  

Stores translation logs.

Fields:  

- log_id (PK)  

- tenant_id  

- source_text  

- translated_text  

- language  

- created_at  

- updated_at  

- deleted_at  

---

# 11. VOICE TABLES  

## 11.1 VoiceCommandHistory  

Stores voice command usage.

Fields:  

- voice_id (PK)  

- tenant_id  

- user_id  

- command  

- context  

- created_at  

- updated_at  

- deleted_at  

---

# 12. FUTURE DATABASE EXPANSION  

Supports future:

- new AIMI engines  

- new predictive models  

- new diagnostic flows  

- new compliance rules  

- new telematics providers  

- new multilingual engines  

- new voice engines  

- new verticals  

Schema structure remains immutable.

---

# END OF DATABASE SCHEMA BLUEPRINT



