# TECHNICIAN WORKFLOW SPEED  

## Workflow Speed Rules for AIMI Tier 2  

## Part of Master Blueprint V2

---

# 1. WORKFLOW SPEED OVERVIEW  

Technician Workflow Speed defines how AIMI adjusts:

- routing  

- scheduling  

- diagnostic pacing  

- workload balancing  

- predictive urgency  

- HUD step timing  

Workflow Speed must be:

- deterministic  

- explainable  

- repeatable  

- tenant‑safe  

- role‑safe  

- drift‑proof  

Workflow Speed must never be guessed or invented.

---

# 2. WORKFLOW SPEED LEVELS  

AIMI uses three workflow speed levels:

- **SLOW**  

- **MEDIUM**  

- **FAST**

These levels are immutable.

---

# 3. WORKFLOW SPEED OBJECTIVES  

Workflow Speed must:

- optimize technician performance  

- reduce time‑to‑repair  

- reduce repeat repairs  

- balance workload  

- improve routing accuracy  

- improve scheduling accuracy  

- improve diagnostic pacing  

- improve predictive modeling  

Workflow Speed must never:

- override severity  

- override routing  

- override scheduling  

- violate RBAC  

- violate tenant isolation  

---

# 4. WORKFLOW SPEED INPUT SOURCES  

Workflow Speed must be based only on:

- technician learning profile  

- diagnostic history  

- steps taken  

- steps skipped  

- average time‑to‑repair  

- telematics validation rate  

- PM completion rate  

- repeat repair rate  

- voice command usage  

- multilingual usage  

- shop patterns  

- fleet patterns  

Forbidden inputs:

- assumptions  

- guesses  

- unrelated data  

- cross‑tenant data  

---

# 5. WORKFLOW SPEED RULESET  

## 5.1 SLOW  

Triggered when:

- technician frequently skips steps  

- technician has high repeat repair rate  

- technician has slow time‑to‑repair  

- technician struggles with diagnostic branching  

- technician requires frequent HUD explanations  

Rules:

- routing assigns low‑severity work  

- scheduling assigns deferred windows  

- diagnostics slow pacing  

- predictive urgency reduced  

## 5.2 MEDIUM  

Triggered when:

- technician follows most steps  

- technician has average time‑to‑repair  

- technician has balanced workload  

- technician performs consistently  

Rules:

- routing assigns medium‑severity work  

- scheduling assigns standard windows  

- diagnostics medium pacing  

- predictive urgency normal  

## 5.3 FAST  

Triggered when:

- technician rarely skips steps  

- technician has low repeat repair rate  

- technician has fast time‑to‑repair  

- technician excels at branching logic  

- technician uses HUD efficiently  

Rules:

- routing assigns high‑severity work  

- scheduling assigns urgent windows  

- diagnostics fast pacing  

- predictive urgency increased  

---

# 6. WORKFLOW SPEED DECISION TREE  

Workflow Speed must follow a strict decision tree:

1. **Learning Profile Check**  

   - high performance → FAST  

   - average performance → MEDIUM  

   - low performance → SLOW  

2. **Diagnostic History Check**  

   - fast completion → FAST  

   - average completion → MEDIUM  

   - slow completion → SLOW  

3. **Repeat Repair Check**  

   - low repeats → FAST  

   - moderate repeats → MEDIUM  

   - high repeats → SLOW  

4. **Step Compliance Check**  

   - high compliance → FAST  

   - moderate compliance → MEDIUM  

   - low compliance → SLOW  

5. **Telematics Validation Check**  

   - high validation → FAST  

   - moderate validation → MEDIUM  

   - low validation → SLOW  

Workflow Speed must be the **lowest applicable level** to ensure safety.

---

# 7. WORKFLOW SPEED OUTPUT RULES  

Workflow Speed Engine must output:

- workflow_speed_level  

- workflow_speed_reason  

- workflow_speed_inputs  

- workflow_speed_timestamp  

- tenant_id  

- user_id  

Outputs must be:

- immutable  

- logged  

- auditable  

- tenant‑scoped  

- role‑scoped  

---

# 8. WORKFLOW SPEED EVENTS  

Workflow Speed Engine emits:

- workflow.speed.calculated  

- workflow.speed.updated  

- workflow.speed.overridden  

Events must include:

- workflow_speed_level  

- reason  

- tenant_id  

- user_id  

- role  

- timestamp  

---

# 9. WORKFLOW SPEED OVERRIDE RULES  

Only the following roles may override workflow speed:

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

# 10. WORKFLOW SPEED UI RULES  

Workflow Speed must be displayed:

- on technician HUD  

- on technician dashboard  

- on Master Technician dashboard  

- on AIMI insights  

Workflow Speed must never:

- change naming  

- change hierarchy  

- change color scheme  

---

# 11. WORKFLOW SPEED IMPACT RULES  

Workflow Speed affects:

- routing priority  

- scheduling window  

- diagnostic pacing  

- predictive urgency  

- workload balancing  

Workflow Speed must never:

- override severity  

- override routing  

- override scheduling  

---

# 12. FUTURE WORKFLOW SPEED EXPANSION  

Supports future:

- new learning metrics  

- new diagnostic flows  

- new predictive models  

- new technician performance indicators  

- new HUD features  

- new voice commands  

- new multilingual features  

Workflow Speed levels remain immutable.

---

# END OF TECHNICIAN WORKFLOW SPEED BLUEPRINT

