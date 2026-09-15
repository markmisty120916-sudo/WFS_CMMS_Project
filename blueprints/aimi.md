# AIMI — Artificial Intelligence Maintenance Intelligence  

## Full AIMI Specification for Master Blueprint V2  

## Part of Hybrid Blueprint Structure

---

# 1. AIMI OVERVIEW  

AIMI (Artificial Intelligence Maintenance Intelligence) is the core intelligence layer of WFS CMMS.  

It powers:

- severity scoring  

- routing  

- scheduling  

- diagnostics  

- predictive maintenance  

- technician learning  

- multilingual NLP  

- voice‑activated workflows  

- adaptive UI intelligence  

AIMI is not an add‑on — it is the central brain of the entire CMMS.

AIMI is composed of multiple engines, each isolated but connected through AIMI Core.

---

# 2. AIMI CORE  

AIMI Core is the central controller that:

- receives events  

- distributes tasks to engines  

- aggregates results  

- updates learning models  

- writes to AIMI tables  

- communicates with the CMMS backend  

- sends insights to the frontend  

AIMI Core is event‑driven and reacts to:

- workorder events  

- telematics events  

- PM events  

- diagnostic events  

- technician learning events  

- predictive alerts  

---

# 3. AIMI ENGINES  

AIMI consists of seven major engines:

1. **Severity Engine**  

2. **Routing Engine**  

3. **Scheduling Engine**  

4. **Predictive Engine**  

5. **Diagnostic Engine**  

6. **Technician Learning Engine**  

7. **Multilingual NLP Engine**

Each engine is documented below.

---

# 4. SEVERITY ENGINE  

The Severity Engine determines the urgency of issues using:

- telematics faults  

- driver defects  

- technician notes  

- PM findings  

- predictive alerts  

- historical patterns  

- asset health  

- asset age  

- asset usage  

## 4.1 Severity Levels  

Severity levels are standardized:

- **S1 — Critical**  

- **S2 — High**  

- **S3 — Medium**  

- **S4 — Low**  

- **S5 — Informational**

## 4.2 Severity Inputs  

Severity Engine consumes:

- DTC codes  

- driver defect categories  

- PM findings  

- asset health score  

- predictive model output  

- technician notes  

- telematics live data  

## 4.3 Severity Outputs  

Severity Engine produces:

- severity score  

- severity label  

- recommended routing  

- recommended scheduling  

- recommended diagnostic flow  

---

# 5. ROUTING ENGINE  

The Routing Engine determines **who** should work on an issue.

## 5.1 Routing Inputs  

- technician skill  

- technician certifications  

- technician workload  

- technician speed history  

- bay availability  

- asset location  

- severity  

- predictive urgency  

## 5.2 Routing Outputs  

- technician assignment  

- bay assignment  

- recommended start time  

- recommended workflow path  

---

# 6. SCHEDULING ENGINE  

The Scheduling Engine determines **when** work should be done.

## 6.1 Scheduling Inputs  

- severity  

- predictive urgency  

- technician availability  

- bay availability  

- asset availability  

- PM schedules  

- telematics usage patterns  

## 6.2 Scheduling Outputs  

- recommended schedule  

- recommended technician  

- recommended bay  

- recommended duration  

- predictive scheduling adjustments  

---

# 7. PREDICTIVE ENGINE  

The Predictive Engine forecasts failures before they occur.

## 7.1 Predictive Inputs  

- telematics history  

- PM history  

- repair history  

- technician notes  

- asset age  

- asset mileage  

- environmental factors  

- usage patterns  

## 7.2 Predictive Outputs  

- predictive alerts  

- predictive severity  

- predictive routing  

- predictive scheduling  

- predictive workorder creation  

## 7.3 Predictive Models  

Predictive Engine uses:

- anomaly detection  

- pattern recognition  

- regression models  

- fleet‑specific learning  

- technician‑specific learning  

---

# 8. DIAGNOSTIC ENGINE  

The Diagnostic Engine powers the **AIMI Diagnose Button**.

## 8.1 Diagnostic Flow  

Diagnostic flows include:

- symptom intake  

- fault correlation  

- path selection  

- guided troubleshooting  

- voice‑activated steps  

- multilingual steps  

- adaptive UI steps  

- repair recommendation  

- verification steps  

- closeout checklist  

## 8.2 Diagnostic Inputs  

- telematics faults  

- driver defects  

- technician notes  

- PM findings  

- predictive alerts  

- voice commands  

- multilingual commands  

## 8.3 Diagnostic Outputs  

- diagnostic path  

- recommended repair  

- recommended parts  

- recommended verification  

- technician learning updates  

---

# 9. TECHNICIAN LEARNING ENGINE  

The Technician Learning Engine improves AIMI over time.

## 9.1 Learning Inputs  

- diagnostic steps  

- skipped steps  

- repair outcomes  

- time‑to‑repair  

- technician notes  

- photos  

- voice commands  

- multilingual usage  

- fleet patterns  

- shop patterns  

## 9.2 Learning Outputs  

- personalized diagnostic flows  

- technician performance insights  

- shop‑specific patterns  

- fleet‑specific patterns  

- improved predictive accuracy  

- improved severity accuracy  

## 9.3 Learning Tables  

Learning Engine writes to:

- TechnicianLearningProfile  

- AIMILearningWeights  

- DiagnosticHistory  

- DiagnosticVoiceLogs  

- PredictiveModels  

- SeverityHistory  

- RoutingHistory  

---

# 10. MULTILINGUAL NLP ENGINE  

The Multilingual NLP Engine powers:

- multilingual UI  

- multilingual diagnostics  

- multilingual voice commands  

- multilingual notes  

- multilingual insights  

## 10.1 Supported Languages  

- English  

- Spanish  

- French  

- German  

- Portuguese  

- Mandarin  

- Arabic  

## 10.2 NLP Functions  

- translation  

- intent detection  

- command parsing  

- diagnostic step translation  

- repair recommendation translation  

---

# 11. AIMI EVENT CONSUMERS  

AIMI listens to:

- `workorder.created`  

- `workorder.updated`  

- `workorder.completed`  

- `telematics.event.received`  

- `pm.completed`  

- `asset.updated`  

- `diagnostic.completed`  

- `technician.feedback`  

- `predictive.alert`  

Each event triggers one or more AIMI engines.

---

# 12. AIMI DATA FLOW  

AIMI follows a strict data flow:

1. Event received  

2. AIMI Core processes  

3. Engines run in parallel  

4. Engines return results  

5. AIMI Core aggregates  

6. AIMI writes to database  

7. AIMI sends insights to UI  

8. AIMI updates learning models  

This ensures consistency and zero drift.

---

# 13. AIMI FRONTEND INTEGRATION  

AIMI integrates with the frontend through:

- AIMI Diagnose Button  

- AIMI Insight Feed  

- AIMI Severity Badges  

- AIMI Predictive Alerts  

- AIMI Routing Suggestions  

- AIMI Scheduling Suggestions  

- AIMI Diagnostic Steps  

- AIMI Verification Steps  

---

# 14. AIMI BACKEND INTEGRATION  

AIMI integrates with backend services:

- assets  

- workorders  

- PM  

- parts  

- scheduling  

- telematics  

- compliance  

- diagnostics  

- multilingual  

- voice  

- adaptive UI  

---

# 15. AIMI FUTURE EXPANSION  

AIMI is designed to support:

- new engines  

- new diagnostic flows  

- new predictive models  

- new languages  

- new voice commands  

- new UI modes  

- new verticals  

- new integrations  

No rewrites required.

---

# END OF AIMI BLUEPRINT

