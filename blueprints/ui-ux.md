# UI/UX Visual Blueprint  

## Full UI/UX Specification for Master Blueprint V2  

## Part of Hybrid Blueprint Structure

---

# 1. UI/UX OVERVIEW  

The WFS CMMS UI/UX system is designed for:

- technicians  

- fleet managers  

- drivers  

- inspectors  

- parts managers  

- compliance officers  

The design philosophy is:

- **Neon Dark Command Center**  

- **High contrast**  

- **Large actionable elements**  

- **Minimal cognitive load**  

- **Role‑based dashboards**  

- **Adaptive UI**  

- **Voice‑first workflows**  

- **Multilingual support**  

- **AIMI‑driven insights**  

UI/UX is not decoration — it is a functional system optimized for speed, clarity, and technician comfort.

---

# 2. GLOBAL DESIGN PRINCIPLES  

The entire UI follows these principles:

## 2.1 Clarity  

- Minimal text  

- Clear hierarchy  

- High contrast  

- Predictable layouts  

## 2.2 Speed  

- Large buttons  

- Quick actions  

- Voice shortcuts  

- AIMI recommendations  

## 2.3 Consistency  

- Unified color palette  

- Unified spacing system  

- Unified typography  

- Unified component library  

## 2.4 Accessibility  

- color‑blind safe  

- multilingual  

- voice‑enabled  

- adaptive UI  

## 2.5 Technician‑First  

- HUD mode  

- neon accents  

- simplified workflows  

- minimal navigation  

---

# 3. COLOR SYSTEM  

The Neon Dark Command Center theme uses:

## 3.1 Primary Colors  

- **Primary Blue:** `#1A73E8`  

- **Primary Dark Blue:** `#0F3D91`  

- **Primary Light Blue:** `#E8F1FF`  

## 3.2 Neutral Grays  

- **Gray 900:** `#1F1F1F`  

- **Gray 700:** `#3A3A3A`  

- **Gray 500:** `#7A7A7A`  

- **Gray 300:** `#D0D0D0`  

- **Gray 100:** `#F5F5F5`  

## 3.3 Severity Colors  

- **Low:** Green `#4CAF50`  

- **Medium:** Yellow `#FFC107`  

- **High:** Orange `#FF9800`  

- **Critical:** Red `#F44336`  

## 3.4 AIMI Colors  

- **AIMI Purple:** `#6A00FF`  

- **AIMI Glow:** `rgba(106, 0, 255, 0.15)`  

---

# 4. TYPOGRAPHY  

The system uses:

- **Font:** Inter  

- **Weights:** 400, 500, 600, 700  

- **Sizes:**  

  - Title: 24–32px  

  - Section header: 18–20px  

  - Body: 14–16px  

  - Labels: 12–14px  

Typography is designed for readability in shop environments.

---

# 5. SPACING SYSTEM  

The UI uses an **8‑point grid**:

- 8px base spacing  

- 16px padding on cards  

- 24px padding on pages  

- 32px spacing for major sections  

Spacing ensures consistency across all components.

---

# 6. COMPONENT SYSTEM  

The UI uses a unified component library:

## 6.1 Core Components  

- cards  

- tables  

- tabs  

- badges  

- modals  

- timeline  

- photo gallery  

- notes panel  

- AIMI recommendation banner  

- status chip  

- severity chip  

- asset header  

- workorder header  

## 6.2 Reusable Patterns  

- page header  

- section header  

- action bar  

- filter bar  

- search bar  

All components follow the Neon Dark theme.

---

# 7. INTERACTION PATTERNS  

Interaction patterns define how users interact with the system.

## 7.1 Workorder Detail  

Tabs:

- Overview  

- Notes  

- Photos  

- Labor  

- Parts  

- Timeline  

- AIMI  

Action bar:

- Approve  

- Schedule  

- Assign  

- Start  

- Complete  

- QA  

- Close  

AIMI banner:

- “AIMI recommends…”  

## 7.2 Scheduling  

- drag‑and‑drop  

- calendar view  

- bay view  

- technician view  

## 7.3 Parts  

- approve/deny modal  

- barcode scan  

- inventory adjust modal  

## 7.4 Telematics  

- fault code cards  

- severity badges  

- timeline of events  

---

# 8. ROLE‑BASED DASHBOARDS  

Each role has a dedicated dashboard.

## 8.1 Fleet Manager Dashboard  

Sections:

- workorders overview  

- AIMI alerts  

- schedule view  

- parts status  

- compliance status  

- telematics faults  

- asset health scores  

## 8.2 Technician Dashboard  

Sections:

- my workorders  

- assigned today  

- in progress  

- waiting parts  

- recently completed  

## 8.3 Shop Helper Dashboard  

Sections:

- simple tasks  

- low severity workorders  

- cleaning tasks  

- vehicle movement tasks  

## 8.4 Driver Dashboard  

Sections:

- submit defect  

- my defects  

- DVIR  

- asset info  

## 8.5 Parts Manager Dashboard  

Sections:

- parts requests  

- orders  

- receiving  

- inventory levels  

- reorder alerts  

## 8.6 Compliance Dashboard  

Sections:

- violations  

- DOT/OSHA status  

- PM compliance  

- safety alerts  

- AIMI compliance predictions  

## 8.7 AIMI Dashboard  

Sections:

- severity distribution  

- routing decisions  

- predictions  

- asset health scores  

- schedule risk  

---

# 9. HUD MODE  

HUD mode is optimized for:

- voice commands  

- diagnostics  

- hands‑free workflows  

- neon indicators  

- minimal UI  

HUD mode is activated automatically during diagnostics.

---

# 10. 3D FLEET VISUALIZATION  

The UI includes a 3D fleet view:

- asset icons  

- bay layout  

- technician positions  

- severity colors  

- predictive overlays  

- telematics heatmaps  

- click‑to‑open workorder  

- click‑to‑open asset detail  

3D visualization improves situational awareness.

---

# 11. AIMI UI INTEGRATION  

AIMI integrates with UI/UX through:

- AIMI Diagnose Button  

- AIMI Insight Feed  

- AIMI Severity Badges  

- AIMI Predictive Alerts  

- AIMI Routing Suggestions  

- AIMI Scheduling Suggestions  

- AIMI Diagnostic Steps  

- AIMI Verification Steps  

AIMI is visually present throughout the system.

---

# 12. MULTILINGUAL UI INTEGRATION  

UI supports multilingual:

- labels  

- buttons  

- menus  

- tooltips  

- diagnostic steps  

- verification steps  

- AIMI insights  

UI adjusts spacing and font size based on language.

---

# 13. VOICE UI INTEGRATION  

Voice UI includes:

- voice command button  

- waveform visualizer  

- voice command history  

- HUD mode voice interface  

Voice UI reduces technician interaction friction.

---

# 14. ADAPTIVE UI INTEGRATION  

Adaptive UI adjusts:

- brightness  

- contrast  

- neon intensity  

- button size  

- layout density  

- font size  

- UI mode  

Adaptive UI ensures comfort and speed.

---

# 15. UI/UX EVENT FLOW  

UI emits events:

- `ui.mode.changed`  

- `ui.component.interacted`  

- `ui.voice.used`  

- `ui.multilingual.changed`  

- `ui.adaptive.updated`  

AIMI consumes UI events for learning.

---

# 16. FUTURE UI/UX EXPANSION  

UI/UX supports future expansion:

- new dashboards  

- new UI modes  

- new languages  

- new voice workflows  

- new adaptive UI features  

- new AIMI insights  

- new 3D visualization layers  

No rewrites required.

---

# END OF UI/UX BLUEPRINT

