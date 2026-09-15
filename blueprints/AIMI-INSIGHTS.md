# AIMI INSIGHTS ENGINE  

## Insight Generation Rules for AIMI Tier 2  

## Part of Master Blueprint V2

---

# 1. INSIGHTS ENGINE OVERVIEW  

The AIMI Insights Engine converts raw AIMI data into actionable intelligence for:

- technicians  

- master technicians  

- fleet managers  

- parts managers  

- compliance officers  

Insights must be:

- deterministic  

- explainable  

- repeatable  

- tenant‑safe  

- role‑safe  

- event‑driven  

- drift‑proof  

Insights must never be guessed or invented.

---

# 2. INSIGHTS OBJECTIVES  

AIMI insights must:

- identify patterns  

- identify risks  

- identify inefficiencies  

- identify repeat failures  

- identify technician performance trends  

- identify fleet performance trends  

- identify predictive anomalies  

- identify PM gaps  

- identify compliance risks  

Insights must never:

- override severity  

- override routing  

- override scheduling  

- violate RBAC  

- violate tenant isolation  

---

# 3. INSIGHTS INPUT SOURCES  

Insights must be based only on:

- diagnostic history  

- severity history  

- routing history  

- scheduling history  

- predictive model outputs  

- asset health trends  

- telematics clusters  

- PM history  

- compliance violations  

- technician learning data  

- fleet learning data  

- parts usage patterns  

- labor patterns  

Forbidden inputs:

- assumptions  

- guesses  

- unrelated data  

- cross‑tenant data  

---

# 4. INSIGHT TYPES  

AIMI supports three insight categories:

## 4.1 Technician Insights  

Examples:  

- repeat repair rate  

- diagnostic step compliance  

- time‑to‑repair trends  

- telematics validation rate  

- workflow speed recommendations  

## 4.2 Fleet Insights  

Examples:  

- common fault patterns  

- PM failure patterns  

- asset health decline clusters  

- predictive anomalies  

- compliance risk trends  

## 4.3 Asset Insights  

Examples:  

- asset‑specific fault clusters  

- asset‑specific predictive risk  

- asset‑specific PM gaps  

- asset‑specific repeat repairs  

Insight types are immutable.

---

# 5. INSIGHT STRUCTURE  

Every AIMI insight must include:

- insight_id  

- insight_type  

- insight_summary  

- recommended_action  

- impact_area  

- insight_score (0–100)  

- insight_severity (Low / Medium / High / Critical)  

- learning_inputs  

- created_at  

- tenant_id  

- user_id (if applicable)  

Insight structure is immutable.

---

# 6. INSIGHT SEVERITY LEVELS  

AIMI uses four insight severity levels:

- **Critical** — immediate action required  

- **High** — urgent action recommended  

- **Medium** — action recommended  

- **Low** — informational  

Insight severity must be deterministic.

---

# 7. INSIGHT DECISION TREE  

Insights must follow a strict decision tree:

1. **Data Collection**  

   - gather diagnostic, routing, scheduling, predictive, PM, compliance, and learning data  

2. **Pattern Detection**  

   - detect repeated failures  

   - detect repeated delays  

   - detect repeated PM misses  

   - detect predictive anomalies  

   - detect technician performance trends  

   - detect fleet performance trends  

3. **Impact Evaluation**  

   - evaluate safety impact  

   - evaluate downtime impact  

   - evaluate cost impact  

   - evaluate compliance impact  

4. **Severity Assignment**  

   - Critical → immediate action  

   - High → urgent action  

   - Medium → recommended action  

   - Low → informational  

5. **Recommended Action Generation**  

   - deterministic  

   - explainable  

   - role‑safe  

Insights must select the **highest applicable severity**.

---

# 8. INSIGHT OUTPUT RULES  

Insights Engine must output:

- insight_id  

- insight_type  

- insight_summary  

- recommended_action  

- impact_area  

- insight_score  

- insight_severity  

- learning_inputs  

- created_at  

- tenant_id  

- user_id  

Outputs must be:

- immutable  

- logged  

- auditable  

- tenant‑scoped  

- role‑scoped  

---

# 9. INSIGHT EVENTS  

Insights Engine emits:

- aimi.insight.generated  

- aimi.insight.updated  

- aimi.insight.approved  

- aimi.insight.applied  

Events must include:

- insight_type  

- insight_severity  

- recommended_action  

- tenant_id  

- user_id  

- role  

- timestamp  

---

# 10. INSIGHT APPROVAL RULES  

Only the following roles may approve insight actions:

- Master Technician  

- Fleet Manager  

- Silent Master Key  

Rules:

- approval must include reason  

- approval must be logged  

- approval must be auditable  

Forbidden:

- technician self‑approval  

- driver approval  

- parts manager approval  

- compliance approval  

---

# 11. INSIGHT UI RULES  

Insights must be displayed:

- on AIMI insights dashboard  

- on Master Technician dashboard  

- on Fleet Manager dashboard  

- on Parts Manager dashboard  

- on Technician HUD (filtered)  

UI must show:

- insight summary  

- severity  

- recommended action  

- impact area  

- approval status  

UI must never:

- change naming  

- change hierarchy  

- change color scheme  

---

# 12. INSIGHT IMPACT RULES  

Approved insights may impact:

- workflow speed  

- routing preferences  

- scheduling preferences  

- PM template intervals  

- predictive thresholds  

- technician coaching  

- fleet optimization  

Insights must never:

- override severity rules  

- override tenant isolation  

- override RBAC  

---

# 13. FUTURE INSIGHT EXPANSION  

Supports future:

- new insight types  

- new learning metrics  

- new predictive models  

- new visualization modes  

- new technician coaching features  

- new fleet optimization features  

Insight structure remains immutable.

---

# END OF AIMI INSIGHTS BLUEPRINT

