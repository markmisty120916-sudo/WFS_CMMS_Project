# WFS CMMS — Master Blueprint V2  

## The Complete System Architecture, AIMI Intelligence Model, Workflow Logic, and UI/UX Specification  

## Hybrid Format — Master File

---

# 1. SYSTEM OVERVIEW  

WFS CMMS is a next‑generation, AI‑driven, multi‑tenant fleet maintenance management system designed for school districts, commercial fleets, and enterprise transportation operations.  

It includes:

- AIMI (Artificial Intelligence Maintenance Intelligence)  

- Full CMMS verticals (Assets, Workorders, PM, Parts, Scheduling, Telematics, Compliance, Reporting)  

- Neon Dark Command Center UI  

- Voice‑activated diagnostics  

- Multilingual support  

- Adaptive UI  

- Technician Learning Engine  

- 3D Fleet Visualization  

- Predictive maintenance  

- Role‑based dashboards  

- Tenant‑safe architecture  

- Modular, scalable, drift‑proof design  

This blueprint defines the entire system at a high level.  

Deep‑dive details are stored in the vertical blueprint files.

---

# 2. CORE PRINCIPLES  

1. **Zero Drift**  

   - All logic, naming, and structure must follow this blueprint.  

   - Cursor and Copilot reference this file as the single source of truth.

2. **Modular Architecture**  

   - Each vertical is isolated but integrated through AIMI and the event bus.

3. **Tenant Isolation**  

   - Every table includes `tenant_id`.  

   - All data is scoped per tenant.

4. **Role‑Based Access Control (RBAC)**  

   - Master Technician  

   - Technician  

   - Fleet Manager  

   - Administrator  

   - Driver  

   - Inspector  

   - AIMI System Role (internal)

5. **Event‑Driven System**  

   - All major actions emit events.  

   - AIMI listens and reacts.

6. **AI‑First Design**  

   - AIMI is not an add‑on.  

   - AIMI is the core of the system.

7. **Voice‑First Design**  

   - All major workflows support voice commands.

8. **Multilingual Design**  

   - All UI text, diagnostics, and voice commands support multiple languages.

9. **Technician‑Friendly UI**  

   - Neon dark mode  

   - Large buttons  

   - High contrast  

   - HUD mode  

   - Hands‑free workflows

10. **Future‑Proof**  

    - New modules can be added without rewriting existing ones.

---

# 3. SYSTEM ARCHITECTURE OVERVIEW  

The system is divided into the following layers:

### 3.1 Frontend  

- Next.js  

- TailwindCSS  

- Neon Dark Command Center theme  

- Adaptive UI engine  

- Voice command interface  

- Multilingual UI engine  

- 3D fleet visualization (Three.js)

### 3.2 Backend  

- Node.js / TypeScript  

- Modular service architecture  

- AIMI intelligence engines  

- Event bus  

- API versioning  

- Telematics ingestion pipeline  

- Diagnostic engine  

- Technician learning engine

### 3.3 Database  

- PostgreSQL  

- Tenant‑scoped tables  

- Soft deletes  

- Immutable audit logs  

- AIMI learning tables  

- Diagnostic tables  

- Telematics tables  

- PM tables  

- Workorder tables  

- Asset tables  

- Parts tables  

- Scheduling tables

### 3.4 Integrations  

- Telematics providers  

- OEM diagnostic libraries  

- Azure Speech (voice)  

- Azure Translator (multilingual)  

- Email/SMS notifications  

- SSO (future phase)

---

# 4. AIMI — ARTIFICIAL INTELLIGENCE MAINTENANCE INTELLIGENCE  

AIMI is the core intelligence layer of WFS CMMS.  

It includes multiple engines:

### 4.1 Severity Engine  

Determines severity levels based on:

- telematics  

- driver defects  

- technician notes  

- PM findings  

- predictive models  

- historical patterns

### 4.2 Routing Engine  

Routes workorders based on:

- technician skill  

- workload  

- bay availability  

- severity  

- asset status  

- predictive urgency

### 4.3 Scheduling Engine  

Schedules PM, repairs, inspections, and predictive tasks.

### 4.4 Predictive Engine  

Forecasts failures using:

- telematics  

- PM history  

- repair history  

- technician notes  

- asset age  

- asset usage  

- environmental factors

### 4.5 Diagnostic Engine  

Generates diagnostic flows for:

- engine faults  

- transmission faults  

- electrical faults  

- HVAC faults  

- emissions faults  

- hybrid faults  

- predictive faults  

- driver‑reported symptoms

Includes the **AIMI Diagnose Button** workflow.

### 4.6 Technician Learning Engine  

Learns from:

- technician behavior  

- diagnostic choices  

- repair outcomes  

- time‑to‑repair  

- notes  

- photos  

- voice commands  

- fleet patterns  

- shop patterns  

Improves diagnostic accuracy and technician performance.

### 4.7 Multilingual NLP Engine  

Supports voice and text in multiple languages.

---

# 5. WORKORDER SYSTEM OVERVIEW  

Workorders include:

- asset  

- severity  

- diagnostics  

- parts  

- labor  

- notes  

- photos  

- telematics  

- PM linkage  

- predictive linkage  

- technician assignment  

- routing  

- scheduling  

- AIMI insights  

- voice commands  

- multilingual support

### 5.1 AIMI Diagnose Button  

A neon button at the top of every workorder:

**AIMI Diagnose Issue**

Triggers:

- guided diagnostic flow  

- voice‑activated diagnostics  

- multilingual diagnostics  

- technician learning  

- dynamic troubleshooting tree  

- repair recommendations  

- verification steps  

- closeout checklist

---

# 6. ASSET SYSTEM OVERVIEW  

Assets include:

- asset profile  

- asset group  

- meters  

- telematics link  

- PM schedule  

- workorder history  

- diagnostic history  

- predictive health  

- 3D visualization  

- AIMI health score  

- multilingual labels  

- voice commands

---

# 7. PM SYSTEM OVERVIEW  

PM includes:

- PM templates  

- PM schedules  

- PM triggers  

- PM completion  

- PM findings  

- PM severity  

- PM predictive linkage  

- PM voice commands  

- PM multilingual support

---

# 8. PARTS SYSTEM OVERVIEW  

Parts include:

- inventory  

- stock levels  

- reorder points  

- vendor info  

- part usage history  

- part predictive usage  

- part linking to diagnostics  

- part linking to repairs  

- part linking to PM

---

# 9. SCHEDULING SYSTEM OVERVIEW  

Scheduling includes:

- technician schedules  

- bay schedules  

- asset availability  

- predictive scheduling  

- PM scheduling  

- workorder scheduling  

- voice scheduling  

- multilingual scheduling

---

# 10. TELEMATICS SYSTEM OVERVIEW  

Telematics includes:

- DTC ingestion  

- live data  

- fault detection  

- predictive modeling  

- AIMI severity  

- AIMI diagnostics  

- AIMI routing  

- AIMI scheduling  

- technician learning  

- asset health scoring

---

# 11. COMPLIANCE SYSTEM OVERVIEW  

Compliance includes:

- inspections  

- forms  

- checklists  

- driver reports  

- DOT compliance  

- school district compliance  

- multilingual compliance  

- voice compliance

---

# 12. UI/UX — NEON DARK COMMAND CENTER  

UI includes:

- neon purple accents  

- dark background  

- glowing buttons  

- adaptive UI  

- technician HUD mode  

- multilingual toggle  

- voice command button  

- AIMI insight feed  

- 3D fleet visualization  

- role‑based dashboards

---

# 13. VOICE SYSTEM OVERVIEW  

Voice commands include:

- create workorder  

- diagnose issue  

- next step  

- assign technician  

- close workorder  

- schedule PM  

- check asset health  

- check severity  

- check predictive alerts  

- multilingual voice commands

---

# 14. MULTILINGUAL SYSTEM OVERVIEW  

Supports:

- English  

- Spanish  

- French  

- German  

- Portuguese  

- Mandarin  

- Arabic  

All UI text, diagnostics, and voice commands are translated.

---

# 15. ADAPTIVE UI SYSTEM OVERVIEW  

Adaptive UI adjusts:

- brightness  

- contrast  

- neon intensity  

- button size  

- layout density  

- shop mode  

- office mode  

- night mode  

- HUD mode

---

# 16. 3D FLEET VISUALIZATION  

Includes:

- asset icons  

- bay layout  

- technician positions  

- severity colors  

- predictive overlays  

- telematics heatmaps  

- click‑to‑open workorder  

- click‑to‑open asset detail

---

# 17. EVENT BUS  

All major actions emit events:

- workorder.created  

- workorder.updated  

- workorder.completed  

- telematics.event  

- pm.completed  

- asset.updated  

- diagnostic.completed  

- [technician.feedback](http://technician.feedback)  

- predictive.alert  

AIMI listens and reacts.

---

# 18. DATABASE OVERVIEW  

All tables include:

- `id`  

- `tenant_id`  

- `created_at`  

- `updated_at`  

- `deleted_at` (soft delete)  

- `audit_log` (immutable)

AIMI tables include:

- DiagnosticFlows  

- DiagnosticSteps  

- DiagnosticHistory  

- DiagnosticVoiceLogs  

- TechnicianLearningProfile  

- AIMILearningWeights  

- PredictiveModels  

- SeverityHistory  

- RoutingHistory

---

# 19. API OVERVIEW  

API is versioned:

- `/api/v1/...`  

- `/api/v2/...` (future)  

Includes:

- assets  

- workorders  

- pm  

- parts  

- scheduling  

- telematics  

- diagnostics  

- aimi  

- multilingual  

- voice  

- adaptive-ui  

- 3d-visualization

---

# 20. FUTURE EXPANSION  

Blueprint v2 is designed for:

- new AI engines  

- new dashboards  

- new workflows  

- new diagnostics  

- new languages  

- new UI modes  

- new verticals  

- new integrations  

No rewrites required.

---

# END OF MASTER BLUEPRINT V2

