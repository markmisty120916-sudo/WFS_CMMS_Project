# AIMI RULES  

## AIMI Governance, Constraints, and Behavioral Rules  

## Part of Master Blueprint V2

---

# 1. AIMI PURPOSE  

AIMI (Artificial Intelligence Maintenance Intelligence) is the unified intelligence layer of WFS CMMS.

AIMI must:

- improve technician speed  

- improve diagnostic accuracy  

- reduce downtime  

- reduce repeat repairs  

- increase PM compliance  

- increase predictive accuracy  

- unify all fleet data  

- operate without drift  

- operate without guessing  

- operate within strict rules  

AIMI is governed by the rules below.

---

# 2. AIMI CORE RULES  

## 2.1 No Drift  

AIMI must never:

- change naming conventions  

- change workflow logic  

- change severity definitions  

- change routing logic  

- change scheduling logic  

- change diagnostic steps  

- change UI patterns  

- change database schema  

- change API structure  

All logic is defined in the blueprint and is immutable.

## 2.2 No Guessing  

AIMI must never:

- invent data  

- invent steps  

- invent parts  

- invent repairs  

- invent severity  

- invent routing  

- invent scheduling  

- invent predictive alerts  

AIMI must only operate on:

- telematics  

- PM data  

- workorder data  

- technician input  

- driver defects  

- historical patterns  

- predictive models  

## 2.3 Deterministic Behavior  

AIMI must produce:

- consistent outputs  

- predictable behavior  

- repeatable decisions  

Given the same inputs, AIMI must produce the same outputs.

## 2.4 Role Safety  

AIMI must respect RBAC:

- technicians only see technician data  

- managers see full fleet data  

- drivers see driver data  

- parts managers see parts data  

- compliance officers see compliance data  

AIMI must never expose cross‑role information.

## 2.5 Tenant Safety  

AIMI must enforce tenant isolation:

- tenant_id required  

- tenant_id validated  

- tenant_id logged  

- no cross‑tenant learning  

- no cross‑tenant insights  

AIMI learns per tenant.

---

# 3. AIMI ENGINE RULES  

Each AIMI engine has strict constraints.

## 3.1 Severity Engine Rules  

Severity must be based only on:

- telematics  

- PM findings  

- driver defects  

- technician notes  

- predictive alerts  

- asset health  

Severity must follow:

- S1 Critical  

- S2 High  

- S3 Medium  

- S4 Low  

- S5 Info  

Severity must never be invented.

## 3.2 Routing Engine Rules  

Routing must consider:

- technician skill  

- technician certifications  

- technician workload  

- technician speed history  

- bay availability  

- asset location  

- severity  

Routing must never:

- assign unqualified technicians  

- assign unavailable technicians  

- assign unavailable bays  

## 3.3 Scheduling Engine Rules  

Scheduling must consider:

- severity  

- predictive urgency  

- technician availability  

- bay availability  

- asset availability  

- PM schedules  

Scheduling must never:

- override severity  

- override routing  

- override PM  

- override compliance  

## 3.4 Predictive Engine Rules  

Predictive models must use:

- telematics history  

- PM history  

- repair history  

- technician notes  

- asset age  

- mileage  

- usage patterns  

Predictive alerts must never be invented.

## 3.5 Diagnostic Engine Rules  

Diagnostics must:

- follow defined flows  

- follow defined steps  

- follow defined branching  

- follow defined verification  

- follow defined closeout  

Diagnostics must never:

- invent steps  

- invent repairs  

- invent parts  

## 3.6 Technician Learning Engine Rules  

Learning must be based only on:

- diagnostic steps  

- skipped steps  

- repair outcomes  

- time‑to‑repair  

- notes  

- photos  

- voice commands  

- multilingual usage  

Learning must never:

- override severity  

- override routing  

- override scheduling  

- override PM  

- override compliance  

## 3.7 Multilingual NLP Engine Rules  

Multilingual NLP must:

- detect language  

- translate text  

- translate steps  

- translate insights  

- translate voice commands  

Multilingual NLP must never:

- change meaning  

- change severity  

- change routing  

- change scheduling  

---

# 4. AIMI DATA RULES  

## 4.1 Immutable Audit Logs  

All AIMI decisions must be logged:

- severity  

- routing  

- scheduling  

- diagnostics  

- predictive alerts  

- learning updates  

Logs must be immutable.

## 4.2 Soft Deletes  

All AIMI tables must use soft deletes.

## 4.3 Append‑Only Learning  

Learning tables must be append‑only.

## 4.4 No Cross‑Tenant Data  

AIMI must never:

- read cross‑tenant data  

- learn from cross‑tenant data  

- write cross‑tenant data  

---

# 5. AIMI EVENT RULES  

AIMI must consume:

- workorder events  

- telematics events  

- PM events  

- diagnostic events  

- technician learning events  

- predictive alerts  

AIMI must emit:

- severity updates  

- routing updates  

- scheduling updates  

- diagnostic updates  

- predictive updates  

Events must follow strict naming conventions.

---

# 6. AIMI UI RULES  

AIMI must:

- show severity  

- show routing  

- show scheduling  

- show diagnostics  

- show predictive alerts  

- show insights  

AIMI must never:

- change UI structure  

- change UI naming  

- change UI hierarchy  

---

# 7. AIMI API RULES  

AIMI APIs must:

- be versioned  

- be tenant‑safe  

- be role‑safe  

- be deterministic  

- be predictable  

AIMI must never:

- expose internal models  

- expose internal weights  

- expose cross‑tenant data  

---

# 8. AIMI FUTURE RULES  

AIMI supports future expansion:

- new engines  

- new flows  

- new models  

- new languages  

- new voice commands  

- new UI modes  

But AIMI must never:

- rewrite existing engines  

- rewrite existing flows  

- rewrite existing rules  

---

# END OF AIMI RULES



