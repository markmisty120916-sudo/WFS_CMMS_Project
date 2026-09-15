# AIMI DIAGNOSTIC FLOWS  

## Diagnostic Flow Rules for AIMI Tier 2  

## Part of Master Blueprint V2

---

# 1. DIAGNOSTIC ENGINE OVERVIEW  

The AIMI Diagnostic Engine generates deterministic, step‑by‑step troubleshooting flows for technicians.

Diagnostic flows must be:

- deterministic  

- explainable  

- repeatable  

- tenant‑safe  

- role‑safe  

- event‑driven  

- drift‑proof  

Diagnostic flows must never be guessed or invented.

---

# 2. DIAGNOSTIC FLOW OBJECTIVES  

AIMI diagnostics must:

- guide technicians through structured troubleshooting  

- reduce misdiagnosis  

- reduce repeat repairs  

- reduce time‑to‑repair  

- unify diagnostic patterns  

- capture technician learning  

- integrate telematics, PM, defects, and predictive data  

Diagnostics must never:

- skip required safety steps  

- invent steps  

- invent repairs  

- invent parts  

- violate tenant isolation  

- violate RBAC  

---

# 3. DIAGNOSTIC INPUT SOURCES  

Diagnostic flows must be based only on:

- telematics faults  

- PM findings  

- driver defects  

- technician notes  

- severity  

- routing assignment  

- predictive alerts  

- asset history  

- workorder history  

- technician learning profile  

Forbidden inputs:

- assumptions  

- guesses  

- unrelated data  

- cross‑tenant data  

---

# 4. DIAGNOSTIC FLOW STRUCTURE  

Every diagnostic flow must follow the same structure:

1. **Symptom Intake**  

2. **Fault Correlation**  

3. **Path Selection**  

4. **Guided Troubleshooting Steps**  

5. **Repair Recommendation**  

6. **Verification Steps**  

7. **Closeout Checklist**  

8. **Technician Learning Capture**

This structure is immutable.

---

# 5. SYMPTOM INTAKE RULES  

AIMI must collect symptoms from:

- telematics  

- driver defects  

- PM findings  

- technician notes  

- predictive alerts  

- voice commands  

- multilingual commands  

Rules:

- symptoms must be normalized  

- symptoms must be tenant‑scoped  

- symptoms must be logged  

---

# 6. FAULT CORRELATION RULES  

AIMI must correlate symptoms with:

- known fault patterns  

- historical repair outcomes  

- technician learning data  

- telematics fault clusters  

- PM failure patterns  

- predictive anomalies  

Rules:

- correlation must be deterministic  

- correlation must be explainable  

- correlation must never use cross‑tenant data  

---

# 7. PATH SELECTION RULES  

AIMI must select the optimal diagnostic path based on:

- severity  

- asset type  

- technician skill  

- technician speed  

- shop patterns  

- fleet patterns  

- predictive urgency  

Rules:

- path selection must be deterministic  

- path selection must be logged  

- path selection must be auditable  

Forbidden:

- random path selection  

- guessing  

- cross‑tenant learning  

---

# 8. GUIDED TROUBLESHOOTING RULES  

AIMI must generate:

- step‑by‑step instructions  

- voice‑activated steps  

- multilingual steps  

- adaptive UI steps  

- diagrams (if available)  

- expected outcomes  

- branching logic  

Rules:

- steps must be deterministic  

- steps must be safe  

- steps must be auditable  

- steps must never be invented  

Technicians may use voice commands:

- “Next step”  

- “Repeat step”  

- “Explain this step”  

- “Skip step”  

Skipping steps must be logged.

---

# 9. REPAIR RECOMMENDATION RULES  

AIMI must recommend:

- most likely repair  

- required parts  

- required labor  

- estimated time  

- technician assignment  

- bay assignment  

Rules:

- recommendations must be deterministic  

- recommendations must be explainable  

- recommendations must be logged  

Forbidden:

- invented repairs  

- invented parts  

---

# 10. VERIFICATION RULES  

AIMI must verify:

- repair success  

- telematics validation  

- asset health recalculation  

- severity recalculation  

- predictive model update  

Rules:

- verification must be deterministic  

- verification must be logged  

- verification must be auditable  

---

# 11. CLOSEOUT CHECKLIST RULES  

AIMI must generate a checklist:

- notes  

- photos  

- parts used  

- labor logged  

- verification complete  

- technician feedback  

Checklist must be completed before workorder completion.

---

# 12. TECHNICIAN LEARNING CAPTURE RULES  

AIMI must capture:

- steps taken  

- steps skipped  

- time‑to‑repair  

- notes  

- photos  

- voice commands  

- multilingual usage  

- repair outcome  

Rules:

- learning must be tenant‑scoped  

- learning must be append‑only  

- learning must never override severity/routing/scheduling  

---

# 13. DIAGNOSTIC PATH TYPES  

AIMI supports:

- telematics‑driven path  

- driver‑defect path  

- PM‑finding path  

- technician‑reported path  

- predictive‑alert path  

- hybrid path  

Path types are immutable.

---

# 14. DIAGNOSTIC EVENTS  

AIMI emits:

- diagnostic.started  

- diagnostic.step.completed  

- diagnostic.step.skipped  

- diagnostic.completed  

- diagnostic.voice.used  

- diagnostic.multilingual.used  

- diagnostic.verification.completed  

Events must include:

- tenant_id  

- user_id  

- role  

- timestamp  

---

# 15. DIAGNOSTIC UI RULES  

Diagnostics must be displayed:

- in technician HUD  

- in workorder view  

- in AIMI insights  

- in manager dashboards  

UI must never:

- change naming  

- change hierarchy  

- change color scheme  

---

# 16. FUTURE DIAGNOSTIC EXPANSION  

Supports future:

- new diagnostic flows  

- new asset types  

- new fault patterns  

- new languages  

- new voice commands  

- new UI modes  

- new predictive models  

- new technician learning features  

Diagnostic structure remains immutable.

---

# END OF AIMI DIAGNOSTIC FLOWS BLUEPRINT

