# AIMI SCHEDULING ENGINE  

## Scheduling Assignment Rules for AIMI Tier 2  

## Part of Master Blueprint V2

---

# 1. SCHEDULING ENGINE OVERVIEW  

The AIMI Scheduling Engine determines **when** a workorder should be performed.

Scheduling must be:

- deterministic  

- explainable  

- repeatable  

- tenant‑safe  

- role‑safe  

- event‑driven  

- drift‑proof  

Scheduling must never be guessed or invented.

---

# 2. SCHEDULING OBJECTIVES  

AIMI scheduling must:

- prioritize safety  

- prioritize severity  

- optimize technician availability  

- optimize bay availability  

- align with routing  

- align with PM windows  

- align with predictive urgency  

- reduce downtime  

- reduce repeat repairs  

Scheduling must never:

- violate severity  

- violate routing  

- violate PM rules  

- violate compliance  

- violate tenant isolation  

- violate RBAC  

---

# 3. SCHEDULING INPUT SOURCES  

Scheduling must be based only on:

- severity  

- routing assignment  

- technician availability  

- technician speed profile  

- technician workload  

- bay availability  

- asset availability  

- PM schedules  

- telematics faults  

- predictive alerts  

- compliance restrictions  

Forbidden inputs:

- assumptions  

- guesses  

- unrelated data  

- cross‑tenant data  

---

# 4. SCHEDULING WINDOWS  

AIMI uses four scheduling windows:

- **Immediate Window** — S1  

- **Urgent Window** — S2  

- **Standard Window** — S3  

- **Deferred Window** — S4  

- **No Scheduling Required** — S5  

Scheduling windows are immutable.

---

# 5. SCHEDULING RULESET  

## 5.1 S1 — Critical  

Rules:

- must be scheduled immediately  

- technician must be fast + highly skilled  

- bay must be available now  

- asset must be removed from service  

- predictive urgency overrides all other factors  

## 5.2 S2 — High  

Rules:

- must be scheduled within short-term window  

- technician must be highly skilled  

- bay must be available soon  

- asset may operate with caution  

- PM conflicts must be resolved  

## 5.3 S3 — Medium  

Rules:

- must be scheduled within standard window  

- technician may be medium skill  

- bay availability must be respected  

- asset remains in service  

- PM windows must be aligned  

## 5.4 S4 — Low  

Rules:

- may be scheduled in deferred window  

- technician may be slow/medium  

- bay availability flexible  

- asset remains fully operational  

## 5.5 S5 — Info  

Rules:

- no scheduling required  

- no technician assignment required  

- no bay assignment required  

---

# 6. TECHNICIAN AVAILABILITY RULES  

Scheduling must consider:

- shift schedule  

- PTO  

- training  

- current workload  

- severity load  

- PM load  

- diagnostic load  

Forbidden:

- scheduling technician outside shift  

- scheduling technician during PTO  

- scheduling technician during training  

---

# 7. TECHNICIAN SPEED RULES  

Speed affects scheduling:

- Fast → S1/S2 priority  

- Medium → S2/S3 priority  

- Slow → S3/S4 priority  

Master Technician may override speed.

---

# 8. BAY AVAILABILITY RULES  

Scheduling must consider:

- bay equipment  

- bay specialization  

- bay occupancy  

- bay restrictions  

- bay downtime  

Forbidden:

- scheduling incompatible bay  

- scheduling unavailable bay  

- scheduling restricted bay  

---

# 9. ASSET AVAILABILITY RULES  

Scheduling must consider:

- asset location  

- asset route  

- asset downtime  

- asset compliance status  

- asset PM status  

Forbidden:

- scheduling asset during restricted operation  

- scheduling asset during compliance block  

---

# 10. SCHEDULING DECISION TREE  

Scheduling must follow a strict decision tree:

1. **Severity Check**  

   - S1 → immediate  

   - S2 → urgent  

   - S3 → standard  

   - S4 → deferred  

   - S5 → none  

2. **Routing Check**  

   - must match technician availability  

   - must match technician speed  

   - must match bay availability  

3. **Predictive Check**  

   - imminent failure → escalate window  

   - high risk → escalate window  

4. **PM Check**  

   - overdue → escalate window  

   - upcoming → align window  

5. **Compliance Check**  

   - violation → escalate window  

Scheduling must select the **earliest valid window**.

---

# 11. SCHEDULING OUTPUT RULES  

Scheduling Engine must output:

- scheduled_start  

- scheduled_end  

- technician_id  

- bay_id  

- scheduling_reason  

- scheduling_inputs  

- scheduling_timestamp  

- tenant_id  

- user_id  

Scheduling outputs must be:

- immutable  

- logged  

- auditable  

- tenant‑scoped  

- role‑scoped  

---

# 12. SCHEDULING EVENTS  

Scheduling Engine emits:

- aimi.scheduling.assigned  

- workorder.scheduled  

Events must include:

- scheduled_start  

- scheduled_end  

- technician_id  

- bay_id  

- severity  

- reason  

- tenant_id  

- user_id  

- role  

- timestamp  

---

# 13. SCHEDULING OVERRIDE RULES  

Only the following roles may override scheduling:

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

# 14. SCHEDULING UI RULES  

Scheduling must be displayed:

- on workorder cards  

- on technician HUD  

- on manager dashboards  

- on AIMI insights  

Scheduling must never:

- change naming  

- change hierarchy  

- change color scheme  

---

# 15. FUTURE SCHEDULING EXPANSION  

Supports future:

- new predictive models  

- new PM logic  

- new telematics providers  

- new technician speed profiles  

- new bay types  

- new compliance rules  

Scheduling logic remains immutable.

---

# END OF AIMI SCHEDULING BLUEPRINT

