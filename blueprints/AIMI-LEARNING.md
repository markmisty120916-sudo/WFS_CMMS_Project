# AIMI LEARNING ENGINE  

## Technician & Fleet Learning Rules for AIMI Tier 2  

## Part of Master Blueprint V2

---

# 1. LEARNING ENGINE OVERVIEW  

The AIMI Learning Engine captures technician and fleet behavior to improve:

- routing  

- scheduling  

- diagnostics  

- predictive modeling  

- asset health scoring  

Learning must be:

- deterministic  

- explainable  

- repeatable  

- tenant‑safe  

- role‑safe  

- append‑only  

- drift‑proof  

Learning must never override core safety logic.

---

# 2. LEARNING OBJECTIVES  

AIMI learning must:

- identify effective diagnostic patterns  

- identify ineffective patterns  

- reduce repeat repairs  

- reduce time‑to‑repair  

- improve technician performance  

- improve fleet performance  

- improve predictive accuracy  

Learning must never:

- override severity  

- override routing  

- override scheduling  

- violate RBAC  

- violate tenant isolation  

---

# 3. LEARNING INPUT SOURCES  

Learning must be based only on:

- diagnostic steps taken  

- diagnostic steps skipped  

- time‑to‑repair  

- repair outcomes  

- repeat repair rate  

- telematics validation rate  

- PM completion rate  

- notes  

- photos  

- voice command usage  

- multilingual usage  

- asset health changes  

- predictive model performance  

Forbidden inputs:

- assumptions  

- guesses  

- unrelated data  

- cross‑tenant data  

---

# 4. LEARNING DATA STRUCTURE  

Learning data must be stored in:

- TechnicianLearningProfile  

- DiagnosticHistory  

- SeverityHistory  

- RoutingHistory  

- SchedulingHistory  

- PredictiveModels  

- AssetHealth  

All learning tables must be:

- tenant‑scoped  

- append‑only  

- soft‑deleted only for administrative reasons  

---

# 5. TECHNICIAN LEARNING RULES  

AIMI must track per technician:

- steps taken vs skipped  

- average time‑to‑repair  

- repeat repair rate  

- telematics validation rate  

- PM completion rate  

- voice usage  

- multilingual usage  

Rules:

- high performance → FAST workflow speed  

- average performance → MEDIUM workflow speed  

- low performance → SLOW workflow speed  

Learning must never directly change severity.

---

# 6. FLEET LEARNING RULES  

AIMI must track per fleet:

- common fault patterns  

- common repair patterns  

- common PM failures  

- common compliance issues  

- asset health trends  

- predictive accuracy trends  

Rules:

- fleet patterns may adjust PM templates  

- fleet patterns may adjust predictive thresholds  

- fleet patterns may adjust routing preferences  

Fleet learning must remain tenant‑scoped.

---

# 7. LEARNING DECISION TREE  

Learning must follow a strict decision tree:

1. **Data Collection**  

   - capture diagnostic, routing, scheduling, predictive, and outcome data  

2. **Performance Evaluation**  

   - evaluate technician performance  

   - evaluate fleet performance  

3. **Pattern Detection**  

   - detect effective patterns  

   - detect ineffective patterns  

4. **Adjustment Proposal**  

   - propose changes to workflow speed  

   - propose changes to PM templates  

   - propose changes to predictive thresholds  

5. **Approval & Application**  

   - Master Technician / Fleet Manager approve changes  

   - AIMI applies approved changes  

Learning must never auto‑apply changes without approval.

---

# 8. LEARNING OUTPUT RULES  

Learning Engine must output:

- learning_insight_id  

- insight_type (technician / fleet / asset)  

- insight_summary  

- recommended_action  

- learning_inputs  

- learning_timestamp  

- tenant_id  

- user_id (if applicable)  

Outputs must be:

- immutable  

- logged  

- auditable  

- tenant‑scoped  

- role‑scoped  

---

# 9. LEARNING EVENTS  

Learning Engine emits:

- aimi.learning.insight.generated  

- aimi.learning.insight.approved  

- aimi.learning.insight.applied  

Events must include:

- insight_type  

- recommended_action  

- tenant_id  

- user_id (approver)  

- role  

- timestamp  

---

# 10. LEARNING OVERRIDE & APPROVAL RULES  

Only the following roles may approve or apply learning changes:

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

# 11. LEARNING UI RULES  

Learning insights must be displayed:

- on AIMI insights dashboard  

- on Master Technician dashboard  

- on Fleet Manager dashboard  

UI must show:

- insight summary  

- recommended action  

- impact area (routing / scheduling / PM / predictive / workflow speed)  

- approval status  

Learning UI must never:

- change naming  

- change hierarchy  

- change color scheme  

---

# 12. LEARNING IMPACT RULES  

Approved learning may impact:

- workflow speed levels  

- PM template intervals  

- predictive thresholds  

- routing preferences  

- scheduling preferences  

Learning must never:

- override severity rules  

- override tenant isolation  

- override RBAC  

---

# 13. FUTURE LEARNING EXPANSION  

Supports future:

- new performance metrics  

- new diagnostic flows  

- new predictive models  

- new learning visualizations  

- new technician coaching features  

- new fleet optimization features  

Learning structure remains immutable.

---

# END OF AIMI LEARNING BLUEPRINT

