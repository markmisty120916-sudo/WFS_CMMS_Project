# FRONTEND STRUCTURE  

## Full Frontend Specification for Master Blueprint V2  

## Part of Hybrid Blueprint Structure

---

# 1. FRONTEND OVERVIEW  

The WFS CMMS frontend is:

- React‑based  

- Next.js‑powered  

- Neon Dark Command Center themed  

- role‑aware  

- tenant‑aware  

- AIMI‑integrated  

- voice‑enabled  

- multilingual  

- adaptive‑UI‑driven  

Primary goals:

- technician speed  

- manager clarity  

- driver simplicity  

- compliance visibility  

---

# 2. FRONTEND TECHNOLOGY STACK  

- Framework: Next.js (React)  

- Styling: Tailwind CSS (or equivalent utility system)  

- State: React Query / Zustand (or equivalent)  

- Routing: Next.js App Router  

- Auth: JWT + tenant header  

- Charts: modern chart library (e.g., Recharts)  

- 3D: WebGL/Three.js for fleet visualization  

---

# 3. FRONTEND DIRECTORY STRUCTURE  

Root:

- `/src/app/` → Next.js routes  

- `/src/components/` → shared components  

- `/src/features/` → vertical‑specific UI  

- `/src/hooks/` → shared hooks  

- `/src/lib/` → API clients, helpers  

- `/src/styles/` → theme, globals  

- `/src/config/` → constants, endpoints  

---

# 4. ROUTES STRUCTURE (APP DIRECTORY)  

## 4.1 Top‑Level Routes  

- `/login`  

- `/dashboard`  

- `/assets`  

- `/workorders`  

- `/pm`  

- `/parts`  

- `/scheduling`  

- `/telematics`  

- `/compliance`  

- `/aimi`  

- `/settings`  

Each route is role‑aware and tenant‑aware.

## 4.2 Example Route Layout  

`/src/app/workorders/page.tsx`  

- list view  

- filters  

- severity chips  

- AIMI banner  

`/src/app/workorders/[id]/page.tsx`  

- workorder detail  

- tabs: Overview, Notes, Photos, Labor, Parts, Timeline, AIMI  

---

# 5. SHARED COMPONENTS  

Located in `/src/components/`.

Core components:

- `LayoutShell`  

- `PageHeader`  

- `SectionHeader`  

- `Card`  

- `Table`  

- `Tabs`  

- `Badge`  

- `StatusChip`  

- `SeverityChip`  

- `AIMIBanner`  

- `Timeline`  

- `PhotoGallery`  

- `NotesPanel`  

- `FilterBar`  

- `SearchBar`  

- `ActionBar`  

- `Modal`  

HUD components:

- `HudShell`  

- `HudStepPanel`  

- `HudVoiceButton`  

- `HudSeverityIndicator`  

---

# 6. FEATURE MODULES  

Located in `/src/features/`.

## 6.1 Assets Feature  

- `features/assets/AssetList`  

- `features/assets/AssetDetail`  

- `features/assets/AssetHealthCard`  

## 6.2 Workorders Feature  

- `features/workorders/WorkorderList`  

- `features/workorders/WorkorderDetail`  

- `features/workorders/WorkorderTabs`  

## 6.3 PM Feature  

- `features/pm/PmTemplateList`  

- `features/pm/PmScheduleList`  

- `features/pm/PmHistoryList`  

## 6.4 Parts Feature  

- `features/parts/PartList`  

- `features/parts/InventoryPanel`  

- `features/parts/PartRequestsPanel`  

## 6.5 Scheduling Feature  

- `features/scheduling/TechnicianScheduleView`  

- `features/scheduling/BayScheduleView`  

- `features/scheduling/WorkorderSchedulePanel`  

## 6.6 Telematics Feature  

- `features/telematics/FaultList`  

- `features/telematics/LiveDataPanel`  

- `features/telematics/TelematicsTimeline`  

## 6.7 Compliance Feature  

- `features/compliance/InspectionList`  

- `features/compliance/InspectionDetail`  

- `features/compliance/ViolationPanel`  

## 6.8 AIMI Feature  

- `features/aimi/AimiDashboard`  

- `features/aimi/AimiInsightsPanel`  

- `features/aimi/AimiSeverityDistribution`  

---

# 7. DASHBOARDS  

## 7.1 Fleet Manager Dashboard  

Route: `/dashboard/manager`  

Sections:

- workorders overview  

- AIMI alerts  

- schedule view  

- parts status  

- compliance status  

- telematics faults  

- asset health scores  

## 7.2 Technician Dashboard  

Route: `/dashboard/technician`  

Sections:

- my workorders  

- assigned today  

- in progress  

- waiting parts  

- recently completed  

## 7.3 Driver Dashboard  

Route: `/dashboard/driver`  

Sections:

- submit defect  

- my defects  

- DVIR  

- asset info  

## 7.4 Parts Manager Dashboard  

Route: `/dashboard/parts`  

## 7.5 Compliance Dashboard  

Route: `/dashboard/compliance`  

## 7.6 AIMI Dashboard  

Route: `/dashboard/aimi`  

---

# 8. THEME & STYLING  

Neon Dark Command Center:

- background: dark gray/black  

- primary: blue  

- accent: AIMI purple  

- severity colors: green, yellow, orange, red  

Theme defined in:

- `/src/styles/theme.ts`  

- `/src/styles/globals.css`  

---

# 9. STATE & DATA FETCHING  

State:

- React Query (or equivalent) for server state  

- lightweight store (Zustand or similar) for UI state  

API clients in:

- `/src/lib/apiClient.ts`  

- `/src/lib/endpoints.ts`  

All requests include:

- JWT  

- tenant header  

---

# 10. MULTILINGUAL & ADAPTIVE UI  

Multilingual:

- translation hook: `useTranslation()`  

- language toggle in header  

- text keys in `/src/config/i18n/`  

Adaptive UI:

- hook: `useAdaptiveUi()`  

- adjusts brightness, contrast, button size, layout density, font size, mode  

HUD mode:

- activated in diagnostics routes  

- minimal UI, voice‑first  

---

# 11. VOICE INTEGRATION  

Voice UI:

- `VoiceButton`  

- `VoiceWaveform`  

- `VoiceHistoryPanel`  

Voice API:

- calls `/voice/commands`  

- integrates with AIMI diagnostics and navigation  

---

# 12. 3D FLEET VISUALIZATION  

Route: `/fleet-3d`  

Components:

- `Fleet3DScene`  

- `AssetIcon3D`  

- `BayLayout3D`  

- `SeverityOverlay3D`  

Uses WebGL/Three.js.

---

# 13. FRONTEND SECURITY  

Frontend enforces:

- role‑based route guards  

- tenant header injection  

- JWT presence checks  

Unauthorized users redirected to `/login`.

---

# 14. FUTURE FRONTEND EXPANSION  

Supports future:

- new dashboards  

- new HUD modes  

- new languages  

- new AIMI panels  

- new telematics views  

- new compliance modules  

No rewrites required.

---

# END OF FRONTEND STRUCTURE BLUEPRINT

