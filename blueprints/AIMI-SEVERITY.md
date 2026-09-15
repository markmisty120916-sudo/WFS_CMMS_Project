# AIMI SEVERITY ENGINE  

## Severity Classification Rules for AIMI Tier 2  

## Part of Master Blueprint V2

---

# 1. SEVERITY ENGINE OVERVIEW  

The AIMI Severity Engine determines the urgency level of every workorder using deterministic, rule‑based logic.

Severity classification must be:

- deterministic  

- explainable  

- repeatable  

- tenant‑safe  

- role‑safe  

- event‑driven  

- drift‑proof  

Severity must never be guessed or invented.

---

# 2. SEVERITY LEVELS  

AIMI uses five severity levels:

- **S1 — Critical**  

- **S2 — High**  

- **S3 — Medium**  

- **S4 — Low**  

- **S5 — Info**

Severity levels are immutable and cannot be renamed or expanded.

---

# 3. SEVERITY INPUT SOURCES  

Severity must be based only on:

- telematics faults  

- PM findings  

- driver defects  

- technician notes  

- diagnostic results  

- predictive alerts  

- asset health history  

- mileage / hours  

- compliance violations  

Forbidden inputs:

- assumptions  

- guesses  

- inferred symptoms  

- unrelated data  

- cross‑tenant data  

---

# 4. SEVERITY RULESET  

## 4.1 S1 — Critical  

Triggered when:

- safety‑critical failure  

- brake system fault  

- steering fault  

- engine overheat  

- transmission failure  

- compliance violation preventing operation  

- predictive alert indicating imminent failure  

Rules:

- asset must be removed from service  

- routing must prioritize qualified technicians  

- scheduling must prioritize immediate repair  

## 4.2 S2 — High  

Triggered when:

- major drivability issues  

- repeated telematics faults  

- PM overdue beyond threshold  

- high‑risk predictive alert  

- technician identifies urgent condition  

Rules:

- asset may operate with caution  

- routing prioritizes high‑skill technicians  

- scheduling prioritizes near‑term repair  

## 4.3 S3 — Medium  

Triggered when:

- moderate drivability issues  

- non‑critical telematics faults  

- PM upcoming  

- technician identifies moderate condition  

Rules:

- asset remains in service  

- routing considers technician availability  

- scheduling aligns with PM windows  

## 4.4 S4 — Low  

Triggered when:

- minor issues  

- cosmetic issues  

- low‑impact telematics faults  

- minor technician notes  

Rules:

- asset remains fully operational  

- routing may assign any qualified technician  

- scheduling may defer  

## 4.5 S5 — Info  

Triggered when:

- informational notes  

- non‑actionable observations  

- minor driver comments  

- low‑impact PM findings  

Rules:

- no routing required  

- no scheduling required  

- no diagnostic flow required  

---

# 5. SEVERITY DECISION TREE  

Severity must follow a strict decision tree:

1. **Safety Check**  

   - If safety‑critical → S1  

2. **Compliance Check**  

   - If violation blocks operation → S1  

   - If violation requires correction → S2  

3. **Telematics Check**  

   - Critical fault → S1  

   - Major fault → S2  

   - Moderate fault → S3  

   - Minor fault → S4  

4. **Predictive Check**  

   - Imminent failure → S1  

   - High‑risk → S2  

   - Moderate risk → S3  

5. **PM Check**  

   - Overdue beyond threshold → S2  

   - Upcoming → S3  

   - Minor → S4  

6. **Technician Notes**  

   - Urgent → S2  

   - Moderate → S3  

   - Minor → S4  

   - Informational → S5  

7. **Driver Defects**  

   - Safety → S1  

   - Major → S2  

   - Moderate → S3  

   - Minor → S4  

   - Info → S5  

Severity must be the **highest applicable level**.

---

# 6. SEVERITY OUTPUT RULES  

Severity Engine must output:

- severity level  

- severity reason  

- severity inputs  

- severity timestamp  

- tenant_id  

- user_id  

Severity outputs must be:

- immutable  

- logged  

- auditable  

- tenant‑scoped  

- role‑scoped  

---

# 7. SEVERITY EVENTS  

Severity Engine emits:

- aimi.severity.requested  

- aimi.severity.assigned  

- workorder.severity.updated  

Events must include:

- severity  

- reason  

- tenant_id  

- user_id  

- role  

- timestamp  

---

# 8. SEVERITY OVERRIDE RULES  

Only the following roles may override severity:

- Master Technician  

- Fleet Manager  

- Silent Master Key  

Override rules:

- override must include reason  

- override must be logged  

- override must be auditable  

- override must never reduce safety  

Forbidden:

- technician overrides  

- driver overrides  

- parts manager overrides  

- compliance overrides  

---

# 9. SEVERITY UI RULES  

Severity must be displayed:

- on workorder cards  

- on asset cards  

- on technician HUD  

- on manager dashboards  

- on AIMI insights  

Severity must never:

- change color scheme  

- change naming  

- change hierarchy  

---

# 10. FUTURE SEVERITY EXPANSION  

Supports future:

- new telematics providers  

- new predictive models  

- new diagnostic flows  

- new PM logic  

- new compliance rules  

Severity levels remain immutable.

---

# END OF AIMI SEVERITY BLUEPRINT

