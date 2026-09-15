# WFS CMMS — Architecture Blueprint  

## System Architecture Specification for Master Blueprint V2  

## Part of Hybrid Blueprint Structure

---

# 1. ARCHITECTURE OVERVIEW  

WFS CMMS is built as a modular, scalable, AI‑driven maintenance platform.  

The architecture is divided into four major layers:

1. Frontend (Next.js + Tailwind + Neon Dark UI + Voice + Multilingual + Adaptive UI)  

2. Backend (Node.js + TypeScript + AIMI Engines + Event Bus + API Layer)  

3. Database (PostgreSQL + Tenant Isolation + Audit Logs + AIMI Learning Tables)  

4. Integrations (Telematics, OEM Diagnostics, Voice, Multilingual, Notifications)

Each layer is isolated but connected through AIMI and the event bus.

---

# 2. FRONTEND ARCHITECTURE  

The frontend is built using:

- **Next.js** (App Router)  

- **TypeScript**  

- **TailwindCSS**  

- **Neon Dark Command Center Theme**  

- **Adaptive UI Engine**  

- **Voice Command Interface**  

- **Multilingual UI Engine**  

- **3D Fleet Visualization (Three.js)**

## 2.1 Frontend Principles  

- Component‑driven  

- Role‑based UI  

- Technician‑friendly  

- High contrast  

- Large buttons  

- HUD mode  

- Zero drift naming conventions  

- All UI text is multilingual  

- All major actions support voice commands

## 2.2 Frontend Modules  

- `/components/` — shared UI components  

- `/app/(dashboard)/` — role‑based dashboards  

- `/app/assets/` — asset pages  

- `/app/workorders/` — workorder pages  

- `/app/pm/` — PM pages  

- `/app/parts/` — parts pages  

- `/app/scheduling/` — scheduling pages  

- `/app/telematics/` — telematics pages  

- `/app/compliance/` — compliance pages  

- `/app/aimi/` — AIMI insights, diagnostics, learning  

- `/app/settings/` — tenant + user settings  

- `/app/api/` — API routes (Next.js server actions)

## 2.3 Frontend UI Engines  

### Adaptive UI Engine  

Adjusts:

- brightness  

- contrast  

- neon intensity  

- button size  

- layout density  

- HUD mode  

- shop mode  

- office mode  

- night mode  

### Voice Engine  

Supports:

- “AIMI, diagnose this issue.”  

- “Next step.”  

- “Assign technician.”  

- “Close workorder.”  

- “Check asset health.”  

- “Show predictive alerts.”  

### Multilingual Engine  

Supports:

- English  

- Spanish  

- French  

- German  

- Portuguese  

- Mandarin  

- Arabic  

---

# 3. BACKEND ARCHITECTURE  

The backend is built using:

- **Node.js**  

- **TypeScript**  

- **Modular service architecture**  

- **AIMI intelligence engines**  

- **Event bus**  

- **API versioning**  

- **Telematics ingestion pipeline**  

- **Diagnostic engine**  

- **Technician learning engine**

## 3.1 Backend Principles  

- Modular  

- Scalable  

- Tenant‑safe  

- Role‑safe  

- Event‑driven  

- AI‑first  

- Zero drift  

- Predictable naming conventions  

- Versioned APIs

## 3.2 Backend Modules  

- `/services/assets/`  

- `/services/workorders/`  

- `/services/pm/`  

- `/services/parts/`  

- `/services/scheduling/`  

- `/services/telematics/`  

- `/services/compliance/`  

- `/services/aimi/`  

- `/services/diagnostics/`  

- `/services/multilingual/`  

- `/services/voice/`  

- `/services/adaptive-ui/`

## 3.3 AIMI Engines  

AIMI includes:

- Severity Engine  

- Routing Engine  

- Scheduling Engine  

- Predictive Engine  

- Diagnostic Engine  

- Technician Learning Engine  

- Multilingual NLP Engine  

Each engine is isolated but connected through AIMI Core.

---

# 4. DATABASE ARCHITECTURE  

The database is PostgreSQL with:

- Tenant isolation  

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

- Compliance tables

## 4.1 Database Principles  

- Every table includes `tenant_id`  

- Every table includes `created_at`, `updated_at`, `deleted_at`  

- All deletes are soft deletes  

- All changes are logged in audit tables  

- AIMI learning tables are append‑only  

- Predictive tables store historical patterns  

- Diagnostic tables store flows, steps, outcomes  

- Telematics tables store raw + processed data

## 4.2 Database Modules  

- `/db/assets/`  

- `/db/workorders/`  

- `/db/pm/`  

- `/db/parts/`  

- `/db/scheduling/`  

- `/db/telematics/`  

- `/db/compliance/`  

- `/db/aimi/`  

- `/db/diagnostics/`  

- `/db/multilingual/`  

- `/db/voice/`  

- `/db/adaptive-ui/`

---

# 5. INTEGRATION ARCHITECTURE  

Integrations include:

- Telematics providers  

- OEM diagnostic libraries  

- Azure Speech (voice)  

- Azure Translator (multilingual)  

- Email/SMS notifications  

- SSO (future phase)

## 5.1 Integration Principles  

- All integrations pass through the event bus  

- AIMI processes all incoming data  

- Telematics faults trigger diagnostics  

- PM triggers update predictive models  

- Workorder completion updates AIMI learning  

- Multilingual engine translates all text  

- Voice engine processes all commands

---

# 6. EVENT BUS ARCHITECTURE  

The event bus is the backbone of the system.

## 6.1 Event Types  

- `workorder.created`  

- `workorder.updated`  

- `workorder.completed`  

- `telematics.event.received`  

- `pm.completed`  

- `asset.updated`  

- `diagnostic.completed`  

- `technician.feedback`  

- `predictive.alert`  

## 6.2 Event Consumers  

- AIMI Core  

- AIMI Engines  

- Diagnostics Engine  

- Technician Learning Engine  

- Scheduling Engine  

- Predictive Engine  

- Notification Service  

- Multilingual Service  

- Voice Service  

- UI Adaptive Engine

---

# 7. API ARCHITECTURE  

APIs are versioned:

- `/api/v1/...`  

- `/api/v2/...` (future)

## 7.1 API Principles  

- RESTful  

- Predictable naming  

- Tenant‑safe  

- Role‑safe  

- AIMI‑aware  

- Versioned  

- Zero drift

## 7.2 API Modules  

- `/api/assets/`  

- `/api/workorders/`  

- `/api/pm/`  

- `/api/parts/`  

- `/api/scheduling/`  

- `/api/telematics/`  

- `/api/compliance/`  

- `/api/aimi/`  

- `/api/diagnostics/`  

- `/api/multilingual/`  

- `/api/voice/`  

- `/api/adaptive-ui/`

---

# 8. FUTURE ARCHITECTURE EXPANSION  

Blueprint V2 supports:

- new AIMI engines  

- new verticals  

- new dashboards  

- new workflows  

- new UI modes  

- new languages  

- new integrations  

- new predictive models  

No rewrites required.

---

# END OF ARCHITECTURE BLUEPRINT

