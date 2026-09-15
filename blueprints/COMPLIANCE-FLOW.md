# COMPLIANCE FLOW  

## Compliance Lifecycle & Enforcement Rules for AIMI Tier 2  

## Part of Master Blueprint V2

---

# 1. COMPLIANCE FLOW OVERVIEW  

The Compliance Flow governs:

- DOT compliance  

- OSHA compliance  

- State inspections  

- PM compliance  

- internal safety policy compliance  

Compliance behavior must be:

- deterministic  

- explainable  

- repeatable  

- tenant‑safe  

- role‑safe  

- AIMI‑aware  

- drift‑proof  

Compliance must never be guessed or invented.

---

# 2. COMPLIANCE FLOW OBJECTIVES  

Compliance flow must:

- prevent unsafe operation  

- prevent regulatory violations  

- reduce downtime  

- reduce inspection failures  

- unify compliance + technician workflows  

- integrate telematics, PM, diagnostics, predictive  

Compliance flow must never:

- override severity  

- override routing  

- override scheduling  

- violate RBAC  

- violate tenant isolation  

---

# 3. COMPLIANCE TRIGGER TYPES  

Compliance flow begins when any of the following triggers occur:

- DOT inspection failure  

- OSHA violation  

- State inspection failure  

- PM compliance violation  

- safety violation  

- driver defect (safety‑related)  

- telematics safety alert  

- AIMI predictive safety alert  

- Fleet Manager manual compliance flag  

- Compliance Officer audit finding  

Triggers must be logged and tenant‑scoped.

---

# 4. COMPLIANCE LIFECYCLE STAGES  

The compliance lifecycle contains:

1. **Compliance Trigger**  

2. **AIMI Compliance Intake**  

3. **Compliance Workorder Draft**  

4. **Conditional Approval Logic**  

5. **AIMI Compliance Scheduling**  

6. **AIMI Compliance Assignment**  

7. **Compliance Execution**  

8. **Compliance QA Review**  

9. **Compliance Closure**  

10. **Compliance Reporting**  

11. **AIMI Predictive Compliance Updates**

This lifecycle is immutable.

---

# 5. COMPLIANCE TRIGGER RULES  

Triggers must include:

- asset_id  

- compliance category  

- violation type  

- severity  

- timestamp  

- source  

Rules:

- triggers must be deterministic  

- triggers must be logged  

- triggers must be auditable  

Forbidden:

- manual severity assignment by technician  

- cross‑tenant triggers  

---

# 6. AIMI COMPLIANCE INTAKE  

AIMI evaluates:

- severity  

- safety impact  

- compliance impact  

- operational impact  

- asset history  

- PM compliance status  

- telematics data  

- violation type  

AIMI determines severity class:

- Low  

- Medium  

- High  

Severity class determines approval path.

---

# 7. COMPLIANCE WORKORDER DRAFT  

AIMI creates a draft containing:

- asset  

- violation  

- compliance category  

- severity  

- required corrective action  

- photos  

- notes  

- telematics data  

- compliance officer notes  

Draft must be tenant‑scoped and logged.

---

# 8. CONDITIONAL APPROVAL LOGIC  

Approval rules:

## Low Severity  

- auto‑approved  

- no Fleet Manager involvement  

## Medium Severity  

- optional approval  

- Fleet Manager may approve or allow auto‑approval  

## High Severity  

- Fleet Manager approval required  

Forbidden:

- technician approval  

- auto‑approval of high severity  

---

# 9. AIMI COMPLIANCE SCHEDULING  

AIMI evaluates:

- asset availability  

- technician availability  

- bay availability  

- severity  

- compliance deadlines  

- operational priority  

- PM conflicts  

- estimated labor hours  

AIMI generates recommended schedule.

Fleet Manager may override.

---

# 10. AIMI COMPLIANCE ASSIGNMENT  

AIMI evaluates:

- skillset match  

- workload  

- workflow speed  

- availability  

- severity  

- complexity  

- compliance category  

- asset type  

Assignment rules:

- Master Technician → high‑severity compliance  

- Lead Technician → advanced compliance  

- Technician → standard compliance  

- PM Technician → PM compliance  

- Shop Helper → simple compliance tasks  

Fleet Manager may override.

---

# 11. COMPLIANCE EXECUTION  

Technician performs corrective actions:

- safety repairs  

- DOT repairs  

- OSHA corrections  

- PM compliance corrections  

- inspection corrections  

- documentation corrections  

- telematics‑related safety corrections  

Technician must log:

- notes  

- photos  

- labor  

- parts  

- compliance fields  

- severity updates  

Status transitions:

- In Progress → Waiting Parts  

- In Progress → On Hold  

- In Progress → Completed  

---

# 12. COMPLIANCE QA REVIEW  

QA roles:

- Lead Technician  

- Master Technician  

- Safety/Compliance Officer  

- Fleet Manager (optional)  

QA checks:

- corrective action accuracy  

- compliance field accuracy  

- photos  

- notes  

- parts usage  

- severity updates  

- asset safety status  

- documentation completeness  

QA outcomes:

- QA Approved → Ready to Close  

- QA Failed → Returned to Technician  

---

# 13. COMPLIANCE CLOSURE  

Fleet Manager or AIMI closes compliance workorder.

Closure actions:

- update asset compliance history  

- update PM compliance status  

- update DOT/OSHA compliance status  

- update predictive models  

- update telematics baseline  

- update technician performance metrics  

- update shop load metrics  

Closure must be logged.

---

# 14. COMPLIANCE REPORTING  

AIMI updates:

- DOT compliance reports  

- OSHA compliance reports  

- State compliance reports  

- PM compliance reports  

- internal compliance dashboards  

- asset compliance score  

- fleet compliance score  

Reports must be tenant‑scoped.

---

# 15. AIMI PREDICTIVE COMPLIANCE UPDATES  

AIMI updates:

- safety prediction models  

- compliance prediction models  

- asset risk score  

- technician compliance performance  

- compliance category risk  

- telematics thresholds  

- PM compliance patterns  

Predictive updates must be deterministic.

---

# 16. COMPLIANCE EVENTS  

Compliance flow emits:

- compliance.triggered  

- compliance.intake.completed  

- compliance.workorder.created  

- compliance.approval.required  

- compliance.approved  

- compliance.scheduled  

- compliance.assigned  

- compliance.execution.started  

- compliance.execution.completed  

- [compliance.qa](http://compliance.qa).approved  

- [compliance.qa](http://compliance.qa).failed  

- compliance.closed  

Events must include:

- tenant_id  

- user_id  

- role  

- timestamp  

---

# 17. UI RULES  

Compliance UI must:

- use neon command center theme  

- use dark background  

- use high‑visibility accents  

- enforce role‑safe visibility  

- avoid clutter  

Compliance UI must never:

- change naming  

- change hierarchy  

- change color scheme  

---

# 18. FUTURE EXPANSION  

Supports future:

- new compliance categories  

- new inspection types  

- new predictive compliance models  

- new compliance dashboards  

- deeper AIMI explainability  

Compliance structure remains immutable.

---

# END OF COMPLIANCE FLOW BLUEPRINT

