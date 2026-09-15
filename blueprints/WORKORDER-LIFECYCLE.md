# WORKORDER LIFECYCLE  

## Full Workorder Lifecycle Specification for Master Blueprint V2  

## Part of Hybrid Blueprint Structure

---

# 1. WORKORDER LIFECYCLE OVERVIEW  

The Workorder Lifecycle defines how every workorder moves through the system:

- deterministic  

- AIMI‑aware  

- event‑driven  

- tenant‑safe  

- role‑safe  

- multilingual  

- voice‑enabled  

Workorders must never drift from this lifecycle.

---

# 2. WORKORDER STATES  

Workorders move through the following states:

1. CREATED  

2. AIMI_SEVERITY_ASSIGNED  

3. ROUTED  

4. SCHEDULED  

5. IN_PROGRESS  

6. WAITING_PARTS (optional)  

7. ON_HOLD (optional)  

8. COMPLETED  

9. CLOSED  

All transitions must follow strict rules.

---

# 3. WORKORDER CREATION  

## 3.1 Creation Sources  

Workorders may be created from:

- driver defect  

- PM finding  

- telematics fault  

- technician request  

- compliance inspection  

- manual creation  

## 3.2 Required Fields  

- asset_id  

- source  

- description  

- tenant_id  

- created_by  

## 3.3 Events Emitted  

- workorder.created  

- aimi.severity.requested  

---

# 4. AIMI SEVERITY ASSIGNMENT  

## 4.1 Severity Inputs  

AIMI uses:

- telematics  

- PM findings  

- driver defects  

- technician notes  

- asset health  

- predictive alerts  

## 4.2 Severity Levels  

- S1 Critical  

- S2 High  

- S3 Medium  

- S4 Low  

- S5 Info  

## 4.3 Rules  

- AIMI must never guess  

- AIMI must never drift  

- severity must be deterministic  

## 4.4 Events Emitted  

- aimi.severity.assigned  

- workorder.severity.updated  

---

# 5. ROUTING  

## 5.1 Routing Inputs  

AIMI routing considers:

- technician skill  

- technician certifications  

- technician workload  

- technician speed history  

- bay availability  

- asset location  

- severity  

## 5.2 Routing Rules  

Routing must:

- assign qualified technician  

- assign available technician  

- assign available bay  

Routing must never:

- assign unqualified tech  

- assign unavailable tech  

- assign unavailable bay  

## 5.3 Events Emitted  

- aimi.routing.assigned  

- workorder.routing.updated  

---

# 6. SCHEDULING  

## 6.1 Scheduling Inputs  

AIMI scheduling considers:

- severity  

- predictive urgency  

- technician availability  

- bay availability  

- asset availability  

- PM schedules  

## 6.2 Scheduling Rules  

Scheduling must:

- respect severity  

- respect routing  

- respect PM  

- respect compliance  

## 6.3 Events Emitted  

- aimi.scheduling.assigned  

- workorder.scheduled  

---

# 7. IN PROGRESS  

## 7.1 Technician Actions  

Technicians may:

- add notes  

- add photos  

- add labor  

- request parts  

- run diagnostics  

- run AIMI diagnostics  

- follow HUD mode  

## 7.2 Diagnostic Flow  

Diagnostics must:

- follow defined steps  

- follow defined branching  

- follow defined verification  

- follow defined closeout  

Diagnostics must never:

- invent steps  

- invent repairs  

- invent parts  

## 7.3 Events Emitted  

- [workorder.in](http://workorder.in)_progress  

- diagnostic.step.completed  

- diagnostic.completed  

---

# 8. WAITING PARTS (Optional)  

## 8.1 Trigger  

Workorder enters WAITING_PARTS when:

- technician requests parts  

- parts manager approves request  

## 8.2 Rules  

Workorder must not progress until:

- parts are available  

- technician is available  

- bay is available  

## 8.3 Events Emitted  

- workorder.waiting_parts  

---

# 9. ON HOLD (Optional)  

## 9.1 Trigger  

Workorder enters ON_HOLD when:

- asset unavailable  

- technician unavailable  

- bay unavailable  

- compliance block  

- external dependency  

## 9.2 Events Emitted  

- workorder.on_hold  

---

# 10. COMPLETION  

## 10.1 Completion Requirements  

Technician must:

- complete diagnostics  

- complete repairs  

- complete notes  

- complete photos  

- complete labor  

- complete parts usage  

## 10.2 AIMI Completion Review  

AIMI must:

- validate diagnostic path  

- validate skipped steps  

- validate severity resolution  

- validate routing accuracy  

- validate scheduling accuracy  

## 10.3 Events Emitted  

- workorder.completed  

- aimi.learning.update  

---

# 11. CLOSEOUT  

## 11.1 Closeout Rules  

Fleet Manager or Master Technician must:

- verify completion  

- verify notes  

- verify photos  

- verify parts  

- verify labor  

- verify compliance  

## 11.2 Final State  

Workorder enters CLOSED.

## 11.3 Events Emitted  

- workorder.closed  

- [asset.health](http://asset.health).updated  

- pm.schedule.updated  

---

# 12. WORKORDER TIMELINE  

Timeline must include:

- creation  

- severity  

- routing  

- scheduling  

- diagnostics  

- notes  

- photos  

- labor  

- parts  

- completion  

- closeout  

Timeline must be immutable.

---

# 13. WORKORDER AUDIT LOGS  

Audit logs must include:

- tenant_id  

- user_id  

- role  

- timestamp  

- action  

- previous_value  

- new_value  

Audit logs must be immutable.

---

# 14. FUTURE WORKORDER EXPANSION  

Supports future:

- new diagnostic flows  

- new AIMI engines  

- new predictive models  

- new multilingual flows  

- new voice flows  

- new compliance flows  

No rewrites required.

---

# END OF WORKORDER LIFECYCLE BLUEPRINT

