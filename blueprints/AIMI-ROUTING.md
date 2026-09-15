# AIMI ROUTING ENGINE  

## Routing Assignment Rules for AIMI Tier 2  

## Part of Master Blueprint V2

---

# 1. ROUTING ENGINE OVERVIEW  

The AIMI Routing Engine determines **who** should work on a workorder and **where** the work should occur.

Routing must be:

- deterministic  

- explainable  

- repeatable  

- tenant‑safe  

- role‑safe  

- event‑driven  

- drift‑proof  

Routing must never be guessed or invented.

---

# 2. ROUTING OBJECTIVES  

AIMI routing must:

- assign the correct technician  

- assign the correct bay  

- optimize technician workload  

- optimize technician skill usage  

- reduce downtime  

- reduce repeat repairs  

- align with severity  

- align with scheduling  

- align with PM windows  

- align with predictive urgency  

Routing must never:

- assign unqualified technicians  

- assign unavailable technicians  

- assign unavailable bays  

- violate RBAC  

- violate tenant isolation  

---

# 3. ROUTING INPUT SOURCES  

Routing must be based only on:

- severity  

- technician skill  

- technician certifications  

- technician workload  

- technician speed history  

- technician learning profile  

- bay availability  

- asset location  

- asset class  

- PM status  

- telematics faults  

- predictive alerts  

- compliance restrictions  

Forbidden inputs:

- assumptions  

- guesses  

- unrelated data  

- cross‑tenant data  

---

# 4. TECHNICIAN QUALIFICATION RULES  

A technician is eligible only if:

- certified for the asset class  

- certified for the repair type  

- certified for the diagnostic flow  

- not blocked by compliance  

- not blocked by scheduling  

- not blocked by workload limits  

A technician is **ineligible** if:

- missing required certifications  

- over workload threshold  

- currently assigned to S1/S2 work  

- unavailable due to shift  

- unavailable due to PTO  

- unavailable due to training  

---

# 5. TECHNICIAN WORKLOAD RULES  

Workload calculation includes:

- active workorders  

- severity distribution  

- estimated labor hours  

- technician speed profile  

- diagnostic complexity  

- PM load  

- predictive load  

Rules:

- technicians overloaded with S1/S2 cannot receive new S1/S2  

- technicians overloaded with PM cannot receive new PM  

- technicians overloaded with diagnostics cannot receive new diagnostics  

---

# 6. TECHNICIAN SPEED RULES  

AIMI uses technician speed profiles:

- Slow  

- Medium  

- Fast  

Speed affects:

- routing priority  

- scheduling windows  

- bay assignment  

- predictive urgency  

Rules:

- Fast technicians receive high‑severity work  

- Medium technicians receive balanced work  

- Slow technicians receive low‑severity work  

Master Technician may override speed.

---

# 7. BAY ASSIGNMENT RULES  

Bay assignment must consider:

- bay availability  

- bay equipment  

- bay specialization  

- asset class  

- severity  

- predictive urgency  

Forbidden:

- assigning asset to incompatible bay  

- assigning asset to unavailable bay  

- assigning asset to restricted bay  

---

# 8. ROUTING DECISION TREE  

Routing must follow a strict decision tree:

1. **Severity Check**  

   - S1 → highest skill + fastest tech + specialized bay  

   - S2 → high skill + available tech  

   - S3 → medium skill + available tech  

   - S4 → any qualified tech  

   - S5 → no routing required  

2. **Certification Check**  

   - must match asset class  

   - must match repair type  

   - must match diagnostic flow  

3. **Workload Check**  

   - must be under workload threshold  

   - must not be overloaded with S1/S2  

4. **Speed Check**  

   - S1/S2 → fast tech  

   - S3 → medium tech  

   - S4 → slow/medium tech  

5. **Bay Check**  

   - must be available  

   - must be compatible  

   - must be equipped  

Routing must select the **highest‑priority eligible technician**.

---

# 9. ROUTING OUTPUT RULES  

Routing Engine must output:

- technician_id  

- bay_id  

- routing_reason  

- routing_inputs  

- routing_timestamp  

- tenant_id  

- user_id  

Routing outputs must be:

- immutable  

- logged  

- auditable  

- tenant‑scoped  

- role‑scoped  

---

# 10. ROUTING EVENTS  

Routing Engine emits:

- aimi.routing.assigned  

- workorder.routing.updated  

Events must include:

- technician_id  

- bay_id  

- severity  

- reason  

- tenant_id  

- user_id  

- role  

- timestamp  

---

# 11. ROUTING OVERRIDE RULES  

Only the following roles may override routing:

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

# 12. ROUTING UI RULES  

Routing must be displayed:

- on workorder cards  

- on technician HUD  

- on manager dashboards  

- on AIMI insights  

Routing must never:

- change naming  

- change hierarchy  

- change color scheme  

---

# 13. FUTURE ROUTING EXPANSION  

Supports future:

- new technician certifications  

- new asset classes  

- new bay types  

- new predictive models  

- new diagnostic flows  

- new PM logic  

- new telematics providers  

Routing logic remains immutable.

---

# END OF AIMI ROUTING BLUEPRINT

