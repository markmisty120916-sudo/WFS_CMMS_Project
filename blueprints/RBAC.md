# RBAC  

## Role-Based Access Control Specification for Master Blueprint V2  

## Part of Hybrid Blueprint Structure

---

# 1. RBAC OVERVIEW  

RBAC ensures:

- correct access  

- correct visibility  

- correct permissions  

- correct workflows  

- correct AIMI outputs  

- correct tenant isolation  

RBAC is enforced at:

- API layer  

- backend service layer  

- database layer  

- AIMI layer  

- event bus layer  

- frontend routing layer  

RBAC must never drift.

---

# 2. CORE ROLES  

The system defines the following core roles:

- DRIVER  

- TECHNICIAN  

- MASTER TECHNICIAN  

- PARTS MANAGER  

- FLEET MANAGER  

- COMPLIANCE OFFICER  

- ADMIN  

- SILENT MASTER KEY (hidden role)

Each role has strict permissions.

---

# 3. ROLE PERMISSIONS MATRIX  

## 3.1 DRIVER  

- submit defects  

- view own defects  

- view assigned asset  

- view DVIR  

- no access to workorders  

- no access to AIMI  

- no access to parts  

- no access to compliance  

- no access to scheduling  

## 3.2 TECHNICIAN  

- view assigned workorders  

- update workorders  

- add notes  

- add photos  

- add labor  

- request parts  

- complete diagnostics  

- run AIMI diagnostics  

- view asset details  

- no access to routing engine  

- no access to scheduling engine  

- no access to compliance module  

- no access to tenant settings  

## 3.3 MASTER TECHNICIAN  

All technician permissions plus:

- override severity  

- override routing  

- override scheduling  

- approve technician workflow speed  

- access technician learning profile  

- switch dashboards  

- access AIMI insights  

- access predictive alerts  

- access diagnostic history  

- access telematics faults  

- no access to tenant settings  

## 3.4 PARTS MANAGER  

- manage parts  

- manage inventory  

- approve part requests  

- view workorders  

- view asset details  

- no access to AIMI engines  

- no access to scheduling engine  

- no access to compliance module  

## 3.5 FLEET MANAGER  

- full fleet visibility  

- view all workorders  

- view all assets  

- view PM schedules  

- view telematics  

- view compliance  

- view AIMI insights  

- approve scheduling  

- approve routing  

- approve severity overrides  

- no access to tenant settings  

## 3.6 COMPLIANCE OFFICER  

- manage inspections  

- manage violations  

- view compliance dashboards  

- view asset details  

- view workorders (read-only)  

- no access to AIMI engines  

- no access to scheduling engine  

- no access to routing engine  

## 3.7 ADMIN  

- manage users  

- manage roles  

- manage permissions  

- manage tenant settings  

- manage integrations  

- full read/write access  

- cannot modify AIMI internal logic  

## 3.8 SILENT MASTER KEY (Hidden Role)  

- full system access  

- full dashboard switching  

- full AIMI visibility  

- full routing/scheduling/severity override  

- full predictive visibility  

- full diagnostic visibility  

- cannot modify AIMI logic  

- cannot modify tenant settings  

- cannot modify RBAC structure  

This role is invisible to all other users.

---

# 4. PERMISSION RULES  

## 4.1 No Cross-Role Leakage  

Forbidden:

- technicians seeing manager dashboards  

- drivers seeing technician data  

- parts managers seeing compliance data  

- compliance officers seeing AIMI engines  

## 4.2 No Cross-Tenant Leakage  

RBAC must enforce tenant isolation.

## 4.3 No Unauthorized AIMI Access  

Only:

- Master Technician  

- Fleet Manager  

- Admin  

- Silent Master Key  

may access AIMI insights.

## 4.4 No Unauthorized Overrides  

Only:

- Master Technician  

- Fleet Manager  

- Silent Master Key  

may override:

- severity  

- routing  

- scheduling  

## 4.5 No Unauthorized Scheduling  

Only:

- Fleet Manager  

- Master Technician  

- Scheduling Module  

may schedule workorders.

---

# 5. FRONTEND RBAC  

## 5.1 Role-Based Routing  

Frontend must:

- hide routes  

- hide dashboards  

- hide features  

- hide buttons  

- hide actions  

based on role.

## 5.2 Role-Based Components  

Components must check:

- role  

- permissions  

- tenant_id  

before rendering.

## 5.3 HUD Mode Restrictions  

HUD mode is available only to:

- Technician  

- Master Technician  

- Silent Master Key  

---

# 6. BACKEND RBAC  

## 6.1 Guards  

Backend uses:

- TenantGuard  

- RoleGuard  

- PermissionGuard  

## 6.2 Service Enforcement  

Services must:

- validate role  

- validate permissions  

- validate tenant_id  

## 6.3 Repository Enforcement  

Repositories must:

- filter by tenant_id  

- reject unauthorized access  

---

# 7. AIMI RBAC  

## 7.1 AIMI Visibility  

Only:

- Master Technician  

- Fleet Manager  

- Admin  

- Silent Master Key  

may view AIMI insights.

## 7.2 AIMI Control  

Only:

- Master Technician  

- Fleet Manager  

- Silent Master Key  

may override AIMI outputs.

## 7.3 AIMI Learning  

No role may modify AIMI learning weights.

---

# 8. EVENT BUS RBAC  

## 8.1 Events Must Include Role  

Every event must include:

- role  

- user_id  

- tenant_id  

## 8.2 Event Bus Must Enforce Role  

Event bus must reject:

- unauthorized events  

- unauthorized routing  

- unauthorized scheduling  

---

# 9. SECURITY RULES  

RBAC requires:

- JWT validation  

- tenant validation  

- role validation  

- permission validation  

- audit logging  

- rate limiting  

- HTTPS  

Forbidden:

- cross-role reads  

- cross-role writes  

- cross-role overrides  

- cross-role AIMI access  

---

# 10. FUTURE RBAC EXPANSION  

Supports future:

- new roles  

- new permissions  

- new verticals  

- new AIMI engines  

- new dashboards  

No rewrites required.

---

# END OF RBAC BLUEPRINT

