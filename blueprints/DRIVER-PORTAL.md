# DRIVER PORTAL  

## Driver Defect Intake & Asset Status Portal Specification  

## Part of Master Blueprint V2

---

# 1. PORTAL OVERVIEW  

The Driver Portal provides a simplified, safe, deterministic interface for:

- defect reporting  

- asset status checks  

- compliance visibility  

- PM visibility  

- telematics fault visibility (filtered)  

Portal behavior must be:

- deterministic  

- role‑safe  

- tenant‑safe  

- AIMI‑aware  

- drift‑proof  

Drivers must never see technician‑only or manager‑only data.

---

# 2. ACCESS RULES  

Only the following roles may access this portal:

- Driver  

- Fleet Manager (read‑only)  

- Silent Master Key  

Forbidden:

- Technician  

- Master Technician  

- Parts Manager  

- Compliance Officer  

- Admin (without Silent Master Key elevation)

RBAC must be enforced at UI and API layers.

---

# 3. PORTAL MODULES  

The Driver Portal contains:

1. **Defect Reporting Panel**  

2. **Asset Status Panel**  

3. **PM Status Panel**  

4. **Compliance Status Panel**  

5. **Telematics Fault Summary (Filtered)**  

6. **Workorder Visibility (Driver‑Safe)**  

7. **Safety Alerts Panel**  

This module list is immutable.

---

# 4. DEFECT REPORTING PANEL  

Must allow drivers to report:

- mechanical defects  

- electrical defects  

- safety defects  

- comfort defects  

- operational issues  

- noises, smells, vibrations  

- dashboard lights  

Driver may:

- submit defect  

- add notes  

- add photos  

- add voice notes  

Cannot:

- assign severity  

- assign technician  

- assign bay  

- schedule workorder  

All defects must be normalized and logged.

---

# 5. ASSET STATUS PANEL  

Must display:

- asset_id  

- unit number  

- make/model/year  

- mileage/hours  

- asset health score (driver‑safe version)  

- operational status (In Service / Out of Service)  

Driver may:

- review asset status  

- acknowledge out‑of‑service notices  

Cannot:

- modify asset metadata  

- modify health score  

---

# 6. PM STATUS PANEL  

Must display:

- PM upcoming  

- PM overdue  

- PM type  

- PM due miles  

- PM due hours  

Driver may:

- acknowledge PM reminders  

Cannot:

- modify PM schedule  

- modify PM templates  

---

# 7. COMPLIANCE STATUS PANEL  

Must display:

- compliance blocks  

- inspection failures  

- regulatory holds  

- required documentation  

Driver may:

- acknowledge compliance notices  

Cannot:

- clear violations  

- bypass compliance blocks  

---

# 8. TELEMATICS FAULT SUMMARY (FILTERED)  

Must display:

- critical faults (driver‑safe wording)  

- major faults (driver‑safe wording)  

- minor faults (driver‑safe wording)  

Driver may:

- acknowledge alerts  

Cannot:

- view raw fault codes  

- view technician‑level telematics data  

- modify telematics status  

---

# 9. WORKORDER VISIBILITY (DRIVER‑SAFE)  

Must display:

- workorders created from driver defects  

- status (Open / In Progress / Completed)  

- severity (driver‑safe wording)  

- scheduled window (driver‑safe wording)  

Driver may:

- view status  

- add additional notes/photos  

Cannot:

- modify workorder  

- cancel workorder  

- escalate severity  

---

# 10. SAFETY ALERTS PANEL  

Must display:

- S1 safety alerts (driver‑safe wording)  

- out‑of‑service notices  

- critical compliance blocks  

- critical telematics alerts  

Safety alerts must override all other UI elements.

Driver may:

- acknowledge alerts  

Cannot:

- clear alerts  

- override safety rules  

---

# 11. PORTAL EVENTS  

Portal actions emit:

- portal.driver.defect.submitted  

- portal.driver.note.added  

- [portal.driver.photo](http://portal.driver.photo).added  

- portal.driver.alert.acknowledged  

Events must include:

- tenant_id  

- user_id  

- role  

- action_type  

- timestamp  

---

# 12. UI RULES  

Portal must:

- use simplified neon command center theme  

- use dark background  

- use high‑visibility accents  

- use large, driver‑friendly buttons  

- avoid clutter  

- avoid technical jargon  

Portal must never:

- change naming  

- change hierarchy  

- change color scheme  

---

# 13. FUTURE EXPANSION  

Supports future:

- driver training modules  

- voice‑only defect reporting  

- multilingual driver flows  

- driver safety scoring  

- driver compliance coaching  

Portal structure remains immutable.

---

# END OF DRIVER PORTAL BLUEPRINT

