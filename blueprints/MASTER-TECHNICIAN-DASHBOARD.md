# MASTER TECHNICIAN DASHBOARD  

## Master Technician Control Surface Specification  

## Part of Master Blueprint V2

---

# 1. DASHBOARD OVERVIEW  

The Master Technician Dashboard is the **control surface** for:

- technician performance  

- AIMI learning approvals  

- workflow speed overrides  

- routing/scheduling review  

- diagnostic flow oversight  

Dashboard behavior must be:

- deterministic  

- role‑safe  

- tenant‑safe  

- AIMI‑aware  

- drift‑proof  

---

# 2. ACCESS RULES  

Only the following roles may access this dashboard:

- Master Technician  

- Silent Master Key  

Forbidden:

- Technician  

- Driver  

- Parts Manager  

- Fleet Manager  

- Compliance Officer  

- Admin (without Silent Master Key elevation)

RBAC must be enforced at UI and API layers.

---

# 3. DASHBOARD MODULES  

The Master Technician Dashboard contains:

1. **Technician Performance Panel**  

2. **Workflow Speed Control Panel**  

3. **AIMI Learning Insights Panel**  

4. **Routing/Scheduling Review Panel**  

5. **Diagnostic Flow Oversight Panel**  

6. **Asset Risk & Predictive Panel**  

7. **HUD Mode Configuration Panel**  

This module list is immutable.

---

# 4. TECHNICIAN PERFORMANCE PANEL  

Must display per technician:

- workflow_speed_level (Slow / Medium / Fast)  

- time‑to‑repair trends  

- repeat repair rate  

- diagnostic step compliance  

- telematics validation rate  

- PM completion rate  

Master Technician may:

- review performance  

- flag technicians for coaching  

- approve learning‑based speed changes  

Cannot:

- directly change severity  

- directly change routing  

- directly change scheduling  

---

# 5. WORKFLOW SPEED CONTROL PANEL  

Must display:

- current workflow_speed_level  

- AIMI‑recommended level  

- reason for recommendation  

- learning inputs  

Master Technician may:

- override workflow_speed_level  

- approve AIMI recommendations  

- revert overrides  

Rules:

- override must include reason  

- override must be logged  

- override must be auditable  

- override must never reduce safety  

---

# 6. AIMI LEARNING INSIGHTS PANEL  

Must display:

- technician insights  

- fleet insights  

- asset insights  

- recommended actions  

- impact areas (routing / scheduling / PM / predictive / workflow speed)  

- approval status  

Master Technician may:

- approve learning actions  

- reject learning actions  

- request clarification  

Learning actions must never auto‑apply without approval.

---

# 7. ROUTING/SCHEDULING REVIEW PANEL  

Must display:

- recent routing decisions  

- recent scheduling decisions  

- severity context  

- predictive context  

- technician workflow speed context  

Master Technician may:

- review questionable assignments  

- override routing (with reason)  

- override scheduling (with reason)  

Overrides must:

- be logged  

- be auditable  

- never reduce safety  

---

# 8. DIAGNOSTIC FLOW OVERSIGHT PANEL  

Must display:

- diagnostic flows in use  

- step compliance rates  

- step skip rates  

- outcome success rates  

- repeat repair correlations  

Master Technician may:

- flag flows for review  

- request flow adjustments  

- approve new flows  

Cannot:

- directly edit flows in production UI  

- bypass AIMI safety rules  

---

# 9. ASSET RISK & PREDICTIVE PANEL  

Must display:

- assets with Imminent / High failure risk  

- predictive_score  

- failure_risk level  

- severity  

- routing/scheduling status  

Master Technician may:

- escalate action  

- request immediate workorders  

- coordinate with Fleet Manager  

Predictive values must never be manually edited.

---

# 10. HUD MODE CONFIGURATION PANEL  

Must display:

- HUD feature flags  

- voice command availability  

- multilingual availability  

- diagnostic pacing modes  

Master Technician may:

- enable/disable HUD features per technician group  

- adjust pacing modes (within safety bounds)  

Cannot:

- disable safety alerts  

- disable verification requirements  

---

# 11. DASHBOARD EVENTS  

Dashboard actions emit:

- dashboard.master_tech.speed.overridden  

- dashboard.master_tech.learning.approved  

- dashboard.master_tech.learning.rejected  

- dashboard.master_tech.routing.overridden  

- dashboard.master_tech.scheduling.overridden  

- dashboard.master_tech.flow.flagged  

Events must include:

- tenant_id  

- user_id  

- role  

- action_type  

- reason  

- timestamp  

---

# 12. UI RULES  

Dashboard must:

- use neon command center theme  

- use dark background  

- use high‑visibility accents  

- group panels by function  

- avoid clutter  

Dashboard must never:

- change naming  

- change hierarchy  

- change color scheme  

---

# 13. FUTURE EXPANSION  

Supports future:

- coaching workflows  

- training modules  

- simulation modes  

- deeper AIMI explainability views  

- cross‑panel correlation views  

Dashboard structure remains immutable.

---

# END OF MASTER TECHNICIAN DASHBOARD BLUEPRINT

