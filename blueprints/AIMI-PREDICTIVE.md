# AIMI PREDICTIVE ENGINE  

## Predictive Maintenance & Failure Forecasting Rules for AIMI Tier 2  

## Part of Master Blueprint V2

---

# 1. PREDICTIVE ENGINE OVERVIEW  

The AIMI Predictive Engine forecasts asset failures using deterministic, rule‑based modeling.

Predictive behavior must be:

- deterministic  

- explainable  

- repeatable  

- tenant‑safe  

- role‑safe  

- event‑driven  

- drift‑proof  

Predictive alerts must never be guessed or invented.

---

# 2. PREDICTIVE ENGINE OBJECTIVES  

AIMI predictive must:

- identify early failure indicators  

- reduce breakdowns  

- reduce downtime  

- reduce repeat repairs  

- optimize PM scheduling  

- optimize routing/scheduling decisions  

- improve asset health scoring  

- unify telematics + PM + diagnostic patterns  

Predictive must never:

- override severity  

- override routing  

- override scheduling  

- violate RBAC  

- violate tenant isolation  

---

# 3. PREDICTIVE INPUT SOURCES  

Predictive must be based only on:

- telematics fault history  

- PM history  

- repair history  

- diagnostic outcomes  

- technician notes  

- asset age  

- mileage  

- hours  

- usage patterns  

- environmental patterns  

- compliance violations  

- technician learning data  

Forbidden inputs:

- assumptions  

- guesses  

- unrelated data  

- cross‑tenant data  

---

# 4. PREDICTIVE SCORE STRUCTURE  

Predictive Engine outputs two scores:

- **predictive_score** — 0–100  

- **failure_risk** — Low / Medium / High / Imminent  

Scores are immutable in structure.

---

# 5. FAILURE RISK LEVELS  

AIMI uses four failure risk levels:

- **Imminent** — failure expected soon  

- **High** — strong indicators of failure  

- **Medium** — moderate indicators  

- **Low** — minimal indicators  

Levels are immutable.

---

# 6. FAILURE RISK RULESET  

## 6.1 Imminent  

Triggered when:

- critical telematics fault cluster  

- repeated S1/S2 severity  

- rapid health decline  

- predictive_score > 90  

- compliance block preventing operation  

Rules:

- escalate severity to S1  

- schedule immediate window  

- route to fast technician  

- remove asset from service  

## 6.2 High  

Triggered when:

- major telematics fault cluster  

- repeated S2 severity  

- predictive_score > 75  

- PM overdue beyond threshold  

Rules:

- escalate severity to S2  

- schedule urgent window  

- route to high‑skill technician  

## 6.3 Medium  

Triggered when:

- moderate telematics faults  

- predictive_score > 50  

- PM upcoming  

- technician notes indicate moderate concern  

Rules:

- severity remains S3  

- schedule standard window  

## 6.4 Low  

Triggered when:

- minor telematics faults  

- predictive_score ≤ 50  

- no PM conflicts  

- no diagnostic concerns  

Rules:

- severity remains S4/S5  

- schedule deferred window  

---

# 7. PREDICTIVE DECISION TREE  

Predictive must follow a strict decision tree:

1. **Telematics Cluster Check**  

   - critical → Imminent  

   - major → High  

   - moderate → Medium  

   - minor → Low  

2. **PM Check**  

   - overdue → High  

   - upcoming → Medium  

3. **Diagnostic History Check**  

   - repeated failures → High  

   - slow verification → Medium  

4. **Asset Health Check**  

   - rapid decline → Imminent  

   - moderate decline → High  

5. **Usage Pattern Check**  

   - extreme usage → High  

   - moderate usage → Medium  

Predictive must select the **highest applicable level**.

---

# 8. PREDICTIVE OUTPUT RULES  

Predictive Engine must output:

- predictive_score  

- failure_risk  

- predictive_reason  

- predictive_inputs  

- predictive_timestamp  

- tenant_id  

- user_id  

Outputs must be:

- immutable  

- logged  

- auditable  

- tenant‑scoped  

- role‑scoped  

---

# 9. PREDICTIVE EVENTS  

Predictive Engine emits:

- aimi.predictive.generated  

- aimi.predictive.updated  

- aimi.predictive.escalated  

Events must include:

- predictive_score  

- failure_risk  

- reason  

- tenant_id  

- user_id  

- role  

- timestamp  

---

# 10. PREDICTIVE OVERRIDE RULES  

Only the following roles may override predictive risk:

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

# 11. PREDICTIVE UI RULES  

Predictive must be displayed:

- on asset cards  

- on workorder cards  

- on technician HUD  

- on manager dashboards  

- on AIMI insights  

Predictive must never:

- change naming  

- change hierarchy  

- change color scheme  

---

# 12. FUTURE PREDICTIVE EXPANSION  

Supports future:

- new telematics providers  

- new predictive models  

- new diagnostic flows  

- new PM logic  

- new compliance rules  

- new environmental data sources  

- new technician learning metrics  

Predictive structure remains immutable.

---

# END OF AIMI PREDICTIVE BLUEPRINT

