# TECHNICIAN DASHBOARD  

## Technician Operational Dashboard Specification  

## Part of Master Blueprint V2

---

# 1. DASHBOARD OVERVIEW  

The Technician Dashboard provides real‑time operational visibility for:

- assigned workorders  

- routing & scheduling  

- diagnostic flows  

- HUD Mode access  

- parts requests  

- labor logging  

- asset context  

Dashboard behavior must be:

- deterministic  

- role‑safe  

- tenant‑safe  

- AIMI‑aware  

- drift‑proof  

---

# 2. ACCESS RULES  

Only the following roles may access this dashboard:

- Technician  

- Master Technician  

- Silent Master Key  

Forbidden:

- Driver  

- Fleet Manager  

- Parts Manager  

- Compliance Officer  

- Admin (without Silent Master Key elevation)

RBAC must be enforced at UI and API layers.

---

# 3. DASHBOARD MODULES  

The Technician Dashboard contains:

1. **Workorder Queue**  

2. **Routing & Scheduling Panel**  

3. **Asset Overview Panel**  

4. **AIMI Diagnostic Flow Panel**  

5. **HUD Mode Launcher**  

6. **Parts Request Panel**  

7. **Labor Logging Panel**  

8. **Notes & Photos Panel**  

9. **Safety & Predictive Alerts Panel**  

This module list is immutable.

---

# 4. WORKORDER QUEUE  

Must display:

- active workorders  

- severity  

- routing technician  

- routing bay  

- scheduled window  

- predictive risk  

- PM conflicts  

Technician may:

- open workorder  

- launch HUD Mode  

- add notes/photos  

Cannot:

- change severity  

- change routing  

- change scheduling  

---

# 5. ROUTING & SCHEDULING PANEL  

Must display:

- assigned technician  

- assigned bay  

- scheduled start  

- scheduled end  

- severity context  

- predictive context  

Technician may:

- acknowledge assignment  

- request clarification  

Cannot:

- override routing  

- override scheduling  

- modify technician workflow speed  

---

# 6. ASSET OVERVIEW PANEL  

Must display:

- asset_id  

- unit number  

- make/model/year  

- mileage/hours  

- asset health score  

- predictive_score  

- failure_risk  

- telematics fault summary  

- PM status  

Technician may:

- review asset history  

- add notes/photos  

Cannot:

- modify asset metadata  

- modify predictive values  

---

# 7. AIMI DIAGNOSTIC FLOW PANEL  

Must display:

- current diagnostic step  

- next step  

- previous step  

- expected outcome  

- branching options  

- verification requirements  

Technician may:

- follow steps  

- skip steps (logged)  

- request explanation  

- complete verification  

Cannot:

- modify diagnostic flow  

- bypass verification  

---

# 8. HUD MODE LAUNCHER  

Must provide:

- one‑tap HUD Mode launch  

- voice command activation  

- multilingual activation  

- safety alert priority  

HUD Mode must:

- enforce deterministic steps  

- enforce verification  

- enforce safety alerts  

Technician may:

- use voice commands  

- use multilingual commands  

Cannot:

- disable safety alerts  

- disable verification  

---

# 9. PARTS REQUEST PANEL  

Must display:

- part search  

- part availability  

- part location  

- request status  

Technician may:

- submit part requests  

- add quantity  

- add notes  

Cannot:

- approve requests  

- modify inventory  

---

# 10. LABOR LOGGING PANEL  

Must display:

- labor start  

- labor stop  

- labor notes  

- total hours  

Technician may:

- log labor  

- add notes  

Labor entries must be:

- immutable  

- auditable  

- tenant‑scoped  

---

# 11. NOTES & PHOTOS PANEL  

Must allow:

- adding notes  

- adding photos  

- adding annotations  

- adding voice notes  

All entries must include:

- tenant_id  

- user_id  

- timestamp  

---

# 12. SAFETY & PREDICTIVE ALERTS PANEL  

Must display:

- S1 safety alerts  

- compliance blocks  

- critical telematics faults  

- predictive imminent failures  

Alerts must override all other UI elements.

Technician may:

- acknowledge alerts  

- escalate to Master Technician  

Cannot:

- clear alerts  

- override predictive risk  

---

# 13. DASHBOARD EVENTS  

Dashboard actions emit:

- [dashboard.tech](http://dashboard.tech).workorder.opened  

- [dashboard.tech](http://dashboard.tech).hud.launched  

- [dashboard.tech.parts](http://dashboard.tech.parts).requested  

- [dashboard.tech](http://dashboard.tech).labor.logged  

- [dashboard.tech](http://dashboard.tech).note.added  

- [dashboard.tech.photo](http://dashboard.tech.photo).added  

- [dashboard.tech](http://dashboard.tech).alert.acknowledged  

Events must include:

- tenant_id  

- user_id  

- role  

- action_type  

- timestamp  

---

# 14. UI RULES  

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

# 15. FUTURE EXPANSION  

Supports future:

- technician coaching modules  

- skill progression tracking  

- AR diagnostic overlays  

- wearable integration  

- predictive‑guided repair suggestions  

Dashboard structure remains immutable.

---

# END OF TECHNICIAN DASHBOARD BLUEPRINT

