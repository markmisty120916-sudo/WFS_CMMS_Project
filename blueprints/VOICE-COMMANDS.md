# VOICE COMMAND SYSTEM  

## Voice Command Rules, Categories, Routing, and AIMI Integration  

## Part of Master Blueprint V2

---

# 1. VOICE COMMAND SYSTEM OVERVIEW  

The Voice Command System enables hands‑free operation across:

- diagnostics  

- workorder creation  

- workorder updates  

- scheduling  

- routing  

- PM workflows  

- compliance workflows  

- asset lookup  

- AIMI interaction  

- HUD Mode  

Voice behavior must be:

- deterministic  

- explainable  

- repeatable  

- tenant‑safe  

- role‑safe  

- multilingual  

- AIMI‑aware  

- drift‑proof  

Voice commands must never be guessed or invented.

---

# 2. VOICE COMMAND CATEGORIES  

The system supports eight immutable categories:

1. **Workorder Commands**  

2. **Diagnostic Commands**  

3. **Asset Commands**  

4. **Scheduling Commands**  

5. **PM Commands**  

6. **Compliance Commands**  

7. **Navigation Commands**  

8. **AIMI Commands**

Each category has strict routing rules.

---

# 3. WORKORDER COMMANDS  

Supported commands:

- “Create a workorder for this bus.”  

- “Add a note to this workorder.”  

- “Add a photo to this workorder.”  

- “Assign this to a technician.”  

- “Close this workorder.”  

- “Show recommended repair.”  

- “Show verification steps.”  

Rules:

- must map to correct workorder_id  

- must log voice input  

- must enforce RBAC  

- must enforce tenant isolation  

Forbidden:

- technician changing severity  

- technician changing routing  

- technician changing scheduling  

---

# 4. DIAGNOSTIC COMMANDS  

Supported commands:

- “AIMI, diagnose this issue.”  

- “Next step.”  

- “Repeat step.”  

- “Skip step.”  

- “Explain this step.”  

- “Show recommended parts.”  

- “Show fault history.”  

Rules:

- must follow diagnostic flow  

- must enforce verification  

- must log step compliance  

Forbidden:

- bypassing verification  

- modifying diagnostic flow  

---

# 5. ASSET COMMANDS  

Supported commands:

- “Show asset health.”  

- “Show telematics data.”  

- “Show predictive alerts.”  

- “Show PM schedule.”  

- “Show compliance status.”  

Rules:

- must enforce role‑safe visibility  

- must enforce tenant isolation  

Forbidden:

- exposing raw telematics payload  

- exposing manager‑only data to technicians  

---

# 6. SCHEDULING COMMANDS  

Supported commands:

- “Schedule this repair.”  

- “Assign a bay.”  

- “Assign a technician.”  

- “Show availability.”  

- “Show scheduling window.”  

Rules:

- must enforce scheduling logic  

- must enforce RBAC  

- must log scheduling intent  

Forbidden:

- technician overriding schedule  

- technician overriding routing  

---

# 7. PM COMMANDS  

Supported commands:

- “Start PM.”  

- “Log PM findings.”  

- “Complete PM.”  

- “Show PM checklist.”  

Rules:

- must enforce PM template  

- must enforce PM verification  

- must log PM findings  

Forbidden:

- technician modifying PM template  

---

# 8. COMPLIANCE COMMANDS  

Supported commands:

- “Start inspection.”  

- “Log inspection findings.”  

- “Complete inspection.”  

- “Show compliance status.”  

Rules:

- must enforce compliance templates  

- must enforce compliance verification  

- must log compliance findings  

Forbidden:

- bypassing compliance blocks  

- modifying compliance templates  

---

# 9. NAVIGATION COMMANDS  

Supported commands:

- “Go to workorders.”  

- “Go to assets.”  

- “Go to diagnostics.”  

- “Go to scheduling.”  

- “Go to PM.”  

- “Go to compliance.”  

Rules:

- must enforce role‑safe navigation  

- must enforce tenant isolation  

Forbidden:

- navigating to restricted dashboards  

---

# 10. AIMI COMMANDS  

Supported commands:

- “AIMI, explain this.”  

- “AIMI, summarize this.”  

- “AIMI, show insights.”  

- “AIMI, show predictive risk.”  

- “AIMI, show recommended action.”  

Rules:

- must enforce AIMI explainability  

- must enforce role‑safe visibility  

Forbidden:

- modifying AIMI learning weights  

- modifying predictive thresholds  

---

# 11. VOICE INPUT SOURCES  

Voice commands may originate from:

- technician mobile app  

- technician tablet  

- shop kiosk  

- driver kiosk  

- desktop browser  

- HUD Mode  

All voice input must be:

- logged  

- timestamped  

- tenant‑scoped  

- user‑scoped  

---

# 12. SPEECH RECOGNITION RULES  

Speech Recognition Layer must:

- convert speech to text  

- handle shop‑level noise  

- support multilingual input  

- stream voice input in real time  

Forbidden:

- partial recognition without confidence threshold  

- unlogged recognition  

---

# 13. INTENT DETECTION RULES  

Intent Detection Layer must:

- detect command type  

- detect command target  

- detect command parameters  

- detect language  

- detect confidence level  

Intent must be deterministic.

---

# 14. COMMAND ROUTING RULES  

Routing Layer must:

- route workorder commands → Workorder Module  

- route diagnostic commands → Diagnostic Module  

- route asset commands → Asset Module  

- route scheduling commands → Scheduling Module  

- route PM commands → PM Module  

- route compliance commands → Compliance Module  

- route navigation commands → UI Router  

- route AIMI commands → AIMI Core  

Routing must be deterministic.

---

# 15. MULTILINGUAL VOICE RULES  

Multilingual Voice Layer must:

- detect language  

- translate command  

- normalize command  

- route command  

- log original + translated text  

Supported languages:

- English  

- Spanish  

- French  

- German  

- Portuguese  

- Mandarin  

- Arabic  

---

# 16. VOICE LOGGING RULES  

Voice logs must include:

- original text  

- translated text  

- detected language  

- command category  

- command target  

- command parameters  

- diagnostic context  

- workorder context  

- asset context  

- technician ID  

- timestamp  

Logs must improve AIMI learning.

---

# 17. VOICE EVENTS  

Voice system emits:

- voice.command.received  

- voice.command.processed  

- voice.command.failed  

- voice.command.translated  

- voice.command.logged  

Events must include:

- tenant_id  

- user_id  

- role  

- category  

- timestamp  

---

# 18. VOICE UI RULES  

Voice UI must:

- use neon command center theme  

- use dark background  

- use high‑visibility accents  

- show waveform visualizer  

- show command history  

- show multilingual toggle  

Voice UI must never:

- change naming  

- change hierarchy  

- change color scheme  

---

# 19. FUTURE VOICE EXPANSION  

Supports future:

- new voice commands  

- new languages  

- new diagnostic flows  

- new UI modes  

- new technician learning features  

- new predictive voice alerts  

- new compliance voice flows  

Voice structure remains immutable.

---

# END OF VOICE COMMANDS BLUEPRINT

