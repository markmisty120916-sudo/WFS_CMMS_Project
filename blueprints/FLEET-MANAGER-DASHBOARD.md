# FLEET MANAGER DASHBOARD  

## Fleet Oversight & Operational Intelligence Specification  

## Part of Master Blueprint V2

---

# 1. DASHBOARD OVERVIEW  

The Fleet Manager Dashboard provides operational intelligence for:

- asset health  

- predictive risk  

- PM compliance  

- workorder load  

- technician performance (summary only)  

- fleet-wide AIMI insights  

Dashboard behavior must be:

- deterministic  

- role‑safe  

- tenant‑safe  

- AIMI‑aware  

- drift‑proof  

---

# 2. ACCESS RULES  

Only the following roles may access this dashboard:

- Fleet Manager  

- Silent Master Key  

Forbidden:

- Technician  

- Master Technician  

- Driver  

- Parts Manager  

- Compliance Officer  

- Admin (without Silent Master Key elevation)

RBAC must be enforced at UI and API layers.

---

# 3. DASHBOARD MODULES  

The Fleet Manager Dashboard contains:

1. **Fleet Health Overview**  

2. **Predictive Risk Panel**  

3. **PM Compliance Panel**  

4. **Workorder Load Panel**  

5. **AIMI Insights Panel**  

6. **Routing/Scheduling Overview**  

7. **Compliance Risk Panel**  

8. **Asset Performance Trends Panel**  

This module list is immutable.

---

# 4. FLEET HEALTH OVERVIEW  

Must display:

- asset health scores  

- health decline trends  

- telematics fault clusters  

- repeat repair assets  

- high‑risk asset groups  

Fleet Manager may:

- flag assets for review  

- request Master Technician evaluation  

- initiate PM adjustments  

Cannot:

- directly change severity  

- directly change routing  

- directly change scheduling  

---

# 5. PREDICTIVE RISK PANEL  

Must display:

- predictive_score  

- failure_risk (Low / Medium / High / Imminent)  

- predicted failure type  

- predicted time window  

- recommended action  

Fleet Manager may:

- escalate action  

- request immediate workorders  

- coordinate with Master Technician  

Predictive values must never be manually edited.

---

# 6. PM COMPLIANCE PANEL  

Must display:

- PM overdue assets  

- PM upcoming assets  

- PM template intervals  

- PM completion rate  

- PM failure patterns  

Fleet Manager may:

- adjust PM templates (with approval)  

- request PM scheduling  

- flag PM gaps  

Cannot:

- bypass PM safety rules  

- override AIMI severity  

---

# 7. WORKORDER LOAD PANEL  

Must display:

- active workorders  

- severity distribution  

- technician load summary  

- bay load summary  

- scheduling windows  

Fleet Manager may:

- request redistribution  

- escalate scheduling  

- coordinate with Master Technician  

Cannot:

- directly assign technicians  

- directly assign bays  

---

# 8. AIMI INSIGHTS PANEL  

Must display:

- fleet insights  

- asset insights  

- recommended actions  

- impact areas (PM / predictive / routing / scheduling / compliance)  

- approval status  

Fleet Manager may:

- approve fleet-level insights  

- reject insights  

- request clarification  

Cannot:

- approve technician-level insights  

- modify workflow speed  

---

# 9. ROUTING/SCHEDULING OVERVIEW  

Must display:

- routing patterns  

- scheduling patterns  

- technician availability summary  

- bay availability summary  

- severity context  

Fleet Manager may:

- request routing review  

- request scheduling review  

- escalate high‑risk assignments  

Cannot:

- override routing  

- override scheduling  

Overrides belong to Master Technician.

---

# 10. COMPLIANCE RISK PANEL  

Must display:

- compliance violations  

- compliance blocks  

- inspection failures  

- regulatory deadlines  

- high‑risk assets  

Fleet Manager may:

- request compliance workorders  

- escalate compliance issues  

- coordinate with Compliance Officer  

Cannot:

- clear violations  

- bypass compliance blocks  

---

# 11. ASSET PERFORMANCE TRENDS PANEL  

Must display:

- fuel efficiency trends  

- repair cost trends  

- downtime trends  

- repeat repair trends  

- technician performance impact  

Fleet Manager may:

- flag assets for replacement  

- request deeper AIMI analysis  

- coordinate with leadership  

Cannot:

- modify predictive thresholds  

- modify AIMI learning weights  

---

# 12. DASHBOARD EVENTS  

Dashboard actions emit:

- [dashboard.fleet.pm](http://dashboard.fleet.pm).adjusted  

- dashboard.fleet.insight.approved  

- dashboard.fleet.insight.rejected  

- dashboard.fleet.asset.flagged  

- dashboard.fleet.compliance.escalated  

Events must include:

- tenant_id  

- user_id  

- role  

- action_type  

- reason  

- timestamp  

---

# 13. UI RULES  

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

# 14. FUTURE EXPANSION  

Supports future:

- cost forecasting  

- replacement planning  

- fleet optimization AI  

- deeper predictive explainability  

- cross‑fleet benchmarking  

Dashboard structure remains immutable.

---

# END OF FLEET MANAGER DASHBOARD BLUEPRINT

